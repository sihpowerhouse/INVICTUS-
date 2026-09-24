// No unused imports

import type { ISecurityService } from './security/SecurityServiceInterface';
import { MockSecurityAdapter } from './security/mockSecurityAdapter';
import { ApiSecurityAdapter } from './security/apiSecurityAdapter';

import { USE_MOCK_DATA } from './api/apiClient';

export const securityService: ISecurityService = USE_MOCK_DATA
  ? new MockSecurityAdapter()
  : new ApiSecurityAdapter();
