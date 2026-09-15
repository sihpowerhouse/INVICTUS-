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
import CaseWorkspaceHeader from '../components/cases/CaseWorkspaceHeader';
import CaseMembersList from '../components/cases/CaseMembersList';
import DocumentUpload from '../components/documents/DocumentUpload';
import CaseAITab from '../components/cases/CaseAITab';
import DocumentViewerOverlay from '../components/documents/DocumentViewerOverlay';
import { AnimatePresence } from 'framer-motion';

export default function CaseDetailsPage() {
  const { caseId } = useParams<{ caseId: string }>();
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [activeDocumentId, setActiveDocumentId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'FILES' | 'MEMBERS' | 'TIMELINE' | 'CASE AI'>('FILES');

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

  const handleWorkspaceAction = (action: string) => {
    if (action === 'UPLOAD') {
      setIsUploadOpen(true);
    } else if (action === 'FILES' || action === 'MEMBERS' || action === 'TIMELINE' || action === 'CASE AI') {
      setActiveTab(action as any);
    }
  };

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
        <div className="case-details__id">{caseData.firNumber || caseData.id}</div>
        <h1 className="case-details__title">{caseData.title}</h1>
        <div className="case-details__badges">
          <CaseStatusBadge type="status" value={caseData.status} />
          <CaseStatusBadge type="priority" value={caseData.priority} />
        </div>
        <div className="case-details__dept">{caseData.department} &bull; OFFICER: {caseData.officer}</div>
      </div>

      <CaseWorkspaceHeader activeTab={activeTab} onActionSelect={handleWorkspaceAction} />

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
        <div className="case-details__main" style={{ flex: 1, paddingRight: activeTab === 'TIMELINE' ? '0' : undefined }}>
          {activeTab === 'FILES' && (
            <>
              <div className="case-summary">
                <h3>CASE SUMMARY</h3>
                <p style={{ margin: 0 }}>{caseData.description}</p>
              </div>
              <PersonsPanel persons={caseData.persons} />
              <LocationsPanel locations={caseData.locations} />
              <KeyDocuments 
                documents={caseData.documents} 
                onUploadClick={() => setIsUploadOpen(true)}
                onDocumentClick={(docId) => setActiveDocumentId(docId)}
              />
            </>
          )}

          {activeTab === 'MEMBERS' && (
            <CaseMembersList caseId={caseData.id} />
          )}

          {activeTab === 'TIMELINE' && (
            <div className="data-panel" style={{ marginTop: '0' }}>
              <div className="data-panel-header">
                <h3 className="data-panel-title">TIMELINE</h3>
              </div>
              <div className="data-panel-content" style={{ padding: '0' }}>
                <CaseTimeline caseId={caseData.id} onOpenDocument={setActiveDocumentId} />
              </div>
            </div>
          )}

          {activeTab === 'CASE AI' && (
            <CaseAITab caseId={caseData.id} onOpenDocument={setActiveDocumentId} />
          )}
        </div>
      </div>
      
      {isUploadOpen && (
        <DocumentUpload 
          caseId={caseId || ''}
          onClose={() => setIsUploadOpen(false)}
          onComplete={(newDoc) => {
            setIsUploadOpen(false);
            if (newDoc && caseData) {
              setCaseData({
                ...caseData,
                documents: [...(caseData.documents || []), newDoc],
                documentsCount: (caseData.documentsCount || 0) + 1
              });
            }
          }}
        />
      )}



      <AnimatePresence>
        {activeDocumentId && (
          <DocumentViewerOverlay 
            documentId={activeDocumentId} 
            onClose={() => setActiveDocumentId(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
