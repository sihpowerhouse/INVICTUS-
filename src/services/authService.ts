import type { IAuthService } from './auth/AuthServiceInterface';
import { MockAuthAdapter } from './auth/mockAuthAdapter';
import { ApiAuthAdapter } from './auth/apiAuthAdapter';

/**
 * Global configuration to toggle between Mock and API data sources.
 * In production, this would be driven by environment variables (e.g., import.meta.env.VITE_USE_MOCK).
 */
const USE_MOCK_DATA = true;

/**
 * authService singleton
 * Consumers import this and use it without knowing if it's mock or real.
 */
export const authService: IAuthService = USE_MOCK_DATA 
  ? new MockAuthAdapter() 
  : new ApiAuthAdapter();
