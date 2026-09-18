import { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { X } from 'lucide-react';
import type { Document } from '../../types/document';
import type { DocumentPermission } from '../../types/access';
import { documentService } from '../../services/documentService';
import DocumentPreview from './DocumentPreview';
import MetadataPanel from './MetadataPanel';
import OCRVerification from './OCRVerification';
import VersionHistory from './VersionHistory';

import './DocumentViewerOverlay.css';
import '../../pages/DocumentDetailsPage.css'; // Reuse badge styles

interface DocumentViewerOverlayProps {
  documentId: string;
  onClose: () => void;
  permission?: DocumentPermission | 'FULL'; // Assume FULL if internal
}

export default function DocumentViewerOverlay({ documentId, onClose, permission = 'FULL' }: DocumentViewerOverlayProps) {
  const [document, setDocument] = useState<Document | null>(null);
  const [selectedVersionId, setSelectedVersionId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const shouldReduceMotion = useReducedMotion();
  const { user } = useAuth();

  useEffect(() => {
    let mounted = true;

    // Lock body scroll
    window.document.body.style.overflow = 'hidden';

    // Handle ESC key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    documentService.getDocumentById(documentId).then(docData => {
      if (mounted) {
        setDocument(docData || null);
        if (docData?.versionId) {
          setSelectedVersionId(docData.versionId);
          console.log('[DIAGNOSTICS] document_id =', docData.id);
          console.log('[DIAGNOSTICS] selected version =', docData.version);
          console.log('[DIAGNOSTICS] selected versionId =', docData.versionId);
        }
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
      window.document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [documentId, onClose]);

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.15 } }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20, scale: shouldReduceMotion ? 1 : 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: 'easeOut' as any } }
  };

  if (isLoading) {
    return (
      <div className="doc-viewer-overlay">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontFamily: 'monospace', color: 'var(--accent)', fontSize: '12px', letterSpacing: '0.2em' }}>
          LOADING FORENSIC VIEWER...
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="doc-viewer-overlay">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '16px' }}>
          <div style={{ fontFamily: 'monospace', color: '#ef4444', fontSize: '14px', letterSpacing: '0.2em' }}>DOCUMENT NOT FOUND</div>
          <button className="btn-secondary" onClick={onClose}>CLOSE VIEWER</button>
        </div>
      </div>
    );
  }

  const statusClass = `doc-badge--status-${document.status.toLowerCase()}`;

  return (
    <motion.div 
      className="doc-viewer-overlay"
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="doc-viewer-header">
        <div className="doc-viewer-title-area">
          <div className="doc-viewer-title-row">
            <span className="doc-viewer-id">{document.id.substring(0, 8)}</span>
            <h2 className="doc-viewer-title">{document.name}</h2>
          </div>
          <div className="doc-viewer-badges">
            <span className="doc-badge doc-badge--case">{document.caseId}</span>
            <span className="doc-badge doc-badge--type">{document.type.replace('_', ' ')}</span>
            <span className={`doc-badge ${statusClass}`}>{document.status.replace('_', ' ')}</span>
          </div>
        </div>
        <div className="doc-viewer-actions">
          {permission !== 'READ ONLY' && (
            <button className="btn-primary" style={{ fontSize: '10px', padding: '6px 12px' }}>DOWNLOAD SECURE COPY</button>
          )}
          <button className="btn-close-viewer" onClick={onClose} aria-label="Close Viewer">
            <X size={16} />
          </button>
        </div>
      </div>

      <motion.div className="doc-viewer-body" variants={contentVariants}>
        <div className="doc-viewer-left" style={{ position: 'relative' }}>
          <DocumentPreview document={document} versionId={selectedVersionId} />
          
          {/* Dynamic Watermark */}
          <div className="doc-watermark-overlay">
            <div className="doc-watermark-content">
              AUTHORIZED VIEWER<br/>
              {user?.email}<br/><br/>
              CASE:<br/>
              {document.caseId}
            </div>
          </div>
        </div>

        <div className="doc-viewer-right">
          <VersionHistory 
            versions={document.versions || []} 
            documentStatus={document.status} 
            selectedVersionId={selectedVersionId} 
          />
          <OCRVerification 
            versionId={selectedVersionId} 
            documentType={document.type}
            documentStatus={document.status}
          />
          <MetadataPanel document={document} />
        </div>
      </motion.div>
    </motion.div>
  );
}
