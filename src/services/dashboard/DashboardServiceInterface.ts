import type { OperationalMetrics, ExternalAccessEvent } from '../../types/dashboard';

export interface IDashboardService {
  getOperationalMetrics(): Promise<OperationalMetrics>;
  getRecentExternalAccess(): Promise<ExternalAccessEvent[]>;
}
