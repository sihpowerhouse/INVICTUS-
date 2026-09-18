import type { IMemberService } from './member/MemberServiceInterface';
import { MockMemberAdapter } from './member/mockMemberAdapter';
import { ApiMemberAdapter } from './member/apiMemberAdapter';

const useMockData = import.meta.env.VITE_USE_MOCK_DATA === 'true';

export const memberService: IMemberService = useMockData 
  ? new MockMemberAdapter() 
  : new ApiMemberAdapter();
