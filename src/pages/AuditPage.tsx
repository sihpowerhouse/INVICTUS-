import { useState, useEffect, useMemo } from 'react';
import './AuditPage.css';
import { securityService } from '../services/securityService';
import type { AuditEvent } from '../types/security';
import InvictusSelect from '../components/ui/InvictusSelect';

// ── Action filter options — derived from real backend action strings ──────────
const ACTION_OPTIONS = [
  { value: '',                       label: 'ALL ACTIONS' },
  { value: 'FILE_UPLOADED',          label: 'UPLOAD' },
  { value: 'document_uploaded',      label: 'DOCUMENT UPLOADED' },
  { value: 'VIEWED',                 label: 'VIEWED' },
  { value: 'MODIFIED',               label: 'MODIFIED' },
  { value: 'EXTRACTION_ACCEPTED',    label: 'EXTRACTION ACCEPTED' },
  { value: 'EXTRACTION_EDITED',      label: 'EXTRACTION EDITED' },
  { value: 'DOCUMENT_REPROCESSED',   label: 'DOCUMENT REPROCESSED' },
  { value: 'INTEGRITY_CHECK',        label: 'INTEGRITY CHECK' },
  { value: 'VERSION_CREATED',        label: 'VERSION CREATED' },
  { value: 'DOCUMENT_AI_ENABLED',    label: 'AI ENABLED' },
  { value: 'DOCUMENT_AI_DISABLED',   label: 'AI DISABLED' },
];

// ── Result badge ─────────────────────────────────────────────────────────────

function ResultBadge({ result }: { result: string }) {
  const isSuccess = result === 'SUCCESS' || !result;
  const isFailure = result === 'FAILURE' || result === 'FAILED';
  const cls = isSuccess
    ? 'status-badge--verified'
    : isFailure
    ? 'status-badge--red'
    : 'status-badge--amber';
  return (
    <span className={`status-badge ${cls}`} style={{ padding: '2px 6px', fontSize: '9px' }}>
      {result || 'SUCCESS'}
    </span>
  );
}

// ── Single audit event row ────────────────────────────────────────────────────

function AuditEventRow({ event, index }: { event: AuditEvent; index: number }) {
  const time = new Date(event.timestamp).toLocaleTimeString([], {
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  });
  const date = new Date(event.timestamp).toLocaleDateString([], {
    month: 'short', day: '2-digit'
  });

  const opacity = index === 0 ? 1 : Math.max(0.65, 1 - index * 0.04);

  // Derive case label from caseId field
  const caseLabel = event.caseId
    ? `CASE: ${String(event.caseId).slice(0, 12).toUpperCase()}...`
    : null;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '90px 1fr auto',
        gap: '16px',
        padding: '12px 16px',
        background: 'rgba(255,255,255,0.02)',
        borderLeft: `2px solid ${event.result === 'FAILURE' ? '#ff3b30' : 'var(--accent)'}`,
        borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
        opacity,
        transition: 'opacity 0.15s ease',
      }}
    >
      {/* Time */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <span style={{ fontFamily: 'monospace', fontSize: '11px', color: 'var(--accent)', letterSpacing: '0.05em' }}>
          {time}
        </span>
        <span style={{ fontFamily: 'monospace', fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
          {date}
        </span>
      </div>

      {/* Action + Target */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span style={{ fontFamily: 'monospace', fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '0.08em' }}>
          {event.action}
        </span>
        <span style={{ fontFamily: 'monospace', fontSize: '10px', color: 'var(--text-secondary)', wordBreak: 'break-all' }}>
          {event.target}
        </span>
        {caseLabel && (
          <span style={{ fontFamily: 'monospace', fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
            {caseLabel}
          </span>
        )}
      </div>

      {/* Result */}
      <div style={{ alignSelf: 'flex-start', paddingTop: '2px' }}>
        <ResultBadge result={event.result} />
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function AuditPage() {
  const [events, setEvents]     = useState<AuditEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [searchTerm, setSearchTerm]   = useState('');
  const [actionFilter, setActionFilter] = useState('');

  useEffect(() => {
    let mounted = true;

    const fetch = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await securityService.getMyAuditEvents();
        if (mounted) setEvents(res);
      } catch (err: any) {
        if (mounted) setError(err?.message || 'AUDIT ACCESS NOT AUTHORIZED');
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    fetch();
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() => {
    return events.filter(e => {
      if (actionFilter && !e.action.includes(actionFilter)) return false;
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        return (
          e.action.toLowerCase().includes(q) ||
          e.target.toLowerCase().includes(q) ||
          (e.caseId && String(e.caseId).toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [events, searchTerm, actionFilter]);

  return (
    <div className="audit-page">
      {/* Header */}
      <div className="audit-page__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <p className="page-tag">INVICTUS / MY AUDIT</p>
          <h1 className="page-title">MY AUDIT</h1>
        </div>
      </div>

      <div style={{ fontSize: '10px', fontFamily: 'monospace', color: 'var(--text-dim)', letterSpacing: '0.15em', marginBottom: '16px' }}>
        MY AUTHORIZED ACTIONS — SHOWING ONLY ACTIONS PERFORMED BY YOUR ACCOUNT
      </div>

      <div className="audit-page__layout">
        {/* Sidebar Filters */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="security-panel">
            <h3 className="security-panel__title" style={{ marginBottom: '16px' }}>FILTERS</h3>
            <input
              type="text"
              id="my-audit-search"
              placeholder="Search my actions, target, case..."
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
                fontSize: '12px',
                boxSizing: 'border-box',
              }}
            />
            <div style={{ marginTop: '12px' }}>
              <InvictusSelect
                value={actionFilter}
                onChange={val => setActionFilter(val)}
                options={ACTION_OPTIONS}
              />
            </div>
          </div>

          {/* Summary */}
          {!isLoading && !error && (
            <div className="security-panel" style={{ fontSize: '11px', fontFamily: 'monospace' }}>
              <div style={{ color: 'var(--text-secondary)', letterSpacing: '0.1em', marginBottom: '8px' }}>MY ACTIVITY</div>
              <div style={{ color: 'var(--text-primary)', fontSize: '24px', fontWeight: 700 }}>{events.length}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '10px', letterSpacing: '0.1em' }}>TOTAL ACTIONS RECORDED</div>
            </div>
          )}
        </aside>

        {/* Main content */}
        <main>
          {isLoading ? (
            <div className="intelligence-loading">LOADING MY AUDIT...</div>
          ) : error ? (
            <div className="audit-empty-state error" style={{ padding: '40px', textAlign: 'center', color: '#ff6b6b' }}>
              <h3>AUDIT ACCESS NOT AUTHORIZED</h3>
              <p>{error}</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="audit-empty-state" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <h3>{searchTerm || actionFilter ? 'NO MATCHING ACTIONS' : 'NO AUDIT ACTIVITY YET'}</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
                {searchTerm || actionFilter
                  ? 'No actions match the current filter.'
                  : 'No actions recorded for your account.'}
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {filtered.map((event, idx) => (
                <AuditEventRow key={event.id} event={event} index={idx} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
