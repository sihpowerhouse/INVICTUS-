import type { User, LoginCredentials } from '../../types/auth';
import type { IAuthService } from './AuthServiceInterface';

export class MockAuthAdapter implements IAuthService {
  private readonly MOCK_DELAY = 800;

  private mockInternalUser: User = {
    userId: 'USR-SEC-001',
    employeeId: 'SEC-PS-HEAD-001',
    displayName: 'COMMANDER VANCE',
    email: 'vance@invictus.gov',
    role: 'POLICE HEAD',
    department: 'POLICE',
    userType: 'INTERNAL'
  };

  private mockExternalUser: User = {
    userId: 'USR-EXT-001',
    displayName: 'A. LAWYER',
    email: 'lawyer@example.com',
    role: 'LEGAL COUNSEL',
    userType: 'EXTERNAL'
  };

  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (credentials.employeeId && credentials.employeeId.toLowerCase() === 'error') {
          reject(new Error('Invalid credentials'));
          return;
        }

        // Determine if logging in as internal or external based on credentials provided
        const isExternal = !!credentials.email;

        let user: User;
        
        if (isExternal) {
          user = {
            ...this.mockExternalUser,
            email: credentials.email || this.mockExternalUser.email,
          };
        } else {
          user = {
            ...this.mockInternalUser,
            employeeId: (credentials.employeeId || '').toUpperCase() || this.mockInternalUser.employeeId,
          };
        }

        localStorage.setItem('invictus_auth_token', 'mock_token_123');
        localStorage.setItem('invictus_user', JSON.stringify(user));
        
        // Mock session expires in 5 minutes (for testing timeout UX)
        const expiresAt = Date.now() + 5 * 60 * 1000;
        localStorage.setItem('invictus_session_expires', expiresAt.toString());

        resolve({ user, token: 'mock_token_123' });
      }, this.MOCK_DELAY);
    });
  }

  async logout(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.removeItem('invictus_auth_token');
        localStorage.removeItem('invictus_user');
        localStorage.removeItem('invictus_session_expires');
        resolve();
      }, 300);
    });
  }

  async getCurrentSession(): Promise<User | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const token = localStorage.getItem('invictus_auth_token');
        const userStr = localStorage.getItem('invictus_user');
        const expiresStr = localStorage.getItem('invictus_session_expires');
        
        if (token && userStr && expiresStr) {
          const expiresAt = parseInt(expiresStr, 10);
          if (Date.now() > expiresAt) {
            // Session expired
            this.logout().then(() => resolve(null));
            return;
          }

          try {
            resolve(JSON.parse(userStr));
          } catch {
            resolve(null);
          }
        } else {
          resolve(null);
        }
      }, 300);
    });
  }

  // Extend mock adapter to return session metadata
  async getSessionMetadata(): Promise<{ expiresAt: number } | null> {
    const expiresStr = localStorage.getItem('invictus_session_expires');
    if (expiresStr) {
      return { expiresAt: parseInt(expiresStr, 10) };
    }
    return null;
  }

  // Mock token refresh
  async refreshSession(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const expiresAt = Date.now() + 5 * 60 * 1000;
        localStorage.setItem('invictus_session_expires', expiresAt.toString());
        resolve();
      }, 300);
    });
  }
}
