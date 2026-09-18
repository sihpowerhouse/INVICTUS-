import type { ExternalInvitation, DocumentAccess } from '../../types/access';

export interface IInvitationService {
  createExternalInvitation(caseId: string, email: string, role: string, documents: DocumentAccess[]): Promise<string>;
  getInvitation(token: string): Promise<ExternalInvitation | null>;
  acceptExternalInvitation(token: string, password: string): Promise<void>;
  getPendingInvitationsForCase(caseId: string): Promise<ExternalInvitation[]>;
}
