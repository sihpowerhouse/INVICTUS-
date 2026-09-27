import { useState, useEffect } from 'react';
import './DocumentPreview.css';
import type { Document } from '../../types/document';
import { documentService } from '../../services/documentService';

interface DocumentPreviewProps {
  document: Document;
  versionId: string;
  page?: number;
  onPageChange?: (page: number) => void;
}

export default function DocumentPreview({ document: doc, versionId, page = 1, onPageChange }: DocumentPreviewProps) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState<number>(doc.pages || 1);
  const [currentPage, setCurrentPage] = useState<number>(page);

  useEffect(() => {
    setCurrentPage(page);
  }, [page]);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    setIsError(false);
    
    if (!versionId) {
      setIsLoading(false);
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

      // Try to determine page count from blob/PDF metadata.
      // If doc.pages is authoritative (set from backend), use it.
      if (doc.pages && doc.pages > 1) {
        setTotalPages(doc.pages);
      }
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

  const handlePrev = () => {
    const next = Math.max(1, currentPage - 1);
    setCurrentPage(next);
    onPageChange?.(next);
  };

  const handleNext = () => {
    const next = Math.min(totalPages, currentPage + 1);
    setCurrentPage(next);
    onPageChange?.(next);
  };

  return (
    <div className="doc-preview-container">
      <div className="doc-preview-header">
        <span className="doc-preview-title">{doc.name}</span>
        <div className="doc-preview-page-nav">
          <button 
            className="btn-icon" 
            onClick={handlePrev}
            disabled={currentPage <= 1}
            aria-label="Previous page"
          >
            ◀ PREV
          </button>
          <span className="doc-preview-page-indicator">
            PAGE {currentPage} {totalPages > 1 ? `OF ${totalPages}` : ''}
          </span>
          <button 
            className="btn-icon"
            onClick={handleNext}
            disabled={currentPage >= totalPages}
            aria-label="Next page"
          >
            NEXT ▶
          </button>
        </div>
        <div className="doc-preview-actions">
          <button className="btn-icon" onClick={() => blobUrl && window.open(blobUrl, '_blank')}>OPEN</button>
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
            src={`${blobUrl}#page=${currentPage}&toolbar=0`} 
            style={{ width: '100%', height: '100%', border: 'none' }}
            title="Secure Document Preview"
          />
        )}
        <div className="doc-watermark">INVICTUS SECURE VIEW</div>
      </div>
    </div>
  );
}
