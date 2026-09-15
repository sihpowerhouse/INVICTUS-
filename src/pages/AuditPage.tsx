import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuditPage.css';
import { securityService } from '../services/securityService';
import type { AuditEvent } from '../types/security';
import AuditTimeline from '../components/security/AuditTimeline';
import Dropdown from '../components/common/Dropdown';

export default function AuditPage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters (mock only)
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('');

  useEffect(() => {
    let mounted = true;
    securityService.getAuditEvents().then(res => {
      if (mounted) {
        setEvents(res);
        setIsLoading(false);
      }
    });
    return () => { mounted = false; };
  }, []);

  const filteredEvents = events.filter(e => {
    if (actionFilter && e.action !== actionFilter) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return e.actor.toLowerCase().includes(term) || 
             e.target.toLowerCase().includes(term) || 
             (e.caseId && e.caseId.toLowerCase().includes(term));
    }
    return true;
  });

  return (
    <div className="audit-page">
      <div className="audit-page__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <p className="page-tag">INVICTUS / SECURITY</p>
          <h1 className="page-title">AUDIT TRAIL</h1>
        </div>
        <button 
          type="button"
          className="audit-page__analytics-link" 
          onClick={() => navigate('/analytics')}
        >
          OPERATIONAL ANALYTICS →
        </button>
      </div>

      <div className="audit-page__layout">
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="security-panel">
            <h3 className="security-panel__title" style={{ marginBottom: '16px' }}>FILTERS</h3>
            <input 
              type="text" 
              placeholder="Search actor, target, case..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                background: 'rgba(0,0,0,0.5)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-primary)',
                fontFamily: 'monospace',
                fontSize: '12px'
              }}
            />
            <div style={{ marginTop: '12px' }}>
              <Dropdown
                value={actionFilter}
                onChange={val => setActionFilter(val)}
                options={[
                  { value: '', label: 'ALL ACTIONS' },
                  { value: 'VIEWED', label: 'VIEWED' },
                  { value: 'MODIFIED', label: 'MODIFIED' },
                  { value: 'INTEGRITY_CHECK', label: 'INTEGRITY CHECK' },
                  { value: 'SIGNATURE_VERIFIED', label: 'SIGNATURE VERIFIED' }
                ]}
              />
            </div>
          </div>
        </aside>

        <main>
          {isLoading ? (
            <div className="intelligence-loading">LOADING AUDIT TRAIL...</div>
          ) : (
            <AuditTimeline events={filteredEvents} />
          )}
        </main>
      </div>
    </div>
  );
}
