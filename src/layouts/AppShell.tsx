import type { ReactNode } from 'react';
import Sidebar from './Sidebar';
import TopNav from '../components/layout/TopNav';
import './AppShell.css';

interface AppShellProps {
  children: ReactNode;
}

/**
 * AppShell — Master layout composer.
 * Wraps the Sidebar, TopNav, and main routed content.
 */
export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-shell__main">
        <TopNav />
        <main className="app-shell__content">
          {children}
        </main>
      </div>
    </div>
  );
}
