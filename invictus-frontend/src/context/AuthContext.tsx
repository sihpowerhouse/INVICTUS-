import { useState, useEffect, type ReactNode } from 'react';
import type { AuthSession, LoginCredentials } from '../types/auth';
import { authService } from '../services/authService';
import { AuthContext } from './AuthContextCore';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    let mounted = true;
    
    const initSession = async () => {
      try {
        const user = await authService.getCurrentSession();
        let metadata = null;
        if (user) {
          metadata = await authService.getSessionMetadata();
        }
        
        if (mounted) {
          setSession({
            user,
            isAuthenticated: !!user,
            isLoading: false,
            sessionExpiresAt: metadata?.expiresAt
          });
        }
      } catch {
        if (mounted) {
          setSession({ user: null, isAuthenticated: false, isLoading: false });
        }
      }
    };

    const handleUnauthorized = () => {
      if (mounted) {
        setSession({ user: null, isAuthenticated: false, isLoading: false });
        // The apiClient has already cleared the token
      }
    };

    window.addEventListener('invictus:unauthorized', handleUnauthorized);
    initSession();

    return () => {
      mounted = false;
      window.removeEventListener('invictus:unauthorized', handleUnauthorized);
    };
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const { user } = await authService.login(credentials);
    const metadata = await authService.getSessionMetadata();
    setSession({
      user,
      isAuthenticated: true,
      isLoading: false,
      sessionExpiresAt: metadata?.expiresAt
    });
  };

  const refresh = async () => {
    await authService.refreshSession();
    const metadata = await authService.getSessionMetadata();
    setSession(prev => ({
      ...prev,
      sessionExpiresAt: metadata?.expiresAt
    }));
  };

  const logout = async () => {
    await authService.logout();
    setSession({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  return (
    <AuthContext.Provider value={{ ...session, login, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}
