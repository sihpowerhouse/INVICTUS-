// Evidence Intelligence — Type Definitions
// INVICTUS SIH26190 — Milestone 5

export type EvidenceType =
  | 'DIGITAL_DOCUMENT'
  | 'IMAGE'
  | 'VIDEO'
  | 'AUDIO'
  | 'DEVICE'
  | 'PHYSICAL_RECORD'
  | 'FORENSIC_SAMPLE'
  | 'OTHER';

export type EvidenceStatus =
  | 'REGISTERED'
  | 'IN_CUSTODY'
  | 'UNDER_EXAMINATION'
  | 'TRANSFERRED'
  | 'VERIFIED'
  | 'REQUIRES_REVIEW'
  | 'ARCHIVED';

export type CustodyState =
  | 'IN_CUSTODY'
  | 'AT_FSL'
  | 'UNDER_EXAMINATION'
  | 'TRANSFERRED'
  | 'RELEASED'
  | 'ARCHIVED';

export type CustodyEventAction =
  | 'REGISTERED'
  | 'TRANSFERRED'
  | 'RECEIVED'
  | 'EXAMINATION_STARTED'
  | 'EXAMINATION_COMPLETE'
  | 'REPORT_SUBMITTED'
  | 'VERIFIED'
  | 'RELEASED'
  | 'ARCHIVED';

export interface CustodyEvent {
  id: string;
  action: CustodyEventAction;
  actor: string;
  department: string;
  location: string;
  timestamp: string; // ISO date string
  note?: string;
}

export type ActivityEventType =
  | 'REGISTERED'
  | 'VIEWED'
  | 'TRANSFERRED'
  | 'VERIFIED'
  | 'UPDATED'
  | 'REPORT_ATTACHED'
  | 'FLAGGED';

export interface ActivityEvent {
  id: string;
  type: ActivityEventType;
  actor: string;
  timestamp: string;
  note?: string;
}

export interface EvidenceIntegrity {
  sha256: string;
  version: string;
  signature: string;
  state: 'VERIFIED' | 'PENDING' | 'FAILED';
  checkedAt: string; // ISO
}

export interface Evidence {
  id: string;
  caseId: string;
  title: string;
  description: string;
  type: EvidenceType;
  status: EvidenceStatus;
  custodyState: CustodyState;
  department: string;
  currentHolder: string;
  location: string;
  createdAt: string;
  updatedAt: string;
  lastActivityAt: string;
  relatedDocumentIds: string[];
  relatedMediaIds: string[];
  custodyEvents: CustodyEvent[];
  activityEvents: ActivityEvent[];
  integrity: EvidenceIntegrity;
}
