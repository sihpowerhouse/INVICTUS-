import { createContext } from 'react';
import type { AuthSession, LoginCredentials } from '../types/auth';

export interface AuthContextType extends AuthSession {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
