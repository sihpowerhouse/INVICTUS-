import { useNavigate } from 'react-router-dom';
import './Intelligence.css';
import type { SearchResult } from '../../types/intelligence';

interface SourcePreviewProps {
  result: SearchResult | null;
}

export default function SourcePreview({ result }: SourcePreviewProps) {
  const navigate = useNavigate();

  if (!result) {
    return (
      <div className="intel-preview intel-preview--empty">
        <div className="intel-empty-state">
          SELECT A RESULT TO PREVIEW SOURCE
        </div>
      </div>
    );
  }

  if (!result.isAuthorized) {
    return (
      <div className="intel-preview intel-preview--unauthorized">
        <div className="intel-preview__header">
          <h3 className="intel-preview__title">SOURCE NOT AVAILABLE</h3>
        </div>
        <div className="intel-preview__content">
          <p className="intel-error-text">This evidence cannot be shown to the current user.</p>
          <p className="intel-helper-text">Authorization level insufficient for requested asset.</p>
        </div>
      </div>
    );
  }

  const handleOpenDocument = () => {
    // Mock navigation
    if (result.sourceType === 'DOCUMENT') {
      navigate(`/documents/DOC-26190-001`);
    } else if (result.sourceType === 'MEDIA') {
      navigate(`/media/MED-26190-001`);
    }
  };

  return (
    <div className="intel-preview">
      <div className="intel-preview__header">
        <h3 className="intel-preview__title">SOURCE PREVIEW</h3>
      </div>
      
      <div className="intel-preview__content">
        <div className="intel-preview__meta-grid">
          <div className="intel-preview__meta-item">
            <span className="intel-label">SOURCE</span>
            <span className="intel-value" style={{fontFamily: 'monospace'}}>{result.title}</span>
          </div>
          
          <div className="intel-preview__meta-item">
            <span className="intel-label">VERSION</span>
            <span className="intel-value">LATEST</span>
          </div>
          
          {result.page && (
            <div className="intel-preview__meta-item">
              <span className="intel-label">PAGE</span>
              <span className="intel-value">{result.page}</span>
            </div>
          )}
          
          {result.lines && (
            <div className="intel-preview__meta-item">
              <span className="intel-label">LINES</span>
              <span className="intel-value">{result.lines}</span>
            </div>
          )}
        </div>
        
        <div className="intel-preview__excerpt-container">
          <span className="intel-label">EXCERPT</span>
          <div className="intel-preview__excerpt-text">
            {result.excerpt}
          </div>
        </div>
      </div>
      
      <div className="intel-preview__actions">
        <button className="btn-primary" onClick={handleOpenDocument}>
          [ OPEN DOCUMENT ]
        </button>
      </div>
    </div>
  );
}
