import { useState, useRef, useEffect } from 'react';
import './UserMenu.css';

/**
 * UserMenu — Compact officer profile trigger and dropdown.
 */
export default function UserMenu() {
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
          <span className="user-menu__name">YASH T</span>
          <span className="user-menu__role">INVESTIGATION OFFICER</span>
        </div>
        <div className="user-menu__avatar">YT</div>
      </button>

      {isOpen && (
        <div className="user-menu__dropdown" role="menu">
          <button className="user-menu__action" role="menuitem">Profile</button>
          <button className="user-menu__action" role="menuitem">Preferences</button>
          <button className="user-menu__action user-menu__action--danger" role="menuitem">Sign out</button>
        </div>
      )}
    </div>
  );
}
