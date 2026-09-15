import { processingService, type ProcessingState } from './processingService';
import { documentService } from './documentService';
import type { Document } from '../types/document';

class DocumentUploadService {
  async processUpload(
    file: File,
    caseId: string,
    onProgress: (state: ProcessingState) => void
  ): Promise<Document> {
    // Start processing
    await processingService.startProcessingJob(caseId, onProgress);
    
    // Simulate API upload & document creation
    const newDoc = await documentService.uploadDocument(file, caseId);
    return newDoc;
  }
}

export const documentUploadService = new DocumentUploadService();
