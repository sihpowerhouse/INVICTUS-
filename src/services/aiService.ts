import type { CaseAIStatus } from '../types/case';

export interface CaseAIInfo {
  status: CaseAIStatus;
  provider: string;
  model: string;
  processingState: string;
  documentsProcessed: number;
  totalDocuments: number;
}

export interface CaseSummary {
  bullets: string[];
  isAvailable: boolean;
  reason?: string;
}

export interface ProcessingLog {
  id: string;
  time: string;
  filename: string;
  state: 'DOCUMENT UPLOADED' | 'TEXT EXTRACTION' | 'ENTITY EXTRACTION' | 'CHUNKING' | 'INDEXING' | 'AVAILABLE TO CASE AI' | 'FAILED';
  status: 'COMPLETE' | 'PROCESSING' | 'FAILED' | 'PENDING';
}

class AIService {
  private readonly MOCK_DELAY = 400;

  async getCaseAIStatus(_caseId: string): Promise<CaseAIInfo> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status: 'ENABLED',
          provider: 'Internal Systems',
          model: 'Forensic-LLM-v2',
          processingState: 'IDLE',
          documentsProcessed: 12,
          totalDocuments: 12,
        });
      }, this.MOCK_DELAY);
    });
  }

  async toggleAI(_caseId: string, enable: boolean): Promise<CaseAIInfo> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status: enable ? 'ENABLED' : 'DISABLED',
          provider: 'Internal Systems',
          model: 'Forensic-LLM-v2',
          processingState: 'IDLE',
          documentsProcessed: 12,
          totalDocuments: 12,
        });
      }, this.MOCK_DELAY);
    });
  }

  async getCaseSummary(_caseId: string): Promise<CaseSummary> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          isAvailable: true,
          bullets: [
            'Incident reported at Sector 4 Industrial Park around 23:30 on 08 SEP.',
            'Primary evidence includes a forensic report linking suspect clothing to the scene, along with CCTV footage.',
            'Investigation currently depends on resolving timeline discrepancies between Witness A and the initial report.'
          ]
        });
      }, this.MOCK_DELAY + 200);
    });
  }

  async getProcessingActivity(_caseId: string): Promise<ProcessingLog[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 'PL-01',
            time: '10:42',
            filename: 'Forensic_Report.pdf',
            state: 'AVAILABLE TO CASE AI',
            status: 'COMPLETE'
          },
          {
            id: 'PL-02',
            time: '10:39',
            filename: 'Witness_A_Statement.pdf',
            state: 'ENTITY EXTRACTION',
            status: 'COMPLETE'
          },
          {
            id: 'PL-03',
            time: '10:31',
            filename: 'CCTV_Transcript.pdf',
            state: 'TEXT EXTRACTION',
            status: 'PROCESSING'
          }
        ]);
      }, this.MOCK_DELAY);
    });
  }
}

export const aiService = new AIService();
