/**
 * REPLACES: src/services/analytics/mockAnalyticsAdapter.ts
 */
import type { IAnalyticsService } from './AnalyticsServiceInterface';
import type {
  CaseActivityPoint,
  CaseStatusCount,
  DepartmentWorkload,
  DocumentProcessingPoint,
  EvidenceMovementPoint,
  PendingAction,
  SystemActivity,
  AnalyticsSummary,
  DepartmentAnalyticsSnapshot
} from '../../types/analytics';
import {
  MOCK_CASE_ACTIVITY,
  MOCK_CASE_STATUS,
  MOCK_DEPT_WORKLOAD,
  MOCK_DOC_PROCESSING,
  MOCK_EVIDENCE_MOVEMENT,
  MOCK_PENDING_ACTIONS,
  MOCK_SYSTEM_ACTIVITY,
  MOCK_ANALYTICS_SUMMARY
} from '../../mock/analytics';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class MockAnalyticsAdapter implements IAnalyticsService {
  async getCaseActivity(): Promise<CaseActivityPoint[]> {
    await delay(300);
    return MOCK_CASE_ACTIVITY;
  }

  async getCaseStatus(): Promise<CaseStatusCount[]> {
    await delay(200);
    return MOCK_CASE_STATUS;
  }

  async getDepartmentWorkload(): Promise<DepartmentWorkload[]> {
    await delay(400);
    return MOCK_DEPT_WORKLOAD;
  }

  async getDocumentProcessing(): Promise<DocumentProcessingPoint[]> {
    await delay(250);
    return MOCK_DOC_PROCESSING;
  }

  async getEvidenceMovement(): Promise<EvidenceMovementPoint[]> {
    await delay(350);
    return MOCK_EVIDENCE_MOVEMENT;
  }

  async getPendingActions(): Promise<PendingAction[]> {
    await delay(150);
    return MOCK_PENDING_ACTIONS;
  }

  async getSystemActivity(): Promise<SystemActivity[]> {
    await delay(300);
    return MOCK_SYSTEM_ACTIVITY;
  }

  async getAnalyticsSummary(): Promise<AnalyticsSummary> {
    await delay(100);
    return MOCK_ANALYTICS_SUMMARY;
  }

  async getDepartmentSnapshot(): Promise<DepartmentAnalyticsSnapshot | undefined> {
    await delay(300);
    return {
      openCases: 12,
      closedCases: 34,
      otherCases: 2,
      totalDocuments: 87,
      verifiedDocuments: 81,
      documentsWithIssues: 6,
      participants: 19,
      aiCompleted: 60,
      aiProcessing: 4,
      aiFailed: 1,
      documentTypeBreakdown: [
        { type: 'fir', count: 14 },
        { type: 'witness statement', count: 9 },
        { type: 'forensic report', count: 6 }
      ],
      casesInSelectedRange: 8,
      recentCases: []
    };
  }
}
