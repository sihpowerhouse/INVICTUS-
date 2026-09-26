export interface ProcessingState {
  stage: 'UPLOADED' | 'SECURED' | 'INTEGRITY_VERIFIED' | 'PROCESSING_JOB_CREATED' | 'DOCUMENT_LOADED' | 'TEXT_EXTRACTION' | 'OCR' | 'CHUNKING' | 'INDEXING' | 'READY';
  progress: number;
}

/**
 * Returned by startProcessingJob so the caller can cancel the poll loop
 * (e.g. when the modal unmounts or the user explicitly closes).
 */
export interface ProcessingJobHandle {
  /** Promise that resolves when READY or rejects on terminal failure. */
  promise: Promise<void>;
  /** Cancel the poll loop immediately (no-op if already settled). */
  cancel: () => void;
}

export interface IProcessingService {
  startProcessingJob(
    versionId: string,
    onProgress: (state: ProcessingState) => void,
    options?: { aiQueued?: boolean }
  ): ProcessingJobHandle;
}
