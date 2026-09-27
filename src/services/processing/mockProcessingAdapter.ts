import type { IProcessingService, ProcessingJobHandle, ProcessingState } from './ProcessingServiceInterface';

export class MockProcessingAdapter implements IProcessingService {
  private readonly MOCK_DELAY = 800;

  startProcessingJob(
    _versionId: string,
    onProgress: (state: ProcessingState) => void,
    options?: { aiQueued?: boolean }
  ): ProcessingJobHandle {
    let cancelled = false;
    let intervalId: ReturnType<typeof setInterval> | null = null;

    const cancel = () => {
      cancelled = true;
      if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };

    const promise = new Promise<void>((resolve) => {
      if (options?.aiQueued === false) {
        resolve();
        return;
      }

      let currentStage = 0;
      const stages: ProcessingState['stage'][] = [
        'UPLOADED', 'SECURED', 'INTEGRITY_VERIFIED', 'PROCESSING_JOB_CREATED',
        'DOCUMENT_LOADED', 'TEXT_EXTRACTION', 'OCR', 'CHUNKING', 'INDEXING', 'READY'
      ];

      intervalId = setInterval(() => {
        if (cancelled) return;
        if (currentStage < stages.length) {
          onProgress({
            stage: stages[currentStage],
            progress: Math.floor(((currentStage + 1) / stages.length) * 100)
          });
          currentStage++;
        } else {
          if (intervalId !== null) clearInterval(intervalId);
          resolve();
        }
      }, this.MOCK_DELAY);
    });

    promise.finally(cancel);

    return { promise, cancel };
  }
}
