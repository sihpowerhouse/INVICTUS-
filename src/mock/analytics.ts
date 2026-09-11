import type {
  CaseActivityPoint,
  CaseStatusCount,
  DepartmentWorkload,
  DocumentProcessingPoint,
  EvidenceMovementPoint,
  PendingAction,
  SystemActivity,
  AnalyticsSummary
} from '../types/analytics';

export const MOCK_CASE_ACTIVITY: CaseActivityPoint[] = [
  { date: '08-01', created: 12, active: 45 },
  { date: '08-05', created: 15, active: 48 },
  { date: '08-10', created: 8, active: 52 },
  { date: '08-15', created: 22, active: 61 },
  { date: '08-20', created: 14, active: 65 },
  { date: '08-25', created: 19, active: 72 },
  { date: '08-30', created: 25, active: 81 },
  { date: '09-04', created: 18, active: 85 },
  { date: '09-09', created: 30, active: 94 },
];

export const MOCK_CASE_STATUS: CaseStatusCount[] = [
  { status: 'NEW', count: 18 },
  { status: 'ACTIVE', count: 94 },
  { status: 'REVIEW', count: 24 },
  { status: 'ON_HOLD', count: 12 },
  { status: 'CLOSED', count: 145 },
];

export const MOCK_DEPT_WORKLOAD: DepartmentWorkload[] = [
  { department: 'Police', activeCases: 42, pendingTasks: 18 },
  { department: 'Cyber Crime', activeCases: 38, pendingTasks: 25 },
  { department: 'Forensics', activeCases: 21, pendingTasks: 45 },
  { department: 'Prosecution', activeCases: 28, pendingTasks: 12 },
  { department: 'Records', activeCases: 8, pendingTasks: 35 },
];

export const MOCK_DOC_PROCESSING: DocumentProcessingPoint[] = [
  { date: 'Mon', uploaded: 120, ocrCompleted: 110, indexed: 105 },
  { date: 'Tue', uploaded: 150, ocrCompleted: 130, indexed: 125 },
  { date: 'Wed', uploaded: 180, ocrCompleted: 175, indexed: 160 },
  { date: 'Thu', uploaded: 90, ocrCompleted: 85, indexed: 80 },
  { date: 'Fri', uploaded: 210, ocrCompleted: 195, indexed: 180 },
  { date: 'Sat', uploaded: 45, ocrCompleted: 45, indexed: 40 },
  { date: 'Sun', uploaded: 30, ocrCompleted: 30, indexed: 30 },
];

export const MOCK_EVIDENCE_MOVEMENT: EvidenceMovementPoint[] = [
  { state: 'RECEIVED', count: 420 },
  { state: 'EXAMINED', count: 310 },
  { state: 'TRANSFERRED', count: 155 },
  { state: 'RETURNED', count: 85 },
  { state: 'ARCHIVED', count: 890 },
];

export const MOCK_PENDING_ACTIONS: PendingAction[] = [
  {
    id: 'ACT-101',
    type: 'ACCESS_REQUEST',
    description: 'Level 4 clearance requested for CASE-2026-88',
    priority: 'HIGH',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    route: '/access-requests'
  },
  {
    id: 'ACT-102',
    type: 'EVIDENCE_VERIFICATION',
    description: 'Verify digital signature for mobile extraction EV-902',
    priority: 'HIGH',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    route: '/evidence/EV-902'
  },
  {
    id: 'ACT-103',
    type: 'DOCUMENT_REVIEW',
    description: 'OCR confidence below threshold for Financial Ledger',
    priority: 'MEDIUM',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    route: '/documents'
  },
  {
    id: 'ACT-104',
    type: 'INTEGRITY_CHECK',
    description: 'Scheduled hash re-validation for Archived Segment A',
    priority: 'LOW',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    route: '/integrity'
  }
];

export const MOCK_SYSTEM_ACTIVITY: SystemActivity[] = [
  {
    id: 'EVT-9001',
    action: 'INTEGRITY_VERIFIED',
    entityType: 'SECURITY',
    entityId: 'SYS-AUDIT',
    timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    user: 'SYSTEM'
  },
  {
    id: 'EVT-9002',
    action: 'CASE_STATUS_UPDATED',
    entityType: 'CASE',
    entityId: 'CASE-2026-92',
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    user: 'Cmdr. Sarah Vance'
  },
  {
    id: 'EVT-9003',
    action: 'DOCUMENT_INDEXED',
    entityType: 'DOCUMENT',
    entityId: 'DOC-1102',
    timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    user: 'SYSTEM_OCR'
  },
  {
    id: 'EVT-9004',
    action: 'EVIDENCE_TRANSFERRED',
    entityType: 'EVIDENCE',
    entityId: 'EV-884',
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    user: 'Tech. Marcus Chen'
  },
  {
    id: 'EVT-9005',
    action: 'ACCESS_GRANTED',
    entityType: 'SECURITY',
    entityId: 'REQ-442',
    timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    user: 'Admin. Security'
  }
];

export const MOCK_ANALYTICS_SUMMARY: AnalyticsSummary = {
  activeCases: 94,
  activeCasesTrend: 12.5,
  documentsProcessed: 4820,
  evidenceItems: 1860,
  pendingActions: 24
};
