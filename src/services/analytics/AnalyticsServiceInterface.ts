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

export interface IAnalyticsService {
  getCaseActivity(): Promise<CaseActivityPoint[]>;
  getCaseStatus(): Promise<CaseStatusCount[]>;
  getDepartmentWorkload(): Promise<DepartmentWorkload[]>;
  getDocumentProcessing(): Promise<DocumentProcessingPoint[]>;
  getEvidenceMovement(): Promise<EvidenceMovementPoint[]>;
  getPendingActions(): Promise<PendingAction[]>;
  getSystemActivity(): Promise<SystemActivity[]>;
  getAnalyticsSummary(): Promise<AnalyticsSummary>;
}
