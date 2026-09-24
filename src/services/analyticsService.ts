import type { IAnalyticsService } from './analytics/AnalyticsServiceInterface';
import { MockAnalyticsAdapter } from './analytics/mockAnalyticsAdapter';
import { ApiAnalyticsAdapter } from './analytics/apiAnalyticsAdapter';

import { USE_MOCK_DATA } from './api/apiClient';

export const analyticsService: IAnalyticsService = USE_MOCK_DATA
  ? new MockAnalyticsAdapter()
  : new ApiAnalyticsAdapter();
