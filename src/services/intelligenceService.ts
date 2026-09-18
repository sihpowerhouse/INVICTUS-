import type { IIntelligenceService } from './intelligence/IntelligenceServiceInterface';
import { MockIntelligenceAdapter } from './intelligence/mockIntelligenceAdapter';
import { ApiIntelligenceAdapter } from './intelligence/apiIntelligenceAdapter';
import { USE_MOCK_DATA } from './api/apiClient';

export const intelligenceService: IIntelligenceService = USE_MOCK_DATA
  ? new MockIntelligenceAdapter()
  : new ApiIntelligenceAdapter();
