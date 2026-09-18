import { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { X } from 'lucide-react';
import type { Document } from '../../types/document';
import type { DocumentPermission } from '../../types/access';
import { documentService } from '../../services/documentService';
import DocumentPreview from './DocumentPreview';
import DocumentIntelligencePanel from './DocumentIntelligencePanel';
import MetadataPanel from './MetadataPanel';
import OCRVerification from './OCRVerification';
import VersionHistory from './VersionHistory';
import DocumentActivityTimeline from './DocumentActivityTimeline';

import './DocumentViewerOverlay.css';
import '../../pages/DocumentDetailsPage.css'; // Reuse badge styles

interface DocumentViewerOverlayProps {
  documentId: string;
  onClose: () => void;
  permission?: DocumentPermission | 'FULL'; // Assume FULL if internal
}

type TabType = 'PREVIEW' | 'OCR' | 'METADATA' | 'TIMELINE';

export default function DocumentViewerOverlay({ documentId, onClose, permission = 'FULL' }: DocumentViewerOverlayProps) {
  const [document, setDocument] = useState<Document | null>(null);
  const [selectedVersionId, setSelectedVersionId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<TabType>('PREVIEW');
  const [isLoading, setIsLoading] = useState(true);
  const shouldReduceMotion = useReducedMotion();
  const { user } = useAuth();

  useEffect(() => {
    let mounted = true;

    documentService.getDocumentById(documentId).then(docData => {
      if (mounted) {
        setDocument(docData || null);
        if (docData?.versionId) {
          setSelectedVersionId(docData.versionId);
        }
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
    };
  }, [documentId]);

  const getVersionNumber = (vId: string) => {
    if (!document) return '';
    const v = document.versions?.find(ver => ver.id === vId);
    return v ? `v${v.version_number}` : '';
  };

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
          <button className="btn-secondary" onClick={onClose}>BACK TO DOCUMENTS</button>
        </div>
      </div>
    );
  }

  const vNum = getVersionNumber(selectedVersionId);
  const statusClass = `doc-badge--status-${document.status.toLowerCase()}`;

  return (
    <motion.div 
      className="doc-viewer-overlay"
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="doc-viewer-body" style={{ flex: 1, display: 'flex', gap: '24px', overflow: 'hidden' }}>
        <div className="doc-viewer-left" style={{ flex: 6, display: 'flex', flexDirection: 'column' }}>
          
          <div className="doc-viewer-header" style={{ padding: '0 0 16px 0', borderBottom: 'none' }}>
            <div className="doc-viewer-breadcrumb">Documents &gt; Document Details</div>
            
            <div className="doc-viewer-title-area" style={{ justifyContent: 'space-between', display: 'flex', alignItems: 'center' }}>
              <div className="doc-viewer-title-row" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <h2 className="doc-viewer-title" style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>{document.name}</h2>
                <span className={`doc-badge ${statusClass}`}>{vNum}</span>
              </div>
              <div className="doc-viewer-actions" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                {permission !== 'READ ONLY' && (
                  <button className="btn-primary" style={{ fontSize: '10px', padding: '6px 12px' }}>DOWNLOAD SECURE COPY</button>
                )}
                <button className="btn-close-viewer" onClick={onClose} aria-label="Close Viewer">
                  <X size={16} />
                </button>
              </div>
            </div>
            
            <div className="doc-viewer-id" style={{ marginTop: '-4px', fontSize: '12px', fontFamily: 'monospace', color: 'var(--accent)' }}>
              Case ID: {document.caseId} | Document ID: {document.id}
            </div>

            <div className="doc-viewer-tabs">
              <button className={`doc-viewer-tab ${activeTab === 'PREVIEW' ? 'active' : ''}`} onClick={() => setActiveTab('PREVIEW')}>PREVIEW</button>
              <button className={`doc-viewer-tab ${activeTab === 'OCR' ? 'active' : ''}`} onClick={() => setActiveTab('OCR')}>OCR / EXTRACTED TEXT</button>
              <button className={`doc-viewer-tab ${activeTab === 'METADATA' ? 'active' : ''}`} onClick={() => setActiveTab('METADATA')}>METADATA</button>
              <button className={`doc-viewer-tab ${activeTab === 'TIMELINE' ? 'active' : ''}`} onClick={() => setActiveTab('TIMELINE')}>TIMELINE</button>
            </div>
          </div>

          <motion.div variants={contentVariants} style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            {activeTab === 'PREVIEW' && (
              <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border)', borderRadius: '4px' }}>
                <DocumentPreview document={document} versionId={selectedVersionId} />
                <div className="doc-watermark-overlay">
                  <div className="doc-watermark-content">
                    AUTHORIZED VIEWER<br/>
                    {user?.email}<br/><br/>
                    CASE:<br/>
                    {document.caseId}
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'OCR' && (
              <div style={{ flex: 1, overflowY: 'auto', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border)', borderRadius: '4px', padding: '24px' }}>
                <h3 style={{ fontSize: '12px', color: 'var(--accent)', letterSpacing: '0.1em', marginBottom: '16px' }}>EXTRACTED TEXT</h3>
                <OCRVerification versionId={selectedVersionId} documentType={document.type} documentStatus={document.status} />
              </div>
            )}

            {activeTab === 'METADATA' && (
              <div style={{ flex: 1, overflowY: 'auto', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border)', borderRadius: '4px', padding: '24px' }}>
                <MetadataPanel document={document} />
              </div>
            )}

            {activeTab === 'TIMELINE' && (
              <div style={{ flex: 1, overflowY: 'auto', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border)', borderRadius: '4px', padding: '24px' }}>
                <h3 style={{ fontSize: '12px', color: 'var(--accent)', letterSpacing: '0.1em', marginBottom: '16px' }}>DOCUMENT ACTIVITY</h3>
                <DocumentActivityTimeline
                  versions={document.versions || []}
                  selectedVersionId={selectedVersionId}
                  onVersionSelect={setSelectedVersionId}
                />
              </div>
            )}
          </motion.div>
        </div>

        <div className="doc-viewer-right" style={{ flex: 4, display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto', paddingRight: '8px' }}>
          <VersionHistory 
            versions={document.versions || []} 
            documentStatus={document.status} 
            selectedVersionId={selectedVersionId}
            onSelectVersion={setSelectedVersionId}
          />
          <DocumentActivityTimeline
            versions={document.versions || []}
            selectedVersionId={selectedVersionId}
            onVersionSelect={setSelectedVersionId}
          />
          <DocumentIntelligencePanel 
            versionId={selectedVersionId} 
            documentType={document.type} 
            onCitationClick={setSelectedVersionId}
          />
          <OCRVerification 
            versionId={selectedVersionId} 
            documentType={document.type}
            documentStatus={document.status}
          />
        </div>
      </div>
    </motion.div>
  );
}
