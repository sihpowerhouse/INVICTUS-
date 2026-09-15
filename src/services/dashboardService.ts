import type { IDashboardService } from './dashboard/DashboardServiceInterface';
import { MockDashboardAdapter } from './dashboard/mockDashboardAdapter';
import { ApiDashboardAdapter } from './dashboard/apiDashboardAdapter';

const USE_MOCK_DATA = true;

export const dashboardService: IDashboardService = USE_MOCK_DATA 
  ? new MockDashboardAdapter() 
  : new ApiDashboardAdapter();
