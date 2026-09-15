import type { ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import SessionTimeoutWarning from '../components/auth/SessionTimeoutWarning';
import './AppShell.css';

interface ExternalAppShellProps {
  children: ReactNode;
}

/**
 * ExternalAppShell — Layout composer for external users.
 * Deliberately excludes internal navigation (Sidebar) to physically guarantee
 * they cannot render internal navigation components.
 */
export default function ExternalAppShell({ children }: ExternalAppShellProps) {
  const { isAuthenticated, user, logout } = useAuth();

  if (!isAuthenticated || user?.userType !== 'EXTERNAL') {
    return <main className="app-shell__full">{children}</main>;
  }

  return (
    <div className="app-shell">
      <SessionTimeoutWarning />
      <div className="app-shell__main" style={{ marginLeft: 0, width: '100%' }}>
        <header className="top-nav" style={{ padding: '0 2rem' }}>
          <div className="top-nav__brand">
            <span className="top-nav__brand-title" style={{ color: 'var(--accent)' }}>INVICTUS</span>
            <span className="top-nav__brand-subtitle">SECURE EXTERNAL PORTAL</span>
          </div>
          <div className="top-nav__right" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="user-menu__info" style={{ textAlign: 'right' }}>
              <span className="user-menu__name" style={{ display: 'block', color: 'var(--text-primary)' }}>{user.displayName.toUpperCase()}</span>
              <span className="user-menu__role" style={{ color: 'var(--text-secondary)', fontSize: '0.7rem' }}>{user.role.toUpperCase()}</span>
            </div>
            <button 
              onClick={() => logout()}
              style={{
                background: 'transparent',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
                padding: '0.4rem 1rem',
                borderRadius: '4px',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem'
              }}
            >
              SIGN OUT
            </button>
          </div>
        </header>
        <main className="app-shell__content" style={{ padding: '2rem' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
