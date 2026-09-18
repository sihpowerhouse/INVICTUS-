import type { IProcessingService, ProcessingState } from './processing/ProcessingServiceInterface';
import { MockProcessingAdapter } from './processing/mockProcessingAdapter';
import { ApiProcessingAdapter } from './processing/apiProcessingAdapter';

export type { ProcessingState };

const useMockData = import.meta.env.VITE_USE_MOCK_DATA === 'true';

export const processingService: IProcessingService = useMockData 
  ? new MockProcessingAdapter() 
  : new ApiProcessingAdapter();
