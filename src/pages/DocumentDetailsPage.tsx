import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import './DocumentDetailsPage.css';
import type { Document } from '../types/document';
import { documentService } from '../services/documentService';
import DocumentPreview from '../components/documents/DocumentPreview';
import MetadataPanel from '../components/documents/MetadataPanel';
import OCRVerification from '../components/documents/OCRVerification';
import VersionHistory from '../components/documents/VersionHistory';
import RelatedEvidence from '../components/documents/RelatedEvidence';

export default function DocumentDetailsPage() {
  const { documentId } = useParams<{ documentId: string }>();
  const navigate = useNavigate();
  const [document, setDocument] = useState<Document | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const shouldReduceMotion = useReducedMotion();

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

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: shouldReduceMotion ? 0 : 0.05 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as any } }
  };

  return (
    <motion.div 
      className="doc-details-page"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div className="doc-details-header" variants={itemVariants}>
        <div className="doc-details-title-area">
          <p className="page-tag" style={{ cursor: 'pointer' }} onClick={() => navigate('/documents')}>
            &larr; BACK TO REGISTRY
          </p>
          <div className="doc-details-title-row">
            <span className="doc-id-mono-large">{document.id.substring(0, 8)}</span>
            <h1 className="doc-details-title">{document.name}</h1>
          </div>
          <div className="doc-details-badges">
            <span className="doc-badge doc-badge--case" onClick={() => navigate(`/cases/${document.caseId}`)} style={{ cursor: 'pointer' }}>
              {document.caseId}
            </span>
            <span className="doc-badge doc-badge--type">{document.type.replace('_', ' ')}</span>
            <span className={`doc-badge ${statusClass}`}>{document.status.replace('_', ' ')}</span>
          </div>
        </div>
        <div className="doc-details-actions">
          <button className="btn-primary">DOWNLOAD SECURE COPY</button>
        </div>
      </motion.div>

      <motion.div className="doc-details-meta-strip" variants={itemVariants}>
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
          <span className="doc-meta-value">{document.uploadedBy} <span className="doc-meta-dim">({document.department})</span></span>
        </div>
        <div className="doc-meta-group">
          <span className="doc-meta-label">LAST UPDATED</span>
          <span className="doc-meta-value">{new Date(document.updatedAt).toLocaleString()}</span>
        </div>
      </motion.div>

      <motion.div className="doc-details-layout" variants={itemVariants}>
        <motion.div className="doc-details-left" variants={itemVariants}>
          <DocumentPreview document={document} />
        </motion.div>
        
        <motion.div className="doc-details-right" variants={itemVariants}>
          <MetadataPanel document={document} />
          <OCRVerification document={document} />
          <VersionHistory document={document} />
          <RelatedEvidence caseId={document.caseId} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
