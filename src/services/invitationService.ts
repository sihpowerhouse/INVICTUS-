import type { IInvitationService } from './invitation/InvitationServiceInterface';
import { MockInvitationAdapter } from './invitation/mockInvitationAdapter';
import { ApiInvitationAdapter } from './invitation/apiInvitationAdapter';

const useMockData = import.meta.env.VITE_USE_MOCK_DATA === 'true';

export const invitationService: IInvitationService = useMockData 
  ? new MockInvitationAdapter() 
  : new ApiInvitationAdapter();
