import type { ExternalInvitation, DocumentAccess } from '../../types/access';
import type { IInvitationService } from './InvitationServiceInterface';
import { apiClient } from '../api/apiClient';

export class ApiInvitationAdapter implements IInvitationService {
  async createExternalInvitation(
    caseId: string,
    email: string,
    role: string,
    documents: DocumentAccess[]
  ): Promise<string> {
    const payload = {
      case_id: caseId,
      email,
      role,
      documents
    };

    await apiClient.post<any>('/case/invite-external', payload);
    // Backend emails the token, we do not receive it in the frontend.
    return ''; 
  }

  async getInvitation(token: string): Promise<ExternalInvitation | null> {
    // The backend does not expose an endpoint to retrieve invitation details before acceptance.
    // We return a minimal stub so the UI can render the password setup form.
    return {
      id: token,
      caseId: 'UNKNOWN', // Hidden until accepted
      email: 'Participant', // Hidden until accepted
      role: 'EXTERNAL',
      status: 'PENDING',
      documents: [],
      createdAt: new Date().toISOString()
    };
  }

  async getPendingInvitationsForCase(_caseId: string): Promise<ExternalInvitation[]> {
    // Backend does not expose pending external invitations directly.
    return [];
  }

  async acceptExternalInvitation(token: string, password: string): Promise<void> {
    const payload = {
      token,
      password
    };
    await apiClient.post<any>('/external/accept', payload);
  }
}
