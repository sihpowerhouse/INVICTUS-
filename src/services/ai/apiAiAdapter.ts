import type { IAiService } from './AiServiceInterface';
import type { CaseAIInfo, CaseSummary, ProcessingLog } from '../aiService';
import { request } from '../api/apiClient';

export class ApiAiAdapter implements IAiService {
  async getCaseAIStatus(caseId: string): Promise<CaseAIInfo> {
    const response = await request<{ enabled: boolean }>(`/case/ai/status`, {
      method: 'GET',
      params: { case_id: caseId }
    });

    return {
      status: response.enabled ? 'ENABLED' : 'DISABLED',
      provider: 'Backend', // Placeholder, the backend status endpoint might not return the provider
      model: 'Backend Model',
      processingState: 'IDLE',
      documentsProcessed: 0,
      totalDocuments: 0,
    };
  }

  async toggleAI(caseId: string, enable: boolean): Promise<CaseAIInfo> {
    await request<{ message: string; enabled: boolean }>('/case/ai/toggle', {
      method: 'POST',
      body: JSON.stringify({ case_id: caseId, enabled: enable })
    });

    return {
      status: enable ? 'ENABLED' : 'DISABLED',
      provider: 'Backend',
      model: 'Backend Model',
      processingState: 'IDLE',
      documentsProcessed: 0,
      totalDocuments: 0,
    };
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
