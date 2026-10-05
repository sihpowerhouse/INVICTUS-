import type { ICaseService } from './CaseServiceInterface';
import type { Case, CaseStatus, CasePriority } from '../../types/case';
import { apiClient } from '../api/apiClient';

export class ApiCaseAdapter implements ICaseService {
  async getCases(): Promise<Case[]> {
    const data = await apiClient.get<any[]>('/case/my');
    
    return data.map(item => this.mapBackendCaseToFrontend(item));
  }

  async getCaseById(id: string): Promise<Case | null> {
    try {
      // 1. Fetch metadata
      const data = await apiClient.get<any[]>(`/case/search?q=${encodeURIComponent(id)}`);
      const found = data.find(c => c.case_id === id || c.fir_id === id || (c.cases && c.cases.fir_id === id));
      
      if (!found) return null;
      
      const caseData = this.mapBackendSearchCaseToFrontend(found);
      
      // 2. Fetch documents
      try {
        const raw = await apiClient.get<any>(`/case/documents?case_id=${encodeURIComponent(found.case_id)}`);
        const docs = raw?.documents || [];
        caseData.documents = docs.map((doc: any) => ({
          id: doc.document_id,
          name: doc.filename || doc.document_id || 'Unknown Document',
          type: doc.document_type || 'UNKNOWN',
          version: doc.current_version_id ? 'v1' : 'v1',
          versionId: doc.current_version_id || '',
          status: doc.ai?.status === 'completed' ? 'VERIFIED' : 'UPLOADED'
        }));
        caseData.documentsCount = caseData.documents?.length || 0;
        caseData.evidenceCount = (caseData.documents || []).filter((d: any) => ['EVIDENCE', 'EVIDENCE_RECORD', 'FORENSIC_REPORT', 'PHYSICAL_EVIDENCE'].includes((d.type || '').toUpperCase())).length;
      } catch (docErr) {
        console.error('Failed to fetch case documents', docErr);
        caseData.documents = [];
        caseData.documentsCount = 0;
        caseData.evidenceCount = 0;
      }
      
      return caseData;
    } catch (err) {
      console.error('Failed to fetch case by id', err);
      return null;
    }
  }

  async searchCases(q: string): Promise<Case[]> {
    if (!q || q.length < 2) return [];
    
    const data = await apiClient.get<any[]>(`/case/search?q=${encodeURIComponent(q)}`);
    return data.map(item => this.mapBackendSearchCaseToFrontend(item));
  }

  private mapBackendCaseToFrontend(item: any): Case {
    const backendStatus = item.cases?.status?.toUpperCase() || 'NEW';
    const mappedStatus = ['NEW', 'ACTIVE', 'REVIEW', 'ON_HOLD', 'CLOSED', 'ARCHIVED'].includes(backendStatus) 
      ? backendStatus as CaseStatus 
      : 'NEW';

    return {
      id: item.case_id,
      firNumber: item.cases?.fir_id,
      title: item.cases?.fir_id ? `FIR ${item.cases.fir_id}` : `Case ${item.case_id.substring(0, 8)}`,
      status: mappedStatus,
      priority: 'MEDIUM' as CasePriority, // Defaulting as backend doesn't provide
      attention: 'NONE',
      isNew: false,
      officer: 'Unassigned',
      department: 'N/A',
      createdAt: item.cases?.created_at || new Date().toISOString(),
      updatedAt: item.cases?.created_at || new Date().toISOString(),
      lastActivityAt: item.cases?.created_at || new Date().toISOString(),
      description: '',
      documentsCount: 0,
      evidenceCount: 0,
      personsCount: 0,
      locationsCount: 0,
      lastActivity: 'Loaded from server',
    };
  }

  private mapBackendSearchCaseToFrontend(item: any): Case {
    const backendStatus = item.status?.toUpperCase() || 'NEW';
    const mappedStatus = ['NEW', 'ACTIVE', 'REVIEW', 'ON_HOLD', 'CLOSED', 'ARCHIVED'].includes(backendStatus) 
      ? backendStatus as CaseStatus 
      : 'NEW';

    return {
      id: item.case_id,
      firNumber: item.fir_id,
      title: item.fir_id ? `FIR ${item.fir_id}` : `Case ${item.case_id.substring(0, 8)}`,
      status: mappedStatus,
      priority: 'MEDIUM' as CasePriority,
      attention: 'NONE',
      isNew: false,
      officer: 'Unassigned',
      department: 'N/A',
      createdAt: item.created_at || new Date().toISOString(),
      updatedAt: item.created_at || new Date().toISOString(),
      lastActivityAt: item.created_at || new Date().toISOString(),
      description: '',
      documentsCount: 0,
      evidenceCount: 0,
      personsCount: 0,
      locationsCount: 0,
      lastActivity: 'Loaded from search',
    };
  }
}
