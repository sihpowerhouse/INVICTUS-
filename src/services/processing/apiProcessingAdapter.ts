import type { IProcessingService, ProcessingJobHandle, ProcessingState } from './ProcessingServiceInterface';
import { apiClient } from '../api/apiClient';

// ---------------------------------------------------------------------------
// Backend → Frontend stage mapping
// Backend stages returned in case_ai_documents.stage:
//   queued | downloading_document | document_loaded | sending_to_ai
//   | native_extraction_complete | ai_extraction_complete | saving_extracted_text
//   | creating_searchable_chunks | completed | failed
// ---------------------------------------------------------------------------
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
  // Map failed to itself (not a frontend stage but handled as terminal)
  failed:                       'INDEXING',
};

/** Backend status values that mean polling should stop. */
const TERMINAL_STATUSES = new Set(['completed', 'ready', 'failed', 'error', 'disabled', 'unavailable']);

/** ms between each poll. */
const POLL_INTERVAL_MS = 3000;

/** Maximum number of polls before giving up and allowing background processing. */
const MAX_POLLS = 10; // 30 seconds at 3s intervals

export class ApiProcessingAdapter implements IProcessingService {
  startProcessingJob(
    versionId: string,
    onProgress: (state: ProcessingState) => void,
    options?: { aiQueued?: boolean }
  ): ProcessingJobHandle {
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let pollCount = 0;

    const cleanup = () => {
      cancelled = true;
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    };

    const promise = new Promise<void>((resolve, reject) => {
      // If AI was not queued (case AI disabled), resolve immediately —
      // no point polling /documents/ai-status at all.
      if (options?.aiQueued === false) {
        onProgress({ stage: 'INTEGRITY_VERIFIED', progress: 100 });
        resolve();
        return;
      }

      let consecutiveErrors = 0;

      const poll = async () => {
        if (cancelled) return;

        pollCount++;

        // After MAX_POLLS, stop so we don't hammer the server forever.
        // Resolve (not reject) so the UI can show "processing in background".
        if (pollCount > MAX_POLLS) {
          resolve();
          return;
        }

        try {
          const aiStatus = await apiClient.get<any>(
            `/documents/ai-status/${encodeURIComponent(versionId)}`
          );
          if (cancelled) return;

          consecutiveErrors = 0;

          const rawStatus: string = (aiStatus.status || 'not_started').toLowerCase();
          const rawStage: string | undefined = aiStatus.stage?.toLowerCase();
          const progress: number = aiStatus.progress_percent ?? 0;

          // ── Terminal: completed ──────────────────────────────────────────
          if (rawStatus === 'completed') {
            onProgress({ stage: 'READY', progress: 100 });
            resolve();
            return;
          }

          // ── Terminal: failed ────────────────────────────────────────────
          if (rawStatus === 'failed') {
            cleanup();
            reject(new Error(aiStatus.error || 'Document AI processing failed.'));
            return;
          }

          // ── AI disabled / not started ───────────────────────────────────
          // The backend returns not_started when no AI job row exists because
          // case AI is disabled or the document was uploaded before AI was on.
          if (rawStatus === 'not_started') {
            // Report queued state and keep polling in case AI gets enabled.
            onProgress({ stage: 'PROCESSING_JOB_CREATED', progress: 0 });
            // But stop after max polls so we never loop forever.
            timeoutId = setTimeout(poll, POLL_INTERVAL_MS);
            return;
          }

          // ── Other terminal statuses (defensive) ─────────────────────────
          if (TERMINAL_STATUSES.has(rawStatus)) {
            resolve();
            return;
          }

          // ── In-progress: map stage → frontend stage ─────────────────────
          let stage: ProcessingState['stage'] = 'PROCESSING_JOB_CREATED';
          if (rawStage) {
            const mapped = BACKEND_STAGE_MAP[rawStage];
            if (mapped) {
              stage = mapped;
            } else if (
              (
                ['UPLOADED','SECURED','INTEGRITY_VERIFIED','PROCESSING_JOB_CREATED',
                 'DOCUMENT_LOADED','TEXT_EXTRACTION','OCR','CHUNKING','INDEXING','READY'] as string[]
              ).includes(rawStage.toUpperCase())
            ) {
              stage = rawStage.toUpperCase() as ProcessingState['stage'];
            } else {
              stage = 'TEXT_EXTRACTION';
            }
          }

          onProgress({ stage, progress });

          // Schedule next poll at a reasonable interval — NOT immediately.
          timeoutId = setTimeout(poll, POLL_INTERVAL_MS);
        } catch (error) {
          if (cancelled) return;
          consecutiveErrors++;
          if (consecutiveErrors > 5) {
            cleanup();
            reject(new Error('Failed to poll processing status after multiple attempts.'));
          } else {
            timeoutId = setTimeout(poll, POLL_INTERVAL_MS);
          }
        }
      };

      // Start first poll after a short delay to let the background task begin.
      timeoutId = setTimeout(poll, 1000);
    });

    // If the promise settles, make sure cleanup runs.
    promise.finally(cleanup);

    return { promise, cancel: cleanup };
  }
}

