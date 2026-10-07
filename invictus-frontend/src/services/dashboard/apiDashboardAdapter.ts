import { apiClient } from '../api/apiClient';
import type { OperationalMetrics, ExternalAccessEvent } from '../../types/dashboard';
import type { IDashboardService } from './DashboardServiceInterface';

export class ApiDashboardAdapter implements IDashboardService {
  async getOperationalMetrics(): Promise<OperationalMetrics> {
    try {
      const data = (await apiClient.get('/analytics/summary')) as any;
      if (data && data.metrics) {
        return {
          openCases: data.metrics.activeCases || 0,
          
          docsPendingAI: data.metrics.totalDocuments - data.metrics.completed || 0, // Fallback logic
          
        };
      }
    } catch (err) {
      console.error('Failed to load metrics:', err);
    }
    return {
      openCases: 0,
      
      docsPendingAI: 0,
      
    };
  }

  async getRecentExternalAccess(): Promise<ExternalAccessEvent[]> {
    try {
      const data = (await apiClient.get('/audit/logs')) as any;
      if (data && data.logs) {
        // Filter or just take the top logs 
        return data.logs.slice(0, 3).map((log: any) => ({
          id: log.event_id || String(Math.random()),
          timestamp: log.created_at || log.timestamp || new Date().toISOString(),
          actor: log.user_id || log.actor || 'SYSTEM',
          action: log.action,
        }));
      }
    } catch(err) {
      console.error('Failed to load recent access:', err);
    }
    return [];
  }
}
