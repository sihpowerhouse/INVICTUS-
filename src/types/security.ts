export type IntegrityStatusType = 'VERIFIED' | 'PENDING' | 'REQUIRES_REVIEW' | 'FAILED' | 'UNKNOWN';

export interface HashRecord {
  algorithm: string;
  currentHash: string;
  previousHash: string;
  computedAt: string;
}

export interface VersionRecord {
  version: number;
  timestamp: string;
  actor: string;
  department: string;
  status: IntegrityStatusType;
  hashPreview: string;
  isCurrent: boolean;
}

export interface SignatureRecord {
  status: 'VERIFIED' | 'INVALID' | 'PENDING' | 'NONE';
  algorithm: string;
  signedBy: string;
  signedAt: string;
  department: string;
}

export interface MerkleNode {
  id: string;
  hash: string;
  label: string;
  type: 'ROOT' | 'BRANCH' | 'LEAF';
  children: string[];
  parentId: string | null;
}

export interface DocumentIntegrity {
  documentId: string;
  documentName: string;
  caseId: string;
  status: IntegrityStatusType;
  hash: HashRecord;
  versions: VersionRecord[];
  signature: SignatureRecord;
  merkleNodes: MerkleNode[];
  merkleRoot: string;
  lastVerifiedAt: string;
}

export interface IntegritySummary {
  totalDocuments: number;
  verifiedCount: number;
  pendingCount: number;
  failedCount: number;
  totalVersionChains: number;
  totalSignatures: number;
  totalAuditEvents: number;
  recentDocuments: DocumentIntegrity[];
}

export type AuditAction =
  | 'VIEWED'
  | 'UPLOADED'
  | 'MODIFIED'
  | 'DELETED'
  | 'INTEGRITY_CHECK'
  | 'SIGNATURE_VERIFIED'
  | 'ACCESS_REQUESTED'
  | 'ACCESS_APPROVED'
  | 'ACCESS_DENIED'
  | 'VERSION_CREATED'
  | 'EXPORTED';

export interface AuditEvent {
  id: string;
  timestamp: string;
  actor: string;
  department: string;
  action: AuditAction;
  target: string;
  targetType: 'DOCUMENT' | 'EVIDENCE' | 'CASE' | 'MEDIA' | 'SYSTEM';
  result: 'SUCCESS' | 'FAILURE' | 'PENDING';
  caseId?: string;
}

export type AccessRequestStatus = 'PENDING' | 'APPROVED' | 'DENIED' | 'EXPIRED';

export interface AccessRequest {
  id: string;
  requester: string;
  department: string;
  caseId: string;
  documentId: string;
  documentName: string;
  permission: 'VIEW' | 'EDIT' | 'DOWNLOAD' | 'DELETE';
  requestedAt: string;
  reason: string;
  status: AccessRequestStatus;
}

export type SecuritySeverity = 'INFO' | 'WARNING' | 'CRITICAL';

export interface SecurityEvent {
  id: string;
  timestamp: string;
  type: string;
  description: string;
  severity: SecuritySeverity;
  actor?: string;
  target?: string;
}
