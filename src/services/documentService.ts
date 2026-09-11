import type { Document } from '../types/document';
import { MOCK_DOCUMENTS } from '../mock/documents';

/**
 * Frontend simulation of a Document Intelligence API.
 */
class DocumentService {
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

  // Future stub for uploading documents
  async uploadDocument(file: File, caseId: string): Promise<Document> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: `DOC-NEW-${Date.now()}`,
          caseId,
          name: file.name,
          type: 'OTHER',
          status: 'UPLOADED',
          version: 'v1',
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
}

export const documentService = new DocumentService();
