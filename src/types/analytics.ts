export interface CaseActivityPoint {
  date: string;
  created: number;
  active: number;
}

export interface CaseStatusCount {
  status: 'NEW' | 'ACTIVE' | 'REVIEW' | 'ON_HOLD' | 'CLOSED';
  count: number;
}

export interface DepartmentWorkload {
  department: string;
  activeCases: number;
  pendingTasks: number;
}

export interface DocumentProcessingPoint {
  date: string;
  uploaded: number;
  ocrCompleted: number;
  indexed: number;
}

export interface EvidenceMovementPoint {
  state: 'RECEIVED' | 'EXAMINED' | 'TRANSFERRED' | 'RETURNED' | 'ARCHIVED';
  count: number;
}

export interface PendingAction {
  id: string;
  type: 'DOCUMENT_REVIEW' | 'EVIDENCE_VERIFICATION' | 'ACCESS_REQUEST' | 'CASE_REVIEW' | 'INTEGRITY_CHECK';
  description: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  timestamp: string;
  route: string;
}

export interface SystemActivity {
  id: string;
  action: string;
  entityType: 'CASE' | 'EVIDENCE' | 'DOCUMENT' | 'SECURITY';
  entityId: string;
  timestamp: string;
  user: string;
}

export interface AnalyticsSummary {
  activeCases: number | string;
  activeCasesTrend: number | string; // percentage change
  documentsProcessed: number | string;
  evidenceItems: number | string;
  pendingActions: number | string;
}
