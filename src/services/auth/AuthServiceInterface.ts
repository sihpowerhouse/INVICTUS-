import type { User, LoginCredentials } from '../../types/auth';

export interface IAuthService {
  login(credentials: LoginCredentials): Promise<{ user: User; token: string }>;
  logout(): Promise<void>;
  getCurrentSession(): Promise<User | null>;
  getSessionMetadata(): Promise<{ expiresAt: number } | null>;
  refreshSession(): Promise<void>;
}
