import type { Document } from '../../types/document';

export interface IDocumentService {
  getDocuments(): Promise<Document[]>;
  getDocumentById(id: string): Promise<Document | undefined>;
  uploadDocument(file: File, caseId: string, documentType?: string, documentId?: string): Promise<Document>;
  
  getDocumentPreviewBlob(versionId: string): Promise<Blob>;
  getIntegrityDetails(versionId: string): Promise<any>;
  getVersionHistory(documentId: string): Promise<any[]>;
  
  getExternalDocuments(): Promise<Document[]>;
  getExternalDocumentPreviewBlob(versionId: string): Promise<Blob>;

  acceptExtraction(versionId: string): Promise<void>;
  editExtraction(versionId: string, text: string): Promise<void>;
  reprocessDocument(versionId: string): Promise<void>;
  getDocumentActivity(documentId: string): Promise<any[]>;
  updateAiPermission(documentId: string, enabled: boolean): Promise<Document>;
}
