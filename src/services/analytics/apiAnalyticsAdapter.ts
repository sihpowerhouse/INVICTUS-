import type { IAnalyticsService } from './AnalyticsServiceInterface';
import type {
  CaseActivityPoint,
  CaseStatusCount,
  DepartmentWorkload,
  DocumentProcessingPoint,
  EvidenceMovementPoint,
  PendingAction,
  SystemActivity,
  AnalyticsSummary
} from '../../types/analytics';
import { caseService } from '../caseService';

export class ApiAnalyticsAdapter implements IAnalyticsService {
  async getCaseActivity(): Promise<CaseActivityPoint[]> {
    // UNAVAILABLE: No time-series data endpoints exist in the backend
    return [];
  }

  async getCaseStatus(): Promise<CaseStatusCount[]> {
    try {
      // Safely aggregate from authorized cases list
      // Note: backend /case/my filters out closed, completed, and archived cases.
      const cases = await caseService.getCases();
      
      const counts = cases.reduce((acc, c) => {
        acc[c.status] = (acc[c.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      // Map to expected statuses
      return [
        { status: 'NEW', count: counts['NEW'] || 0 },
        { status: 'ACTIVE', count: counts['ACTIVE'] || 0 },
        { status: 'REVIEW', count: counts['REVIEW'] || 0 },
        { status: 'ON_HOLD', count: counts['ON_HOLD'] || 0 },
        { status: 'CLOSED', count: counts['CLOSED'] || 0 },
      ];
    } catch {
      return [];
    }
  }

  async getDepartmentWorkload(): Promise<DepartmentWorkload[]> {
    // UNAVAILABLE: No organizational visibility provided by backend
    return [];
  }

  async getDocumentProcessing(): Promise<DocumentProcessingPoint[]> {
    // UNAVAILABLE: No global document processing status list
    return [];
  }

  async getEvidenceMovement(): Promise<EvidenceMovementPoint[]> {
    // UNAVAILABLE: No historical timeline endpoints
    return [];
  }

  async getPendingActions(): Promise<PendingAction[]> {
    // UNAVAILABLE: No global action/task endpoint
    return [];
  }

  async getSystemActivity(): Promise<SystemActivity[]> {
    // UNAVAILABLE: No audit log endpoint
    return [];
  }

  async getAnalyticsSummary(): Promise<AnalyticsSummary> {
    try {
      const cases = await caseService.getCases();
      
      return {
        activeCases: cases.length, // Total active/assigned cases accessible to the user
        activeCasesTrend: 'N/A',
        documentsProcessed: 'N/A',
        evidenceItems: 'N/A',
        pendingActions: 'N/A'
      };
    } catch {
      return {
        activeCases: 'N/A',
        activeCasesTrend: 'N/A',
        documentsProcessed: 'N/A',
        evidenceItems: 'N/A',
        pendingActions: 'N/A'
      };
    }
  }
}
