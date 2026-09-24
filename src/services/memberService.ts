import type { IMemberService } from './member/MemberServiceInterface';
import { MockMemberAdapter } from './member/mockMemberAdapter';
import { ApiMemberAdapter } from './member/apiMemberAdapter';

import { USE_MOCK_DATA } from './api/apiClient';

export const memberService: IMemberService = USE_MOCK_DATA 
  ? new MockMemberAdapter() 
  : new ApiMemberAdapter();
