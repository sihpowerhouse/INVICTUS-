import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './IntegrityPage.css';
import { securityService } from '../services/securityService';
import type { IntegritySummary, SecurityEvent as ISecurityEvent } from '../types/security';
import IntegrityStatus from '../components/security/IntegrityStatus';
import SecurityEvent from '../components/security/SecurityEvent';

export default function IntegrityPage() {
  const [summary, setSummary] = useState<IntegritySummary | null>(null);
  const [events, setEvents] = useState<ISecurityEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      securityService.getIntegritySummary(),
      securityService.getSecurityEvents()
    ]).then(([sumData, evData]) => {
      if (mounted) {
        setSummary(sumData);
        setEvents(evData);
        setIsLoading(false);
      }
    });
    return () => { mounted = false; };
  }, []);

  return (
    <div className="integrity-page">
      <div className="integrity-page__header">
        <p className="page-tag">INVICTUS / SECURITY</p>
        <h1 className="page-title">INTEGRITY CENTER</h1>
      </div>

      {isLoading || !summary ? (
        <div className="intelligence-loading">LOADING SECURITY HEALTH...</div>
      ) : (
        <div className="integrity-page__layout">
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="integrity-summary-cards">
              <div className="integrity-summary-card">
                <span className="integrity-summary-card__label">DOCUMENTS VERIFIED</span>
                <span className="integrity-summary-card__value" style={{ color: '#00e676' }}>{summary.verifiedCount}</span>
              </div>
              <div className="integrity-summary-card">
                <span className="integrity-summary-card__label">VERSION CHAINS</span>
                <span className="integrity-summary-card__value">{summary.totalVersionChains}</span>
              </div>
              <div className="integrity-summary-card">
                <span className="integrity-summary-card__label">SIGNATURES</span>
                <span className="integrity-summary-card__value">{summary.totalSignatures}</span>
              </div>
              <div className="integrity-summary-card">
                <span className="integrity-summary-card__label">AUDIT EVENTS</span>
                <span className="integrity-summary-card__value">{summary.totalAuditEvents}</span>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <div className="security-panel__header">
                <h3 className="security-panel__title">RECENT INTEGRITY CHECKS</h3>
              </div>
              <div className="integrity-recent-list">
                {summary.recentDocuments.map(doc => (
                  <Link to={`/integrity/${doc.documentId}`} key={doc.documentId} className="integrity-recent-item">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontFamily: 'monospace', fontSize: '14px', color: 'var(--accent)' }}>{doc.documentId}</span>
                      <span style={{ fontFamily: 'Georgia, serif', fontSize: '14px', color: 'var(--text-primary)' }}>{doc.documentName}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                      <div className="security-value-group" style={{ textAlign: 'right' }}>
                        <span className="security-label">CASE</span>
                        <span className="security-value">{doc.caseId}</span>
                      </div>
                      <IntegrityStatus status={doc.status} />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="security-panel__header">
              <h3 className="security-panel__title">SECURITY EVENTS</h3>
            </div>
            <div className="integrity-events-list">
              {events.map(event => (
                <SecurityEvent key={event.id} event={event} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
