import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './CaseDetailsPage.css';
import type { Case } from '../types/case';
import { caseService } from '../services/caseService';
import CaseStatusBadge from '../components/cases/CaseStatusBadge';
import PersonsPanel from '../components/cases/PersonsPanel';
import LocationsPanel from '../components/cases/LocationsPanel';
import KeyDocuments from '../components/cases/KeyDocuments';
import CaseTimeline from '../components/cases/CaseTimeline';

export default function CaseDetailsPage() {
  const { caseId } = useParams<{ caseId: string }>();
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!caseId) return;
    let mounted = true;
    
    caseService.getCaseById(caseId).then(data => {
      if (mounted) {
        setCaseData(data);
        setIsLoading(false);
      }
    });

    return () => { mounted = false; };
  }, [caseId]);

  if (isLoading) {
    return <div className="case-details-page"><div className="case-not-found" style={{color: 'var(--text-muted)'}}>LOADING CASE INTELLIGENCE...</div></div>;
  }

  if (!caseData) {
    return (
      <div className="case-details-page">
        <div className="case-not-found">
          <p>CASE NOT FOUND</p>
          <Link to="/cases" style={{ color: 'var(--accent)', textDecoration: 'none', display: 'block', marginTop: '16px' }}>RETURN TO REGISTRY</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="case-details-page">
      <div className="case-details__header">
        <div className="case-details__id">{caseData.id}</div>
        <h1 className="case-details__title">{caseData.title}</h1>
        <div className="case-details__badges">
          <CaseStatusBadge type="status" value={caseData.status} />
          <CaseStatusBadge type="priority" value={caseData.priority} />
        </div>
        <div className="case-details__dept">{caseData.department} &bull; OFFICER: {caseData.officer}</div>
      </div>

      <div className="case-details__stats">
        <div className="case-stat-box">
          <span className="case-stat-label">DOCUMENTS</span>
          <span className="case-stat-value">{caseData.documentsCount}</span>
        </div>
        <div className="case-stat-box">
          <span className="case-stat-label">EVIDENCE</span>
          <span className="case-stat-value">{caseData.evidenceCount}</span>
        </div>
        <div className="case-stat-box">
          <span className="case-stat-label">PERSONS</span>
          <span className="case-stat-value">{caseData.personsCount}</span>
        </div>
        <div className="case-stat-box">
          <span className="case-stat-label">LOCATIONS</span>
          <span className="case-stat-value">{caseData.locationsCount}</span>
        </div>
      </div>

      <div className="case-details__content">
        <div className="case-details__main">
          <div className="case-summary">
            <h3>CASE SUMMARY</h3>
            <p style={{ margin: 0 }}>{caseData.description}</p>
          </div>

          <PersonsPanel persons={caseData.persons} />
          <LocationsPanel locations={caseData.locations} />
          <KeyDocuments documents={caseData.documents} />
        </div>

        <div className="case-details__sidebar">
          <div className="data-panel">
            <div className="data-panel-header">
              <h3 className="data-panel-title">TIMELINE</h3>
            </div>
            <div className="data-panel-content" style={{ padding: '0 24px' }}>
              <CaseTimeline events={caseData.timeline} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
