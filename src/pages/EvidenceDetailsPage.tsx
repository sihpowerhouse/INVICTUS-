import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './EvidenceDetailsPage.css';
import type { Evidence } from '../types/evidence';
import { evidenceService } from '../services/evidenceService';

import CustodyStatus from '../components/evidence/CustodyStatus';
import ChainOfCustody from '../components/evidence/ChainOfCustody';
import EvidenceActivity from '../components/evidence/EvidenceActivity';
import { RelatedDocuments, RelatedMedia } from '../components/evidence/RelatedPanels';
import EvidenceIntegritySummary from '../components/evidence/EvidenceIntegritySummary';

export default function EvidenceDetailsPage() {
  const { evidenceId } = useParams<{ evidenceId: string }>();
  const navigate = useNavigate();
  const [evidence, setEvidence] = useState<Evidence | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!evidenceId) return;

    let mounted = true;
    evidenceService.getEvidenceById(evidenceId).then(data => {
      if (mounted) {
        setEvidence(data || null);
        setIsLoading(false);
      }
    });

    return () => { mounted = false; };
  }, [evidenceId]);

  if (isLoading) {
    return <div className="evidence-page__loading">LOADING SECURE EVIDENCE RECORD...</div>;
  }

  if (!evidence) {
    return (
      <div className="evd-details-page">
        <div className="evd-not-found">
          <h3 style={{ color: 'var(--text-muted)' }}>EVIDENCE NOT FOUND</h3>
          <button className="btn-primary" onClick={() => navigate('/evidence')} style={{ marginTop: '16px' }}>
            RETURN TO VAULT
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="evd-details-page">
      <div className="evd-details-header">
        <div className="evd-details-title-area">
          <p className="page-tag" style={{ cursor: 'pointer' }} onClick={() => navigate('/evidence')}>
            &larr; BACK TO EVIDENCE VAULT
          </p>
          <h1 className="evd-details-title">{evidence.title}</h1>
          <div className="evd-details-badges">
            <span className="evd-details-badge">{evidence.id}</span>
            <span 
              className="evd-details-badge evd-details-badge--case"
              onClick={() => navigate(`/cases/${evidence.caseId}`)}
              role="link"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && navigate(`/cases/${evidence.caseId}`)}
            >
              {evidence.caseId} ↗
            </span>
            <span className="evd-details-badge">{evidence.type.replace(/_/g, ' ')}</span>
            <span className={`evd-badge evd-badge--status-${evidence.status.toLowerCase()}`}>
              {evidence.status.replace(/_/g, ' ')}
            </span>
          </div>
        </div>
        <div>
          <button className="btn-primary">UPDATE CUSTODY</button>
        </div>
      </div>

      <div className="evd-details-meta-strip">
        <div className="evd-meta-group">
          <span className="evd-meta-label">CUSTODY EVENTS</span>
          <span className="evd-meta-value">{evidence.custodyEvents.length}</span>
        </div>
        <div className="evd-meta-group">
          <span className="evd-meta-label">DOCUMENT LINKS</span>
          <span className="evd-meta-value">{evidence.relatedDocumentIds.length}</span>
        </div>
        <div className="evd-meta-group">
          <span className="evd-meta-label">MEDIA LINKS</span>
          <span className="evd-meta-value">{evidence.relatedMediaIds.length}</span>
        </div>
        <div className="evd-meta-group">
          <span className="evd-meta-label">CURRENT HOLDER</span>
          <span className="evd-meta-value">{evidence.currentHolder}</span>
        </div>
        <div className="evd-meta-group" style={{ flex: 1, minWidth: '200px' }}>
          <span className="evd-meta-label">DESCRIPTION</span>
          <span className="evd-meta-value" style={{ fontSize: '12px' }}>{evidence.description}</span>
        </div>
      </div>

      <div className="evd-details-layout">
        <div className="evd-details-left">
          <ChainOfCustody events={evidence.custodyEvents} />
          <EvidenceActivity events={evidence.activityEvents} />
        </div>
        
        <div className="evd-details-right">
          <CustodyStatus evidence={evidence} />
          <RelatedDocuments documentIds={evidence.relatedDocumentIds} />
          <RelatedMedia mediaIds={evidence.relatedMediaIds} />
          <EvidenceIntegritySummary integrity={evidence.integrity} />
        </div>
      </div>
    </div>
  );
}
