// No unused imports

import type { ISecurityService } from './security/SecurityServiceInterface';
import { MockSecurityAdapter } from './security/mockSecurityAdapter';
import { ApiSecurityAdapter } from './security/apiSecurityAdapter';

const useMockData = import.meta.env.VITE_USE_MOCK_DATA === 'true';

export const securityService: ISecurityService = useMockData
  ? new MockSecurityAdapter()
  : new ApiSecurityAdapter();
