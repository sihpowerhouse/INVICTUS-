import { apiClient } from '../api/apiClient';
import type { IAnalyticsService } from './AnalyticsServiceInterface';

export class ApiAnalyticsAdapter implements IAnalyticsService {
  async getAnalyticsSummary(): Promise<any> {
    try {
      const data = (await apiClient.get('/analytics/summary')) as any;
      if (!data || !data.metrics) return undefined;
      const m = data.metrics;
      return {
        activeCases: m.activeCases !== undefined ? m.activeCases : 'N/A',
        activeCasesTrend: 'N/A',
        documentsProcessed: m.completed !== undefined ? m.completed : 'N/A',
        evidenceItems: 'N/A',
        pendingActions: 'N/A'
      };
    } catch (err) {
      console.warn('[AnalyticsAdapter] getAnalyticsSummary error:', err);
      return undefined;
    }
  }
  
  async getCaseActivity(): Promise<any> {
    try {
      const data = (await apiClient.get('/analytics/summary')) as any;
      if (!data || !data.metrics) return undefined;
      const m = data.metrics;
      return [{ date: new Date().toISOString().split('T')[0], active: m.activeCases || 0, closed: m.closedCases || 0, new: m.totalCases || 0 }];
    } catch {
      return undefined;
    }
  }
  
  async getCaseStatus(): Promise<any> {
    try {
      const data = (await apiClient.get('/analytics/summary')) as any;
      if (!data || !data.metrics) return undefined;
      const m = data.metrics;
      if (m.totalCases === 0) return [];
      return [
        { status: 'ACTIVE', count: m.activeCases || 0 },
        { status: 'CLOSED', count: m.closedCases || 0 }
      ];
    } catch {
      return undefined;
    }
  }
  
  async getDepartmentWorkload(): Promise<any> {
    // NOT EXPOSED BY CURRENT BACKEND
    return null;
  }
  
  async getDocumentProcessing(): Promise<any> {
    try {
      const data = (await apiClient.get('/analytics/summary')) as any;
      if (!data || !data.metrics) return undefined;
      const m = data.metrics;
      return [
        { date: new Date().toISOString().split('T')[0], processed: m.completed || 0, pending: m.processing || 0 }
      ];
    } catch {
      return undefined;
    }
  }
  
  async getIntelligenceUsage(): Promise<any> {
    return null;
  }
  
  async getSystemActivity(): Promise<any> {
    try {
      const data = await apiClient.get<any>('/audit/logs');
      if (!data || !data.logs) return [];
      return data.logs.slice(0, 10).map((log: any) => ({
        id: log.event_id || log.id || String(Math.random()),
        timestamp: log.created_at || log.timestamp || new Date().toISOString(),
        action: log.action || 'UNKNOWN',
        user: log.user_id || log.actor || 'SYSTEM',
        entityId: log.target_id || log.target || 'SYSTEM',
      }));
    } catch (err) {
      console.warn('[AnalyticsAdapter] Failed to fetch system activity from audit logs:', err);
      return undefined;
    }
  }
  
  async getEvidenceMovement(): Promise<any> {
    return null; // Not exposed
  }
  
  async getPendingActions(): Promise<any> {
    return null; // Not exposed
  }
  
  async exportReport(): Promise<Blob> { return new Blob(); }
}
