import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuditPage.css';
import { securityService } from '../services/securityService';
import type { AuditEvent } from '../types/security';
import AuditTimeline from '../components/security/AuditTimeline';
import InvictusSelect from '../components/ui/InvictusSelect';

export default function AuditPage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters (mock only)
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('');

  useEffect(() => {
    let mounted = true;
    
    const fetchAudit = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await securityService.getAuditEvents();
        if (mounted) {
          setEvents(res);
        }
      } catch (err: any) {
        if (mounted) {
          setError(err.message || 'AUDIT ACCESS NOT AUTHORIZED');
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };
    
    fetchAudit();
    
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
      <div style={{ fontSize: '10px', fontFamily: 'monospace', color: 'var(--text-dim)', letterSpacing: '0.15em', marginBottom: '8px' }}>
        SCOPE: USER-AUTHORIZED EVENTS — SHOWING ONLY EVENTS ON YOUR ASSIGNED CASES AND DOCUMENTS
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
              <InvictusSelect
                value={actionFilter}
                onChange={val => setActionFilter(val)}
                options={[
                  { value: '', label: 'ALL ACTIONS' },
                  { value: 'VIEWED', label: 'VIEWED' },
                  { value: 'MODIFIED', label: 'MODIFIED' },
                  { value: 'UPLOADED', label: 'UPLOADED' },
                  { value: 'EXTRACTION_ACCEPTED', label: 'EXTRACTION ACCEPTED' },
                  { value: 'EXTRACTION_EDITED', label: 'EXTRACTION EDITED' },
                  { value: 'DOCUMENT_REPROCESSED', label: 'DOCUMENT REPROCESSED' },
                  { value: 'INTEGRITY_CHECK', label: 'INTEGRITY CHECK' },
                  { value: 'SIGNATURE_VERIFIED', label: 'SIGNATURE VERIFIED' },
                  { value: 'VERSION_CREATED', label: 'VERSION CREATED' },
                ]}
              />
            </div>
          </div>
        </aside>

        <main>
          {isLoading ? (
            <div className="intelligence-loading">LOADING AUDIT TRAIL...</div>
          ) : error ? (
            <div className="audit-empty-state error" style={{ padding: '40px', textAlign: 'center', color: '#ff6b6b' }}>
              <h3>AUDIT ACCESS NOT AUTHORIZED</h3>
              <p>{error}</p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="audit-empty-state" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <h3>NO AUTHORIZED ACTIVITY RECORDED</h3>
              <p>No user-authorized events found matching the current scope.</p>
            </div>
          ) : (
            <AuditTimeline events={filteredEvents} />
          )}
        </main>
      </div>
    </div>
  );
}
