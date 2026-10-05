import type { IDashboardService } from './dashboard/DashboardServiceInterface';
import { MockDashboardAdapter } from './dashboard/mockDashboardAdapter';
import { ApiDashboardAdapter } from './dashboard/apiDashboardAdapter';

import { USE_MOCK_DATA } from './api/apiClient';

export const dashboardService: IDashboardService = USE_MOCK_DATA 
  ? new MockDashboardAdapter() 
  : new ApiDashboardAdapter();
