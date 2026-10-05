/**
 * REPLACES: src/services/analytics/AnalyticsServiceInterface.ts
 */
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

export interface IAnalyticsService {
  getCaseActivity(): Promise<CaseActivityPoint[]>;
  getCaseStatus(): Promise<CaseStatusCount[]>;
  getDepartmentWorkload(): Promise<DepartmentWorkload[]>;
  getDocumentProcessing(): Promise<DocumentProcessingPoint[]>;
  getEvidenceMovement(): Promise<EvidenceMovementPoint[]>;
  getPendingActions(): Promise<PendingAction[]>;
  getSystemActivity(): Promise<SystemActivity[]>;
  getAnalyticsSummary(): Promise<AnalyticsSummary>;
  getDepartmentSnapshot(rangeDays: number | 'all'): Promise<DepartmentAnalyticsSnapshot | undefined>;
}
