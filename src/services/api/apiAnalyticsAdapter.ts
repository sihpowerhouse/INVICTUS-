/**
 * REPLACES: src/services/analytics/apiAnalyticsAdapter.ts
 */
import { apiClient } from '../api/apiClient';
import type { IAnalyticsService } from './AnalyticsServiceInterface';
import type { DepartmentAnalyticsSnapshot } from '../../types/analytics';

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

  /**
   * Ported from analytics.html's load() function.
   * Aggregates case/document/AI-job/member data per case, client-side,
   * since the backend doesn't expose a single summary endpoint for this.
   */
  async getDepartmentSnapshot(rangeDays: number | 'all' = 30): Promise<DepartmentAnalyticsSnapshot | undefined> {
    try {
      const cases = await apiClient.get<any[]>('/case/my');

      let docs = 0, verified = 0, invalid = 0, members = 0;
      let processing = 0, done = 0, failed = 0;
      const types: Record<string, number> = {};

      const results = await Promise.all(cases.map(async (c) => {
        const id = encodeURIComponent(c.case_id);
        let d: any[] = [], a: any = null, m: any[] = [];
        try { d = (await apiClient.get<any>(`/case/documents?case_id=${id}`)).documents || []; } catch { /* not available */ }
        try { a = await apiClient.get<any>(`/case/ai/status?case_id=${id}`); } catch { /* not available */ }
        try { m = (await apiClient.get<any>(`/case/members?case_id=${id}`)).members || []; } catch { /* not available */ }
        return { d, a, m };
      }));

      results.forEach(({ d, a, m }) => {
        docs += d.length;
        members += m.length;
        d.forEach((doc: any) => {
          types[doc.document_type] = (types[doc.document_type] || 0) + 1;
          if (doc.integrity_verified === false || doc.verification_status === 'invalid') invalid++;
          else verified++;
        });
        if (a) {
          const jobs = a.jobs || a.documents || [];
          jobs.forEach((j: any) => {
            const s = (j.status || '').toLowerCase();
            if (s === 'processing' || s === 'queued') processing++;
            else if (s === 'completed') done++;
            else if (s === 'failed') failed++;
          });
        }
      });

      const open = cases.filter(x => (x.cases?.status || '').toLowerCase() === 'open').length;
      const closed = cases.filter(x => ['closed', 'completed', 'archived'].includes((x.cases?.status || '').toLowerCase())).length;

      const documentTypeBreakdown = Object.entries(types)
        .map(([type, count]) => ({ type: type.replaceAll('_', ' '), count: count as number }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 7);

      const casesInRange = rangeDays === 'all'
        ? cases.length
        : cases.filter(c => new Date(c.cases?.created_at || 0).getTime() >= Date.now() - (rangeDays as number) * 864e5).length;

      const recentCases = cases
        .slice()
        .sort((a, b) => new Date(b.cases?.created_at || 0).getTime() - new Date(a.cases?.created_at || 0).getTime())
        .slice(0, 8)
        .map(c => ({
          id: c.case_id,
          firId: c.cases?.fir_id || 'Case',
          status: c.cases?.status || '',
          createdAt: c.cases?.created_at || '',
          accessLevel: c.permission_level || '—'
        }));

      return {
        openCases: open,
        closedCases: closed,
        otherCases: Math.max(0, cases.length - open - closed),
        totalDocuments: docs,
        verifiedDocuments: verified,
        documentsWithIssues: invalid,
        participants: members,
        aiCompleted: done,
        aiProcessing: processing,
        aiFailed: failed,
        documentTypeBreakdown,
        casesInSelectedRange: casesInRange,
        recentCases
      };
    } catch (err) {
      console.warn('[AnalyticsAdapter] getDepartmentSnapshot error:', err);
      return undefined;
    }
  }
}
