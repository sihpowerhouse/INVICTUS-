import type { ISecurityService } from './SecurityServiceInterface';
import type {
  DocumentIntegrity,
  IntegritySummary,
  AuditEvent,
  AccessRequest,
  SecurityEvent,
  AccessRequestStatus
} from '../../types/security';
import { apiClient } from '../api/apiClient';

export class ApiSecurityAdapter implements ISecurityService {
  async requestOtp(purpose: string, caseId?: string): Promise<{ message: string; expires_in_seconds: number }> {
    return apiClient.post('/security/request-otp', {
      purpose,
      ...(caseId ? { case_id: caseId } : {})
    });
  }

  async verifyOtp(purpose: string, code: string, caseId?: string): Promise<void> {
    await apiClient.post('/security/verify-otp', {
      purpose,
      code,
      ...(caseId ? { case_id: caseId } : {})
    });
  }

  // Currently unimplemented in real API, returning dummy empty data or throw
  async getIntegritySummary(): Promise<IntegritySummary> {
    return {
      totalDocuments: 0,
      verifiedCount: 0,
      pendingCount: 0,
      failedCount: 0,
      totalVersionChains: 0,
      totalSignatures: 0,
      totalAuditEvents: 0,
      recentDocuments: []
    };
  }

  async getDocumentIntegrity(versionId: string): Promise<DocumentIntegrity | null> {
    const data = await apiClient.get<any>(`/documents/verify/${encodeURIComponent(versionId)}`);
    
    return {
      documentId: versionId, // use versionId as doc identifier for integrity display
      documentName: 'Secured Document',
      caseId: 'N/A',
      status: data.valid ? 'VERIFIED' : 'FAILED',
      hash: {
        algorithm: data.algorithm || 'SHA-256',
        currentHash: data.actual_hash || data.stored_hash || '',
        previousHash: '', // Not provided by this endpoint
        computedAt: new Date().toISOString()
      },
      versions: [], // The backend does not provide version history on this endpoint
      signature: {
        status: data.signature_valid === true ? 'VERIFIED' : (data.signature_valid === false ? 'INVALID' : 'NONE'),
        algorithm: data.algorithm || 'RSA-PSS',
        signedBy: data.signing_key_id || data.uploader_id || 'System',
        signedAt: new Date().toISOString(),
        department: 'N/A'
      },
      lastVerifiedAt: new Date().toISOString()
    };
  }

  async getAuditEvents(): Promise<AuditEvent[]> {
    return [];
  }

  async getAccessRequests(): Promise<AccessRequest[]> {
    return [];
  }

  async getSecurityEvents(): Promise<SecurityEvent[]> {
    return [];
  }

  async updateAccessRequestStatus(_id: string, _status: AccessRequestStatus): Promise<void> {
    throw new Error('Not implemented on real API yet.');
  }

  async buildMerkle(caseId: string): Promise<{ root_hash: string; message: string }> {
    return apiClient.post('/case/merkle/build', { case_id: caseId });
  }

  async verifyMerkle(caseId: string): Promise<{ root_hash: string; valid: boolean }> {
    return apiClient.get(`/case/merkle/verify?case_id=${encodeURIComponent(caseId)}`);
  }
}
