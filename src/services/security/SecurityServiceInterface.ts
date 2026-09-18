import type {
  DocumentIntegrity,
  IntegritySummary,
  AuditEvent,
  AccessRequest,
  SecurityEvent,
  AccessRequestStatus
} from '../../types/security';

export interface ISecurityService {
  requestOtp(purpose: string, caseId?: string): Promise<{ message: string; expires_in_seconds: number }>;
  verifyOtp(purpose: string, code: string, caseId?: string): Promise<void>;
  
  getIntegritySummary(): Promise<IntegritySummary>;
  getDocumentIntegrity(id: string): Promise<DocumentIntegrity | null>;
  getAuditEvents(): Promise<AuditEvent[]>;
  getAccessRequests(): Promise<AccessRequest[]>;
  getSecurityEvents(): Promise<SecurityEvent[]>;
  updateAccessRequestStatus(id: string, status: AccessRequestStatus): Promise<void>;
  buildMerkle(caseId: string): Promise<{ root_hash: string; message: string }>;
  verifyMerkle(caseId: string): Promise<{ root_hash: string; valid: boolean }>;
}
