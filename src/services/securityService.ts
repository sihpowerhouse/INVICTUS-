import type {
  DocumentIntegrity,
  IntegritySummary,
  AuditEvent,
  AccessRequest,
  SecurityEvent,
  AccessRequestStatus
} from '../types/security';
import {
  mockIntegritySummary,
  mockDocumentIntegrity,
  mockAuditEvents,
  mockAccessRequests,
  mockSecurityEvents
} from '../mock/security';

class SecurityService {
  async getIntegritySummary(): Promise<IntegritySummary> {
    await new Promise(resolve => setTimeout(resolve, 600));
    return { ...mockIntegritySummary };
  }

  async getDocumentIntegrity(id: string): Promise<DocumentIntegrity | null> {
    await new Promise(resolve => setTimeout(resolve, 800));
    // For demo, return the mock data if it matches our primary mock ID, else return a variation
    if (id === mockDocumentIntegrity.documentId) {
      return { ...mockDocumentIntegrity };
    }
    // Return a slightly modified copy for other IDs to demonstrate dynamic routing
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

  // Frontend-only state mutation for demo purposes
  async updateAccessRequestStatus(id: string, status: AccessRequestStatus): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const req = mockAccessRequests.find(r => r.id === id);
    if (req) {
      req.status = status;
    }
  }
}

export const securityService = new SecurityService();
