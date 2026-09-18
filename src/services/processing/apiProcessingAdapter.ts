import type { IProcessingService, ProcessingState } from './ProcessingServiceInterface';
import { apiClient } from '../api/apiClient';

// Maps the actual backend stage strings (from case_ai_documents.stage) to
// the frontend ProcessingState['stage'] enum values.
// Backend stages: queued | downloading_document | document_loaded | sending_to_ai
//   | native_extraction_complete | ai_extraction_complete | saving_extracted_text
//   | creating_searchable_chunks | completed | failed
const BACKEND_STAGE_MAP: Record<string, ProcessingState['stage']> = {
  queued:                       'PROCESSING_JOB_CREATED',
  downloading_document:         'DOCUMENT_LOADED',
  document_loaded:              'DOCUMENT_LOADED',
  sending_to_ai:                'TEXT_EXTRACTION',
  native_extraction_complete:   'OCR',
  ai_extraction_complete:       'OCR',
  saving_extracted_text:        'CHUNKING',
  creating_searchable_chunks:   'INDEXING',
  completed:                    'READY',
  // Fallback for any future stages
  failed:                       'INDEXING',
};

export class ApiProcessingAdapter implements IProcessingService {
  async startProcessingJob(versionId: string, onProgress: (state: ProcessingState) => void): Promise<void> {
    return new Promise((resolve, reject) => {
      let consecutiveErrors = 0;

      const poll = async () => {
        try {
          const aiStatus = await apiClient.get<any>(`/documents/ai-status/${encodeURIComponent(versionId)}`);
          consecutiveErrors = 0;

          let stage: ProcessingState['stage'] = 'UPLOADED';
          let progress: number = aiStatus.progress_percent ?? 0;

          // Backend returns status: 'pending' | 'processing' | 'completed' | 'failed'
          // When no AI row exists yet, the endpoint returns { status: 'not_started', ... }
          const rawStatus: string = aiStatus.status || 'not_started';
          const rawStage: string | undefined = aiStatus.stage;

          if (rawStatus === 'completed') {
            stage = 'READY';
            progress = 100;
          } else if (rawStatus === 'failed') {
            reject(new Error(aiStatus.error || 'Document AI processing failed.'));
            return;
          } else {
            // 'pending' | 'processing' | 'not_started' → keep polling, map stage
            if (rawStage) {
              // First check the explicit backend→frontend map
              const mapped = BACKEND_STAGE_MAP[rawStage.toLowerCase()];
              if (mapped) {
                stage = mapped;
              } else if (
                (['UPLOADED','SECURED','INTEGRITY_VERIFIED','PROCESSING_JOB_CREATED',
                  'DOCUMENT_LOADED','TEXT_EXTRACTION','OCR','CHUNKING','INDEXING','READY'] as string[])
                  .includes(rawStage.toUpperCase())
              ) {
                // Exact match with frontend enum (legacy / future-proofing)
                stage = rawStage.toUpperCase() as ProcessingState['stage'];
              } else {
                stage = 'TEXT_EXTRACTION';
              }
            } else {
              // No stage field yet — job is queued but not started
              stage = 'PROCESSING_JOB_CREATED';
            }
          }

          onProgress({ stage, progress });

          if (stage === 'READY') {
            resolve();
          } else {
            setTimeout(poll, 2000);
          }
        } catch (error) {
          consecutiveErrors++;
          if (consecutiveErrors > 5) {
            reject(new Error('Failed to poll processing status after multiple attempts.'));
          } else {
            setTimeout(poll, 2000);
          }
        }
      };

      // Start initial poll after a short delay to allow the background task to begin.
      setTimeout(poll, 1000);
    });
  }
}
