import type { CaseAIInfo, CaseSummary, ProcessingLog } from '../aiService';

export interface IAiService {
  getCaseAIStatus(caseId: string): Promise<CaseAIInfo>;
  toggleAI(caseId: string, enable: boolean): Promise<CaseAIInfo>;
  getCaseSummary(caseId: string): Promise<CaseSummary | null>;
  getProcessingActivity(caseId: string): Promise<ProcessingLog[]>;
}
