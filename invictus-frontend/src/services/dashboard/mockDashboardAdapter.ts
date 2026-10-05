import type { OperationalMetrics, ExternalAccessEvent } from '../../types/dashboard';
import type { IDashboardService } from './DashboardServiceInterface';

export class MockDashboardAdapter implements IDashboardService {
  private readonly MOCK_DELAY = 600;

  async getOperationalMetrics(): Promise<OperationalMetrics> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          openCases: 142,
          docsPendingAI: 38
        });
      }, this.MOCK_DELAY);
    });
  }

  async getRecentExternalAccess(): Promise<ExternalAccessEvent[]> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([
          {
            id: 'evt-001',
            actor: 'LAWYER',
            action: 'DOCUMENT VIEWED',
            timestamp: '8 MIN AGO'
          },
          {
            id: 'evt-002',
            actor: 'FSL',
            action: 'REPORT ACCESSED',
            timestamp: '32 MIN AGO'
          }
        ]);
      }, this.MOCK_DELAY);
    });
  }
}
