import type { ICaseService } from './case/CaseServiceInterface';
import { MockCaseAdapter } from './case/mockCaseAdapter';
import { ApiCaseAdapter } from './case/apiCaseAdapter';
import { USE_MOCK_DATA } from './api/apiClient';

/**
 * caseService singleton
 * Consumers import this and use it without knowing if it's mock or real.
 */
export const caseService: ICaseService = USE_MOCK_DATA 
  ? new MockCaseAdapter() 
  : new ApiCaseAdapter();

export * from './case/CaseServiceInterface';
