import type { User, LoginCredentials } from '../../types/auth';
import type { IAuthService } from './AuthServiceInterface';
import { apiClient } from '../api/apiClient';

function mapBackendUser(data: any): User {
  let role = 'OFFICER';
  const deptType = (data.department_type || '').toUpperCase();
  if (data.is_department_head) {
    role = deptType ? `${deptType} HEAD` : 'HEAD';
  } else if (data.is_admin) {
    role = deptType ? `${deptType} ADMIN` : 'ADMIN';
  } else {
    role = deptType ? `${deptType} OFFICER` : 'OFFICER';
  }

  return {
    userId: data.user_id || 'UNKNOWN',
    employeeId: data.employee_id,
    displayName: data.full_name || 'Unknown User',
    department: data.department_name,
    role,
    userType: 'INTERNAL',
  };
}

function mapExternalBackendUser(data: any): User {
  return {
    userId: data.user_id || 'UNKNOWN',
    employeeId: '',
    email: data.email,
    displayName: data.email || 'External Participant',
    department: data.organization_name || 'EXTERNAL',
    role: data.role || 'EXTERNAL_PARTICIPANT',
    userType: 'EXTERNAL',
  };
}

export class ApiAuthAdapter implements IAuthService {
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    const isExternal = !!credentials.email;
    
    const endpoint = isExternal ? '/external/login' : '/login';
    const payload = isExternal 
      ? { email: credentials.email, password: credentials.password }
      : { employee_id: credentials.employeeId, password: credentials.password };
    
    // 1. Post to real login endpoint
    let loginResponse;
    try {
      loginResponse = await apiClient.post<any>(endpoint, payload);
    } catch (err: any) {
      if (err.status === 401) throw new Error('INVALID CREDENTIALS');
      if (err.status === 403) throw new Error('ACCOUNT / ACCESS RESTRICTED');
      if (err.status === 429) throw new Error('TOO MANY ATTEMPTS');
      if (err.status >= 500) throw new Error('AUTHENTICATION SERVICE UNAVAILABLE');
      throw err;
    }
    
    // 2. Temporarily set token and expiry to allow /me to use it
    localStorage.setItem('invictus_auth_token', loginResponse.token);
    const expiresAt = Date.now() + (loginResponse.expires_in_hours || 8) * 60 * 60 * 1000;
    localStorage.setItem('invictus_session_expires', expiresAt.toString());
    localStorage.setItem('invictus_user_type', isExternal ? 'EXTERNAL' : 'INTERNAL');
    
    // 3. Hydrate session identity using /me or /external/me
    const meEndpoint = isExternal ? '/external/me' : '/me';
    const meResponse = await apiClient.get<any>(meEndpoint);
    
    const user = isExternal ? mapExternalBackendUser(meResponse) : mapBackendUser(meResponse);
    
    localStorage.setItem('invictus_user', JSON.stringify(user));
    
    return { user, token: loginResponse.token };
  }

  async logout(): Promise<void> {
    // Backend has no explicit logout endpoint right now.
    // Local session cleanup is sufficient.
    localStorage.removeItem('invictus_auth_token');
    localStorage.removeItem('invictus_user');
    localStorage.removeItem('invictus_session_expires');
    localStorage.removeItem('invictus_user_type');
  }

  async getCurrentSession(): Promise<User | null> {
    const token = localStorage.getItem('invictus_auth_token');
    const expiresStr = localStorage.getItem('invictus_session_expires');
    const userType = localStorage.getItem('invictus_user_type') || 'INTERNAL';
    
    if (!token || !expiresStr) {
      return null;
    }
    
    const expiresAt = parseInt(expiresStr, 10);
    if (Date.now() > expiresAt) {
      await this.logout();
      return null;
    }
    
    // Hydrate current session by re-fetching /me or /external/me
    try {
      const isExternal = userType === 'EXTERNAL';
      const meEndpoint = isExternal ? '/external/me' : '/me';
      const meResponse = await apiClient.get<any>(meEndpoint);
      
      const user = isExternal ? mapExternalBackendUser(meResponse) : mapBackendUser(meResponse);
      localStorage.setItem('invictus_user', JSON.stringify(user));
      return user;
    } catch (e) {
      // 401s are caught by apiClient and will trigger invictus:unauthorized
      return null;
    }
  }

  async getSessionMetadata(): Promise<{ expiresAt: number } | null> {
    const expiresStr = localStorage.getItem('invictus_session_expires');
    if (expiresStr) {
      return { expiresAt: parseInt(expiresStr, 10) };
    }
    return null;
  }

  async refreshSession(): Promise<void> {
    // There is no backend refresh endpoint. 
    // If the token is still valid, we just do nothing and the UI will dismiss the warning.
    // If the token is invalid or expired locally, we force a logout.
    const expiresStr = localStorage.getItem('invictus_session_expires');
    if (expiresStr) {
      const expiresAt = parseInt(expiresStr, 10);
      if (Date.now() > expiresAt) {
         await this.logout();
         window.dispatchEvent(new Event('invictus:unauthorized'));
      }
    }
  }
}
