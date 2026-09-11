import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './DocumentDetailsPage.css';
import type { Document } from '../types/document';
import { documentService } from '../services/documentService';
import DocumentPreview from '../components/documents/DocumentPreview';
import MetadataPanel from '../components/documents/MetadataPanel';
import OCRVerification from '../components/documents/OCRVerification';
import VersionHistory from '../components/documents/VersionHistory';

export default function DocumentDetailsPage() {
  const { documentId } = useParams<{ documentId: string }>();
  const navigate = useNavigate();
  const [document, setDocument] = useState<Document | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!documentId) return;

    let mounted = true;
    documentService.getDocumentById(documentId).then(data => {
      if (mounted) {
        setDocument(data || null);
        setIsLoading(false);
      }
    });

    return () => { mounted = false; };
  }, [documentId]);

  if (isLoading) {
    return <div className="cases-page__loading">LOADING SECURE DOCUMENT...</div>;
  }

  if (!document) {
    return (
      <div className="doc-details-page">
        <div className="cases-page__empty">
          <h3>DOCUMENT NOT FOUND</h3>
          <button className="btn-primary" onClick={() => navigate('/documents')} style={{ marginTop: '16px' }}>
            RETURN TO REGISTRY
          </button>
        </div>
      </div>
    );
  }

  const statusClass = `doc-badge--status-${document.status.toLowerCase()}`;

  return (
    <div className="doc-details-page">
      <div className="doc-details-header">
        <div className="doc-details-title-area">
          <p className="page-tag" style={{ cursor: 'pointer' }} onClick={() => navigate('/documents')}>
            &larr; BACK TO REGISTRY
          </p>
          <h1 className="doc-details-title">{document.name}</h1>
          <div className="doc-details-badges">
            <span className="doc-badge doc-badge--case">{document.caseId}</span>
            <span className="doc-badge doc-badge--type">{document.type.replace('_', ' ')}</span>
            <span className={`doc-badge ${statusClass}`}>{document.status.replace('_', ' ')}</span>
          </div>
        </div>
        <div className="doc-details-actions">
          <button className="btn-primary">DOWNLOAD SECURE COPY</button>
        </div>
      </div>

      <div className="doc-details-meta-strip">
        <div className="doc-meta-group">
          <span className="doc-meta-label">VERSION</span>
          <span className="doc-meta-value">{document.version}</span>
        </div>
        <div className="doc-meta-group">
          <span className="doc-meta-label">LANGUAGE</span>
          <span className="doc-meta-value">{document.language}</span>
        </div>
        <div className="doc-meta-group">
          <span className="doc-meta-label">PAGES</span>
          <span className="doc-meta-value">{document.pages}</span>
        </div>
        <div className="doc-meta-group">
          <span className="doc-meta-label">UPLOADED BY</span>
          <span className="doc-meta-value">{document.uploadedBy} ({document.department})</span>
        </div>
        <div className="doc-meta-group">
          <span className="doc-meta-label">UPDATED</span>
          <span className="doc-meta-value">{new Date(document.updatedAt).toLocaleString()}</span>
        </div>
      </div>

      <div className="doc-details-layout">
        <div className="doc-details-left">
          <DocumentPreview document={document} />
        </div>
        <div className="doc-details-right">
          <MetadataPanel document={document} />
          <OCRVerification document={document} />
          <VersionHistory document={document} />
        </div>
      </div>
    </div>
  );
}
