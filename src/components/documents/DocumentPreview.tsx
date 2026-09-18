import { useState, useEffect } from 'react';
import './DocumentPreview.css';
import type { Document } from '../../types/document';
import { documentService } from '../../services/documentService';

interface DocumentPreviewProps {
  document: Document;
  versionId: string;
}

export default function DocumentPreview({ document: doc, versionId }: DocumentPreviewProps) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    setIsError(false);
    
    if (!versionId) {
      return;
    }
    
    documentService.getDocumentPreviewBlob(versionId).then(blob => {
      if (!mounted) return;
      if (blob.size === 0) {
        setIsError(true);
        setIsLoading(false);
        return;
      }
      
      const url = URL.createObjectURL(blob);
      setBlobUrl(url);
      setIsLoading(false);
    }).catch(err => {
      console.error('Failed to load document preview', err);
      if (mounted) {
        setIsError(true);
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [versionId]);

  return (
    <div className="doc-preview-container">
      <div className="doc-preview-header">
        <span className="doc-preview-title">{doc.name} • PAGE 1 OF {doc.pages}</span>
        <div className="doc-preview-actions">
          <button className="btn-icon">ZOOM IN</button>
          <button className="btn-icon">ZOOM OUT</button>
          <button className="btn-icon" onClick={() => blobUrl && window.open(blobUrl, '_blank')}>DOWNLOAD</button>
        </div>
      </div>
      <div className="doc-preview-content">
        {isLoading ? (
          <div className="doc-placeholder-page">
            <div style={{ color: 'var(--accent)', fontFamily: 'monospace' }}>LOADING SECURE PREVIEW...</div>
          </div>
        ) : isError || !blobUrl ? (
          <div className="doc-placeholder-page">
            <div className="placeholder-line short" />
            <div className="placeholder-line long" />
            <div className="placeholder-line long" />
            <div className="placeholder-line medium" />
            
            <div style={{ height: '32px' }} />
            
            <div className="placeholder-line long" />
            <div className="placeholder-line long" />
            <div className="placeholder-line short" />
          </div>
        ) : (
          <iframe 
            src={`${blobUrl}#toolbar=0`} 
            style={{ width: '100%', height: '100%', border: 'none' }}
            title="Secure Document Preview"
          />
        )}
        <div className="doc-watermark">INVICTUS SECURE VIEW</div>
      </div>
    </div>
  );
}
