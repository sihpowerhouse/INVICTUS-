export interface ProcessingState {
  stage: 'UPLOADED' | 'SECURED' | 'INTEGRITY_VERIFIED' | 'PROCESSING_JOB_CREATED' | 'DOCUMENT_LOADED' | 'TEXT_EXTRACTION' | 'OCR' | 'CHUNKING' | 'INDEXING' | 'READY';
  progress: number;
}

export interface IProcessingService {
  startProcessingJob(versionId: string, onProgress: (state: ProcessingState) => void): Promise<void>;
}
