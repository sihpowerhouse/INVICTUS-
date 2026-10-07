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

import type { IAiService } from './ai/AiServiceInterface';
import { MockAiAdapter } from './ai/mockAiAdapter';
import { ApiAiAdapter } from './ai/apiAiAdapter';
import { USE_MOCK_DATA } from './api/apiClient';

export const aiService: IAiService = USE_MOCK_DATA
  ? new MockAiAdapter()
  : new ApiAiAdapter();
