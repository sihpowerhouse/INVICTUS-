import type { IAuthService } from './auth/AuthServiceInterface';
import { MockAuthAdapter } from './auth/mockAuthAdapter';
import { ApiAuthAdapter } from './auth/apiAuthAdapter';
import { USE_MOCK_DATA } from './api/apiClient';

/**
 * authService singleton
 * Consumers import this and use it without knowing if it's mock or real.
 */
export const authService: IAuthService = USE_MOCK_DATA 
  ? new MockAuthAdapter() 
  : new ApiAuthAdapter();

