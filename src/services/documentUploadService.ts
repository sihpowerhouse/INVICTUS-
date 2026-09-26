import { processingService } from './processingService';
import type { ProcessingJobHandle, ProcessingState } from './processingService';
import { documentService } from './documentService';
import type { Document } from '../types/document';

export type { ProcessingJobHandle };

class DocumentUploadService {
  /**
   * Upload a document and begin polling its AI processing status.
   *
   * Returns a `ProcessingJobHandle` whose:
   *   - `promise` resolves when the document reaches READY (or when AI is
   *     disabled / background-only), and rejects on hard failure.
   *   - `cancel()` stops the poll loop immediately (call on modal close /
   *     component unmount to prevent the request storm).
   *
   * The `onProgress` callback is called after each poll with the current stage.
   */
  startUpload(
    file: File,
    caseId: string,
    onProgress: (state: ProcessingState) => void,
    documentId?: string,
    documentType?: string,
  ): { uploadPromise: Promise<Document>; getJobHandle: () => ProcessingJobHandle | null } {
    // We need to start the upload first to get the versionId, then start polling.
    // We return an uploadPromise and a lazy accessor for the job handle so the
    // caller can cancel the poll even if the upload is still in flight.

    let jobHandle: ProcessingJobHandle | null = null;

    const uploadPromise = (async () => {
      // 1. Upload the file — backend returns { version_id, ai_queued, ai_enabled, … }
      const newDoc = await documentService.uploadDocument(file, caseId, documentType, documentId);

      // 2. Read ai_queued from the raw upload response.
      //    documentService.uploadDocument wraps the raw API response into a
      //    Document object, which doesn't carry ai_queued.  We need the raw
      //    value — so we re-read it from newDoc.aiEnabled as the best proxy:
      //    if doc.aiEnabled is false the case/document has AI disabled.
      //    The `ai_queued` field from the upload response is more accurate but
      //    we'd need to expose it. For now, use aiEnabled as the gate.
      const aiQueued = newDoc.aiEnabled !== false;

      // 3. Start the polling job (returns a handle with .promise + .cancel())
      jobHandle = processingService.startProcessingJob(
        newDoc.versionId,
        onProgress,
        { aiQueued }
      );

      return newDoc;
    })();

    return {
      uploadPromise,
      getJobHandle: () => jobHandle,
    };
  }

  /** @deprecated Use startUpload() instead — this helper does not support cancellation. */
  async processUpload(
    file: File,
    caseId: string,
    onProgress: (state: ProcessingState) => void,
    documentId?: string,
    documentType?: string
  ): Promise<Document> {
    const newDoc = await documentService.uploadDocument(file, caseId, documentType, documentId);
    const aiQueued = newDoc.aiEnabled !== false;
    const handle = processingService.startProcessingJob(newDoc.versionId, onProgress, { aiQueued });
    await handle.promise;
    return newDoc;
  }
}

export const documentUploadService = new DocumentUploadService();
