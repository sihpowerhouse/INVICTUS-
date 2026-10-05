import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import CommandSearch from './CommandSearch';
import SystemStatus from '../common/SystemStatus';
import AccessibilityMenu from './AccessibilityMenu';
import UserMenu from './UserMenu';
import './TopNav.css';

/**
 * TopNav — Primary top navigation bar for the application shell.
 */
export default function TopNav() {
  return (
    <header className="top-nav">
      {/* Left: Branding */}
      <div className="top-nav__brand">
        <Link to="/" className="top-nav__brand-link" aria-label="INVICTUS Home">
          <img
            src="/emblem.png"
            alt="INVICTUS Four-Lion Emblem"
            className="top-nav__emblem"
          />
          <div className="top-nav__brand-text">
            <span className="top-nav__brand-title">INVICTUS</span>
            <span className="top-nav__brand-subtitle">NATIONAL EVIDENCE INTELLIGENCE</span>
          </div>
        </Link>
      </div>

      {/* Center: Command Search */}
      <div className="top-nav__center">
        <CommandSearch />
      </div>

      {/* Right: Actions & User */}
      <div className="top-nav__right">
        <div className="top-nav__actions">
          <SystemStatus />
          <AccessibilityMenu />
          <button className="top-nav__icon-btn" aria-label="Notifications">
            <Bell size={16} />
          </button>
        </div>
        <UserMenu />
      </div>
    </header>
  );
}
