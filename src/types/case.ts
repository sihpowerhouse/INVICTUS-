export type CaseStatus = 'NEW' | 'ACTIVE' | 'REVIEW' | 'ON_HOLD' | 'CLOSED' | 'ARCHIVED';
export type CasePriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type CaseAttention = 'ACTION_REQUIRED' | 'WAITING' | 'OVERDUE' | 'NONE';

export interface CasePerson {
  id: string;
  name: string;
  role: 'ACCUSED' | 'WITNESS' | 'OFFICER' | 'FORENSIC OFFICER' | 'OTHER';
  relevance: string;
}

export interface CaseLocation {
  id: string;
  location: string;
  type: string;
  reference: string;
}

export interface CaseDocument {
  id: string;
  name: string;
  type: string;
  version: string;
  status: string;
}

export interface CaseTimelineEvent {
  id: string;
  date: string;
  event: string;
  description: string;
  sourceReference?: string;
}

export interface Case {
  id: string;
  title: string;
  status: CaseStatus;
  priority: CasePriority;
  attention: CaseAttention;
  attentionDetails?: string;
  isNew: boolean;
  department: string;
  officer: string;
  description: string;
  documentsCount: number;
  evidenceCount: number;
  personsCount: number;
  locationsCount: number;
  lastActivity: string; // Keep for some display if needed, or compute
  createdAt: string;    // ISO string
  updatedAt: string;    // ISO string
  lastActivityAt: string; // ISO string
  
  // Relations (loaded on detail view)
  persons?: CasePerson[];
  locations?: CaseLocation[];
  documents?: CaseDocument[];
  timeline?: CaseTimelineEvent[];
}
