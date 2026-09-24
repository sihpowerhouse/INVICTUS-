import type { IProcessingService, ProcessingState } from './processing/ProcessingServiceInterface';
import { MockProcessingAdapter } from './processing/mockProcessingAdapter';
import { ApiProcessingAdapter } from './processing/apiProcessingAdapter';

export type { ProcessingState };

import { USE_MOCK_DATA } from './api/apiClient';

export const processingService: IProcessingService = USE_MOCK_DATA 
  ? new MockProcessingAdapter() 
  : new ApiProcessingAdapter();
