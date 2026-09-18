import type { ISecurityService } from './SecurityServiceInterface';
import type {
  DocumentIntegrity,
  IntegritySummary,
  AuditEvent,
  AccessRequest,
  SecurityEvent,
  AccessRequestStatus
} from '../../types/security';
import {
  mockIntegritySummary,
  mockDocumentIntegrity,
  mockAuditEvents,
  mockAccessRequests,
  mockSecurityEvents
} from '../../mock/security';

export class MockSecurityAdapter implements ISecurityService {
  async requestOtp(_purpose: string, _caseId?: string): Promise<{ message: string; expires_in_seconds: number }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      message: "A mock 6-digit verification code was sent.",
      expires_in_seconds: 300
    };
  }

  async verifyOtp(_purpose: string, code: string, _caseId?: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    if (code !== '123456' && !code.startsWith('123')) {
      throw new Error("Invalid mock OTP code");
    }
  }

  async getIntegritySummary(): Promise<IntegritySummary> {
    await new Promise(resolve => setTimeout(resolve, 600));
    return { ...mockIntegritySummary };
  }

  async getDocumentIntegrity(id: string): Promise<DocumentIntegrity | null> {
    await new Promise(resolve => setTimeout(resolve, 800));
    if (id === mockDocumentIntegrity.documentId) {
      return { ...mockDocumentIntegrity };
    }
    return {
      ...mockDocumentIntegrity,
      documentId: id,
      documentName: `Document_${id}.pdf`
    };
  }

  async getAuditEvents(): Promise<AuditEvent[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...mockAuditEvents];
  }

  async getAccessRequests(): Promise<AccessRequest[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    return [...mockAccessRequests];
  }

  async getSecurityEvents(): Promise<SecurityEvent[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    return [...mockSecurityEvents];
  }

  async updateAccessRequestStatus(id: string, status: AccessRequestStatus): Promise<void> {
    const request = mockAccessRequests.find(r => r.id === id);
    if (request) {
      request.status = status;
    }
  }

  async buildMerkle(caseId: string): Promise<{ root_hash: string; message: string }> {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
      root_hash: `mock_case_merkle_root_${caseId}_d8a1c2b3e4f5a6b7c8d9e0f1a2b3c4d5`,
      message: 'Merkle tree built successfully (MOCK)'
    };
  }

  async verifyMerkle(caseId: string): Promise<{ root_hash: string; valid: boolean }> {
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      root_hash: `mock_case_merkle_root_${caseId}_d8a1c2b3e4f5a6b7c8d9e0f1a2b3c4d5`,
      valid: true
    };
  }
}
