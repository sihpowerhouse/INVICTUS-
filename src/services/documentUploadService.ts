import { processingService, type ProcessingState } from './processingService';
import { documentService } from './documentService';
import type { Document } from '../types/document';

class DocumentUploadService {
  async processUpload(
    file: File,
    caseId: string,
    onProgress: (state: ProcessingState) => void
  ): Promise<Document> {
    // 1. Upload first (so we get the versionId to poll)
    const newDoc = await documentService.uploadDocument(file, caseId);
    
    // 2. Poll processing status using the returned version string
    await processingService.startProcessingJob(newDoc.versionId, onProgress);
    
    return newDoc;
  }
}

export const documentUploadService = new DocumentUploadService();
