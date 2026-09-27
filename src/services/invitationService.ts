import type { IInvitationService } from './invitation/InvitationServiceInterface';
import { MockInvitationAdapter } from './invitation/mockInvitationAdapter';
import { ApiInvitationAdapter } from './invitation/apiInvitationAdapter';

import { USE_MOCK_DATA } from './api/apiClient';

export const invitationService: IInvitationService = USE_MOCK_DATA 
  ? new MockInvitationAdapter() 
  : new ApiInvitationAdapter();
