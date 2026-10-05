import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import './UserMenu.css';

/**
 * UserMenu — Compact officer profile trigger and dropdown.
 */
export default function UserMenu() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  if (!user) return null;

  // Derive initials
  const initials = user.displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <div className="user-menu" ref={containerRef}>
      <button 
        className="user-menu__trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="User menu"
      >
        <div className="user-menu__info">
          <span className="user-menu__name">{user.displayName.toUpperCase()}</span>
          <span className="user-menu__role">{user.role.toUpperCase()}</span>
        </div>
        <div className="user-menu__avatar">{initials}</div>
      </button>

      {isOpen && (
        <div className="user-menu__dropdown" role="menu">
          <button className="user-menu__action" role="menuitem">Profile</button>
          <button className="user-menu__action" role="menuitem">Preferences</button>
          <button className="user-menu__action user-menu__action--danger" role="menuitem" onClick={() => { setIsOpen(false); logout(); }}>Sign out</button>
        </div>
      )}
    </div>
  );
}
