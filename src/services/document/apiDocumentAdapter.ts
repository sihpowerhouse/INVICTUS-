import type { IDocumentService } from './DocumentServiceInterface';
import type { Document, DocumentType, DocumentStatus } from '../../types/document';
import { apiClient } from '../api/apiClient';
import { ApiError } from '../api/ApiError';

// ── Elevation error ───────────────────────────────────────────────────────────

/**
 * Thrown by getDocuments() when the backend reports that VIEW_FILES OTP
 * elevation is required. The caller (DocumentsPage) must show the OTP modal,
 * verify, then call getDocuments() again.
 */
export class ElevationRequiredError extends Error {
  constructor() {
    super('VIEW_FILES elevation required. Please verify your identity.');
    this.name = 'ElevationRequiredError';
  }
}

// ── Field mappers ─────────────────────────────────────────────────────────────

function mapDocType(raw: string | undefined): DocumentType {
  const t = (raw || '').toLowerCase();
  const map: Record<string, DocumentType> = {
    fir:                'FIR',
    evidence:           'EVIDENCE_RECORD',
    forensic_report:    'FORENSIC_REPORT',
    postmortem_report:  'FORENSIC_REPORT',
    witness_statement:  'WITNESS_STATEMENT',
    suspect_interview:  'WITNESS_STATEMENT',
    medical_report:     'FORENSIC_REPORT',
    charge_sheet:       'CHARGE_SHEET',
    court_order:        'COURT_FILING',
    judgment:           'COURT_FILING',
    cctv:               'EVIDENCE_RECORD',
    police_report:      'POLICE_REPORT',
    other:              'OTHER',
  };
  return map[t] ?? 'OTHER';
}

function mapDocStatus(aiStatus: string | undefined, integrityValid: boolean | undefined): DocumentStatus {
  // If integrity is explicitly invalid, surface that.
  if (integrityValid === false) return 'REQUIRES_REVIEW';
  switch ((aiStatus || '').toLowerCase()) {
    case 'completed':    return 'VERIFIED';
    case 'processing':   return 'PROCESSING';
    case 'failed':       return 'FAILED';
    case 'pending':      return 'PROCESSING';
    case 'not_started':  return 'UPLOADED';
    default:             return 'UPLOADED';
  }
}

// ── Per-case document fetch ───────────────────────────────────────────────────

/**
 * Result of a single /case/documents fetch.
 * `needsElevation` = true means a 403 was returned (not an error, just unauthed).
 */
interface CaseDocResult {
  docs: Document[];
  needsElevation: boolean;
}

async function fetchCaseDocuments(caseId: string): Promise<CaseDocResult> {
  try {
    const raw = await apiClient.get<any>(`/case/documents?case_id=${encodeURIComponent(caseId)}`);
    const docs: any[] = raw?.documents ?? [];

    const mapped: Document[] = docs.map((d: any): Document => {
      const filename: string = d.filename || d.document_id || 'Document';
      const versionNum: number = d.version?.version_number ?? 1;
      const versionId: string  = d.version?.version_id ?? d.current_version_id ?? '';
      const integrityValid: boolean | undefined = d.integrity?.valid;

      return {
        id:              d.document_id,
        caseId:          d.case_id,
        name:            filename,
        type:            mapDocType(d.document_type),
        status:          mapDocStatus(d.ai?.status, integrityValid),
        version:         versionId ? `v${versionNum}` : 'v1',
        versionId:       versionId,
        language:        'UNKNOWN',
        pages:           Array.isArray(d.ai?.pages) ? d.ai.pages.length : 1,
        size:            'N/A',
        uploadedBy:      d.uploader_id ?? 'UNKNOWN',
        department:      'N/A',
        createdAt:       d.version?.timestamp ?? new Date().toISOString(),
        updatedAt:       d.version?.timestamp ?? new Date().toISOString(),
        ocrConfidence:   d.ai?.confidence ?? undefined,
        extractionMethod: d.ai?.provider  ?? undefined,
        confidentiality: 'RESTRICTED',
      };
    });

    return { docs: mapped, needsElevation: false };
  } catch (err) {
    if (err instanceof ApiError && (err.status === 403 || err.status === 401)) {
      // 403 = elevation not active for this session.
      return { docs: [], needsElevation: true };
    }
    // Any other error: log and skip this case (network blip, 5xx, etc.)
    console.warn(`[DocumentRegistry] Could not load documents for case ${caseId}:`, err);
    return { docs: [], needsElevation: false };
  }
}

// ── Adapter ───────────────────────────────────────────────────────────────────

export class ApiDocumentAdapter implements IDocumentService {

  /**
   * Fetch all documents the authenticated user is authorized to see.
   *
   * Flow:
   *   GET /case/my  →  authorized case list
   *   GET /case/documents?case_id=<id>  per case
   *
   * Throws ElevationRequiredError when the backend consistently returns 403
   * (i.e. VIEW_FILES OTP elevation has not been granted or has expired).
   * Caller must handle this by showing the OTP modal.
   *
   * Returns [] if authenticated and elevated but genuinely no documents exist.
   */
  async getDocuments(): Promise<Document[]> {
    // ── PRIMARY: single aggregated endpoint (avoids N+1 sequential calls) ──
    try {
      const raw = await apiClient.get<any>('/documents/my');
      const docs: any[] = raw?.documents ?? [];

      return docs.map((d: any): Document => {
        const filename: string = d.filename || d.document_id || 'Document';
        const versionNum: number = d.version?.version_number ?? 1;
        const versionId: string  = d.version?.version_id ?? d.current_version_id ?? '';
        const integrityValid: boolean | undefined = d.integrity?.valid;

        return {
          id:              d.document_id,
          caseId:          d.case_id,
          name:            filename,
          type:            mapDocType(d.document_type),
          status:          mapDocStatus(d.ai?.status, integrityValid),
          version:         versionId ? `v${versionNum}` : 'v1',
          versionId:       versionId,
          language:        'UNKNOWN',
          pages: d.ai?.pages ? (Array.isArray(d.ai.pages) ? d.ai.pages.length : d.ai.pages) : 1,
          size:            'N/A',
          uploadedBy:      d.uploader_id ?? 'UNKNOWN',
          department:      'N/A',
          createdAt:       d.version?.timestamp ?? new Date().toISOString(),
          updatedAt:       d.version?.timestamp ?? new Date().toISOString(),
          ocrConfidence:   d.ai?.confidence ?? undefined,
          extractionMethod: d.ai?.provider  ?? undefined,
          confidentiality: 'RESTRICTED',
        };
      });
    } catch (err: any) {
      // 403 = elevation required
      if (err instanceof ApiError && (err.status === 403 || err.status === 401)) {
        throw new ElevationRequiredError();
      }
      // 404 = /documents/my not available (old backend) → fall back to N+1
      if (err instanceof ApiError && err.status === 404) {
        console.warn('[DocumentRegistry] /documents/my not available, falling back to per-case fetch');
        return this._getDocumentsFallback();
      }
      throw err;
    }
  }

  /**
   * Fallback: per-case document fetch (N+1 pattern).
   * Used only when /documents/my is not available on the backend.
   */
  private async _getDocumentsFallback(): Promise<Document[]> {
    // 1. Get authorized case list (no OTP required)
    let myCases: any[] = [];
    try {
      myCases = await apiClient.get<any[]>('/case/my');
    } catch (err) {
      console.warn('[DocumentRegistry] Could not fetch case list:', err);
      return [];
    }

    if (!myCases || myCases.length === 0) {
      return [];
    }

    // 2. Fetch documents per case
    const seen = new Set<string>();
    const allDocs: Document[] = [];
    let elevationNeeded = false;

    for (const c of myCases) {
      const caseId: string = c.case_id;
      if (!caseId) continue;

      const result = await fetchCaseDocuments(caseId);

      if (result.needsElevation) {
        elevationNeeded = true;
        // Do NOT return early — check all cases.
        // (If some cases 403 and others succeed, show what we can.)
        continue;
      }

      for (const doc of result.docs) {
        if (!seen.has(doc.id)) {
          seen.add(doc.id);
          allDocs.push(doc);
        }
      }
    }

    // If every case returned 403 and we got no documents at all,
    // elevation is required. Signal the caller.
    if (elevationNeeded && allDocs.length === 0) {
      throw new ElevationRequiredError();
    }

    return allDocs;
  }

  async getDocumentById(id: string): Promise<Document | undefined> {
    try {
      const data = await apiClient.get<any>(`/documents/versions/${encodeURIComponent(id)}`);
      if (data?.document) {
        const versions = data.versions || [];
        const latestVersion = versions.length > 0 ? versions[versions.length - 1] : null;

        return {
          id: data.document.document_id,
          caseId: data.document.case_id,
          name: data.document.filename || id,
          type: mapDocType(data.document.document_type),
          status: 'VERIFIED',
          version: latestVersion ? `v${latestVersion.version_number}` : 'v1',
          versionId: latestVersion ? latestVersion.version_id : '',
          language: 'UNKNOWN',
          pages: 1,
          size: 'UNKNOWN',
          uploadedBy: 'SYSTEM',
          department: 'N/A',
          createdAt: latestVersion ? latestVersion.timestamp : data.document.created_at,
          updatedAt: latestVersion ? latestVersion.timestamp : data.document.created_at,
          confidentiality: 'RESTRICTED',
          versions: versions
        };
      }
      return undefined;
    } catch (err) {
      console.warn('Could not fetch document by id', err);
      return undefined;
    }
  }

  async uploadDocument(file: File, caseId: string, documentType = 'other', documentId?: string): Promise<Document> {
    const formData = new FormData();
    formData.append('case_id', caseId);

    let backendDocType = 'other';
    switch (documentType.toUpperCase()) {
      case 'EVIDENCE': backendDocType = 'evidence'; break;
      case 'LEGAL_DOCUMENT': backendDocType = 'court_order'; break;
      case 'MEDIA': backendDocType = 'cctv'; break;
      case 'REPORT': backendDocType = 'forensic_report'; break;
      case 'FIR': backendDocType = 'fir'; break;
      default: backendDocType = 'other'; break;
    }
    formData.append('document_type', backendDocType);

    formData.append('file', file);
    if (documentId) {
      formData.append('document_id', documentId);
    }

    const data = await apiClient.post<any>('/documents/upload', formData);

    return {
      id: data.document_id,
      caseId: data.case_id ?? caseId,
      name: data.filename || file.name,
      type: mapDocType(documentType),
      status: 'UPLOADED',
      version: 'v1',
      versionId: data.version_id || '',
      language: 'UNKNOWN',
      pages: 1,
      size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      uploadedBy: 'CURRENT USER',
      department: 'N/A',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      confidentiality: 'RESTRICTED'
    };
  }

  async getDocumentPreviewBlob(versionId: string): Promise<Blob> {
    return apiClient.get<Blob>(`/documents/preview/${encodeURIComponent(versionId)}`, {
      responseType: 'blob'
    });
  }

  async getIntegrityDetails(versionId: string): Promise<any> {
    return apiClient.get<any>(`/documents/verify/${encodeURIComponent(versionId)}`);
  }

  async getVersionHistory(documentId: string): Promise<any[]> {
    const data = await apiClient.get<any>(`/documents/versions/${encodeURIComponent(documentId)}`);
    return data?.versions || [];
  }

  async getExternalDocuments(): Promise<Document[]> {
    const data = await apiClient.get<any>('/external/documents');
    return data.documents || [];
  }

  async getExternalDocumentPreviewBlob(versionId: string): Promise<Blob> {
    return apiClient.get<Blob>(`/external/documents/file/${encodeURIComponent(versionId)}`, {
      responseType: 'blob'
    });
  }

  async acceptExtraction(versionId: string): Promise<void> {
    await apiClient.post(`/documents/extract/${encodeURIComponent(versionId)}/accept`, {});
  }

  async editExtraction(versionId: string, text: string): Promise<void> {
    await apiClient.post(`/documents/extract/${encodeURIComponent(versionId)}/edit`, {
      extracted_text: text
    });
  }

  async reprocessDocument(versionId: string): Promise<void> {
    await apiClient.post(`/documents/extract/${encodeURIComponent(versionId)}/reprocess`, {});
  }

  async getDocumentActivity(documentId: string): Promise<any[]> {
    const data = await apiClient.get<any>(`/documents/activity/${encodeURIComponent(documentId)}`);
    return data?.activity || [];
  }
}
