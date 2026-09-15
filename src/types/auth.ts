export type UserType = 'INTERNAL' | 'EXTERNAL';

export interface User {
  userId: string;
  employeeId?: string;
  displayName: string;
  email: string;
  role: string;
  department?: string;
  userType: UserType;
}

export interface AuthSession {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  sessionExpiresAt?: number;
}

export interface LoginCredentials {
  employeeId?: string;
  email?: string;
  password?: string;
}
