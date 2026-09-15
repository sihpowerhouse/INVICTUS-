import type { ExternalInvitation, DocumentAccess } from '../types/access';

class InvitationService {
  private invitations: Map<string, ExternalInvitation> = new Map();

  async createInvitation(
    caseId: string,
    email: string,
    role: string,
    documents: DocumentAccess[]
  ): Promise<string> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Deterministic mock token generation for development
        const token = `mock-token-${Date.now()}`;
        
        const invitation: ExternalInvitation = {
          id: token,
          caseId,
          email,
          role,
          status: 'PENDING',
          documents,
          createdAt: new Date().toISOString()
        };
        
        this.invitations.set(token, invitation);
        resolve(token);
      }, 600);
    });
  }

  async getInvitation(token: string): Promise<ExternalInvitation | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (token.startsWith('mock-token-') || token === 'demo-invitation-token') {
          // Return the cached one if it exists
          if (this.invitations.has(token)) {
            resolve(this.invitations.get(token) || null);
            return;
          }

          // Fallback deterministic demo invitation
          resolve({
            id: token,
            caseId: 'CASE-2026-0042',
            email: 'lawyer@example.com',
            role: 'EXTERNAL COUNSEL',
            status: 'PENDING',
            documents: [
              { documentId: 'DOC-1234', permission: 'READ ONLY' },
              { documentId: 'DOC-5678', permission: 'READ ONLY' }
            ],
            createdAt: new Date().toISOString()
          });
        } else {
          resolve(null);
        }
      }, 500);
    });
  }

  async getPendingInvitationsForCase(caseId: string): Promise<ExternalInvitation[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Return active map entries for the case
        const results = Array.from(this.invitations.values())
          .filter(inv => inv.caseId === caseId && inv.status === 'PENDING');
        
        resolve(results);
      }, 400);
    });
  }
}

export const invitationService = new InvitationService();
