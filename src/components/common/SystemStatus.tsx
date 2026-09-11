import { useState, useRef, useEffect } from 'react';
import './SystemStatus.css';

/**
 * SystemStatus — Compact header status indicator.
 * Currently uses mock frontend states as placeholders for future backend health endpoints.
 */
export default function SystemStatus() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
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

  const mockStatuses = [
    { id: 'doc', label: 'DOCUMENT PROCESSING', status: 'ONLINE' },
    { id: 'ocr', label: 'OCR', status: 'ONLINE' },
    { id: 'search', label: 'SEARCH', status: 'ONLINE' },
    { id: 'ai', label: 'AI', status: 'ONLINE' },
    { id: 'integrity', label: 'INTEGRITY', status: 'SECURE' },
  ];

  return (
    <div className="system-status" ref={containerRef}>
      <button 
        className="system-status__trigger" 
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="System status"
      >
        <span className="system-status__indicator" aria-hidden="true" />
        <span>SYSTEM OPERATIONAL</span>
      </button>

      {isOpen && (
        <div className="system-status__dropdown" role="menu">
          <div className="system-status__header">
            Frontend Demo State
          </div>
          <div className="system-status__list">
            {mockStatuses.map(item => (
              <div className="system-status__item" key={item.id} role="menuitem">
                <span className="system-status__item-label">{item.label}</span>
                <span className="system-status__item-val">{item.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
