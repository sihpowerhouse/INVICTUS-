import type { IAiService } from './AiServiceInterface';
import type { CaseAIInfo, CaseSummary, ProcessingLog } from '../aiService';
import { request } from '../api/apiClient';

export class ApiAiAdapter implements IAiService {
  async getCaseAIStatus(caseId: string): Promise<CaseAIInfo> {
    const response = await request<any>(`/case/ai/status`, {
      method: 'GET',
      params: { case_id: caseId }
    });

    const isProcessing = response.pending_count > 0;
    const isFailed = response.jobs?.some((j: any) => j.status === 'failed');
    
    let processingState = 'IDLE';
    if (isProcessing) processingState = 'PROCESSING';
    else if (isFailed) processingState = 'FAILED';
    else if (response.jobs?.length > 0) processingState = 'COMPLETED';

    const documentsProcessed = response.jobs?.filter((j: any) => j.status === 'completed').length || 0;
    const totalDocuments = response.jobs?.length || 0;

    let provider = response.provider || 'None';
    let model = response.model || 'None';

    // Remove backend placeholders
    if (provider === 'Backend') provider = 'None';
    if (model === 'Backend Model') model = 'None';

    return {
      status: response.enabled ? 'ENABLED' : 'DISABLED',
      provider: provider,
      model: model,
      processingState: processingState,
      documentsProcessed: documentsProcessed,
      totalDocuments: totalDocuments,
    };
  }

  async toggleAI(caseId: string, enable: boolean): Promise<CaseAIInfo> {
    await request<{ message: string; enabled: boolean }>('/case/ai/toggle', {
      method: 'POST',
      body: JSON.stringify({ case_id: caseId, enabled: enable })
    });

    // Re-fetch the actual status after toggling
    return this.getCaseAIStatus(caseId);
  }

  async getCaseSummary(_caseId: string): Promise<CaseSummary | null> {
    // There is no dedicated case-summary endpoint in the backend.
    return null;
  }

  async getProcessingActivity(_caseId: string): Promise<ProcessingLog[]> {
    // This is handled per document using /documents/ai-status/{id} which processingService manages.
    // The aggregate case-wide activity log endpoint doesn't exist yet in the backend.
    return [];
  }
}
