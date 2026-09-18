import type { IAnalyticsService } from './analytics/AnalyticsServiceInterface';
import { MockAnalyticsAdapter } from './analytics/mockAnalyticsAdapter';
import { ApiAnalyticsAdapter } from './analytics/apiAnalyticsAdapter';

const useMockData = import.meta.env.VITE_USE_MOCK_DATA === 'true';

export const analyticsService: IAnalyticsService = useMockData
  ? new MockAnalyticsAdapter()
  : new ApiAnalyticsAdapter();
