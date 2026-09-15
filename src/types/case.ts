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

export type TimelineEventType = 
  | 'FIR_CREATED' 
  | 'DOCUMENT_UPLOADED' | 'DOCUMENT_VIEWED' | 'DOCUMENT_UPDATED' | 'DOCUMENT_VERSION_CREATED'
  | 'EVIDENCE_ADDED' | 'EVIDENCE_ACCESSED'
  | 'MEDIA_UPLOADED' | 'MEDIA_PROCESSED'
  | 'OCR_COMPLETED' | 'ENTITY_EXTRACTION_COMPLETED' | 'INDEXING_COMPLETED'
  | 'INTEGRITY_CHECKED' | 'SIGNATURE_CREATED'
  | 'ACCESS_REQUESTED' | 'ACCESS_GRANTED' | 'ACCESS_DENIED'
  | 'EXTERNAL_LOGIN' | 'EXTERNAL_DOCUMENT_VIEWED'
  | 'AI_QUERY' | 'AI_ANSWER' | 'AI_SOURCE_ACCESSED'
  | 'PROCESSING_FAILED';

export interface CaseTimelineEvent {
  id: string;
  caseId: string;
  timestamp: string; // ISO string
  type: TimelineEventType;
  title: string;
  description: string;
  actor?: string;
  actorRole?: string;
  department?: string;
  resourceId?: string;
  resourceType?: 'DOCUMENT' | 'EVIDENCE' | 'MEDIA' | 'CASE' | 'USER';
  status?: 'SUCCESS' | 'PENDING' | 'FAILED' | 'WARNING';
  severity?: 'INFO' | 'WARNING' | 'CRITICAL';
}

export interface CaseMember {
  id: string;
  name: string;
  email?: string;
  role: string;
  department: string;
  memberType?: 'INTERNAL' | 'EXTERNAL';
  authorizedDocuments?: number;
  accessState: 'APPROVED' | 'PENDING' | 'DENIED' | 'INVITED' | 'SUSPENDED' | 'EXPIRED';
  joinedAt?: string;
}

export type CaseAIStatus = 'ENABLED' | 'DISABLED';

export interface Case {
  id: string;
  firNumber?: string;
  title: string;
  status: CaseStatus;
  priority: CasePriority;
  attention: CaseAttention;
  attentionDetails?: string;
  isNew: boolean;
  department: string;
  officer: string;
  caseHead?: string;
  description: string;
  documentsCount: number;
  evidenceCount: number;
  personsCount: number;
  locationsCount: number;
  lastActivity: string; // Keep for some display if needed, or compute
  createdAt: string;    // ISO string
  updatedAt: string;    // ISO string
  lastActivityAt: string; // ISO string
  
  // AI State
  aiStatus?: CaseAIStatus;
  aiProvider?: string;
  aiModel?: string;

  // Relations (loaded on detail view)
  persons?: CasePerson[];
  locations?: CaseLocation[];
  documents?: CaseDocument[];
  members?: CaseMember[];
}
