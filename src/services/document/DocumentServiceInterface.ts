import type { Document } from '../../types/document';

export interface IDocumentService {
  getDocuments(): Promise<Document[]>;
  getDocumentById(id: string): Promise<Document | undefined>;
  uploadDocument(file: File, caseId: string, documentType?: string): Promise<Document>;
  
  // New methods for Phase 2:
  getDocumentPreviewBlob(versionId: string): Promise<Blob>;
  getIntegrityDetails(versionId: string): Promise<any>;
  getVersionHistory(documentId: string): Promise<any[]>;
  
  // External Access
  getExternalDocuments(): Promise<Document[]>;
  getExternalDocumentPreviewBlob(versionId: string): Promise<Blob>;
}
