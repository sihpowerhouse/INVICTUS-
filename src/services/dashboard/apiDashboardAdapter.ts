import type { OperationalMetrics, ExternalAccessEvent } from '../../types/dashboard';
import type { IDashboardService } from './DashboardServiceInterface';

export class ApiDashboardAdapter implements IDashboardService {
  async getOperationalMetrics(): Promise<OperationalMetrics> {
    throw new Error('API Dashboard Adapter not implemented yet.');
  }

  async getRecentExternalAccess(): Promise<ExternalAccessEvent[]> {
    throw new Error('API Dashboard Adapter not implemented yet.');
  }
}
