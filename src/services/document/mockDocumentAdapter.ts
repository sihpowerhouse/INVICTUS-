import type { IDocumentService } from './DocumentServiceInterface';
import type { Document } from '../../types/document';
import { MOCK_DOCUMENTS } from '../../mock/documents';

export class MockDocumentAdapter implements IDocumentService {
  async getDocuments(): Promise<Document[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...MOCK_DOCUMENTS]), 400);
    });
  }

  async getDocumentById(id: string): Promise<Document | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const doc = MOCK_DOCUMENTS.find(d => d.id === id);
        resolve(doc);
      }, 300);
    });
  }

  async uploadDocument(file: File, caseId: string, documentType = 'OTHER'): Promise<Document> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: `DOC-NEW-${Date.now()}`,
          caseId,
          name: file.name,
          type: (documentType as any) || 'OTHER',
          status: 'UPLOADED',
          version: 'v1',
          versionId: `mock-uuid-${Date.now()}`,
          language: 'UNKNOWN',
          pages: 1,
          size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
          uploadedBy: 'CURRENT USER',
          department: 'OPERATIONS',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          confidentiality: 'RESTRICTED'
        });
      }, 1500);
    });
  }

  async getDocumentPreviewBlob(_versionId: string): Promise<Blob> {
    // Return empty blob for mock preview
    return new Promise((resolve) => {
      setTimeout(() => resolve(new Blob([])), 500);
    });
  }

  async getIntegrityDetails(versionId: string): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(() => resolve({
        version_id: versionId,
        merkle_root: 'mock_merkle_root_abcdef1234567890',
        file_hash: 'mock_file_hash_0987654321fedcba',
        signature_valid: true,
        timestamp: new Date().toISOString(),
        verified_by: 'Mock Auth'
      }), 400);
    });
  }
  async getVersionHistory(documentId: string): Promise<any[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([
        {
          version_id: `${documentId}-v1`,
          document_id: documentId,
          created_at: new Date().toISOString(),
          uploaded_by: 'MOCK USER',
          file_hash: 'mock_hash',
          is_current: true
        }
      ]), 300);
    });
  }

  async getExternalDocuments(): Promise<Document[]> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([
          {
            id: 'DOC-EXT-1',
            caseId: 'CASE-2026-0042',
            name: 'External_Witness_Statement.pdf',
            type: 'OTHER',
            status: 'VERIFIED',
            version: 'V1',
            versionId: 'mock-ext-v1-uuid',
            language: 'ENGLISH',
            pages: 2,
            size: '1.4 MB',
            uploadedBy: 'External',
            department: 'DEFENSE',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            confidentiality: 'RESTRICTED'
          }
        ]);
      }, 500);
    });
  }

  async getExternalDocumentPreviewBlob(versionId: string): Promise<Blob> {
    return this.getDocumentPreviewBlob(versionId);
  }
}
