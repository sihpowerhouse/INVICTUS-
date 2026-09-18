import type { IProcessingService, ProcessingState } from './ProcessingServiceInterface';

export class MockProcessingAdapter implements IProcessingService {
  private readonly MOCK_DELAY = 800;

  async startProcessingJob(_versionId: string, onProgress: (state: ProcessingState) => void): Promise<void> {
    return new Promise((resolve) => {
      let currentStage = 0;
      const stages: ProcessingState['stage'][] = [
        'UPLOADED', 'SECURED', 'INTEGRITY_VERIFIED', 'PROCESSING_JOB_CREATED', 'DOCUMENT_LOADED', 'TEXT_EXTRACTION', 'OCR', 'CHUNKING', 'INDEXING', 'READY'
      ];
      
      const interval = setInterval(() => {
        if (currentStage < stages.length) {
          onProgress({
            stage: stages[currentStage],
            progress: Math.floor(((currentStage + 1) / stages.length) * 100)
          });
          currentStage++;
        } else {
          clearInterval(interval);
          resolve();
        }
      }, this.MOCK_DELAY);
    });
  }
}
