import type { ReactNode } from 'react';
import Sidebar from './Sidebar';
import TopNav from '../components/layout/TopNav';
import { useAuth } from '../hooks/useAuth';
import SessionTimeoutWarning from '../components/auth/SessionTimeoutWarning';
import InternalFAB from '../components/layout/InternalFAB';
import './AppShell.css';

interface AppShellProps {
  children: ReactNode;
}

/**
 * AppShell — Master layout composer.
 * Wraps the Sidebar, TopNav, and main routed content.
 */
export default function AppShell({ children }: AppShellProps) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <main className="app-shell__full">{children}</main>;
  }

  return (
    <div className="app-shell">
      <SessionTimeoutWarning />
      <Sidebar />
      <div className="app-shell__main">
        <TopNav />
        <main className="app-shell__content">
          {children}
        </main>
      </div>
      <InternalFAB />
    </div>
  );
}
