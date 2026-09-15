import type { User, LoginCredentials } from '../../types/auth';
import type { IAuthService } from './AuthServiceInterface';

export class ApiAuthAdapter implements IAuthService {
  async login(_credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    // TODO: Connect to real backend endpoint
    // const response = await fetch('/api/v1/auth/login', { ... })
    throw new Error('API Auth Adapter not implemented yet.');
  }

  async logout(): Promise<void> {
    // TODO: Connect to real backend endpoint
    // await fetch('/api/v1/auth/logout', { ... })
    throw new Error('API Auth Adapter not implemented yet.');
  }

  async getCurrentSession(): Promise<User | null> {
    // TODO: Connect to real backend endpoint
    // const response = await fetch('/api/v1/auth/me', { ... })
    throw new Error('API Auth Adapter not implemented yet.');
  }

  async getSessionMetadata(): Promise<{ expiresAt: number } | null> {
    throw new Error('API Auth Adapter not implemented yet.');
  }

  async refreshSession(): Promise<void> {
    throw new Error('API Auth Adapter not implemented yet.');
  }
}
