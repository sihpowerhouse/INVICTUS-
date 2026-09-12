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
          <h3 className="intel-preview__title">SOURCE RESTRICTED</h3>
        </div>
        <div className="intel-preview__content">
          <p className="intel-error-text">ACCESS REQUIRED</p>
          <p className="intel-helper-text">Authorization level insufficient to inspect this source.</p>
        </div>
      </div>
    );
  }

  let targetId = result.id;
  if (result.id === 'RES-001') targetId = 'DOC-26190-001';
  if (result.id === 'RES-002') targetId = 'DOC-26190-002';
  if (result.id === 'RES-003') targetId = 'MEDIA-26190-002';

  const handleOpenSource = () => {
    if (result.sourceType === 'DOCUMENT') {
      navigate(`/documents/${targetId}`);
    } else if (result.sourceType === 'MEDIA') {
      navigate(`/media/${targetId}`);
    } else if (result.sourceType === 'CASE') {
      navigate(`/cases/${result.caseId}`);
    }
  };

  return (
    <div className="intel-preview">
      <div className="intel-preview__header">
        <h3 className="intel-preview__title">SOURCE INSPECTION</h3>
      </div>
      
      <div className="intel-preview__content">
        <div className="intel-preview__meta-grid">
          <div className="intel-preview__meta-item">
            <span className="intel-label">IDENTITY</span>
            <span className="intel-value" style={{fontFamily: 'monospace', color: 'var(--accent)'}}>{result.id}</span>
          </div>
          
          <div className="intel-preview__meta-item">
            <span className="intel-label">TITLE</span>
            <span className="intel-value">{result.title}</span>
          </div>

          <div className="intel-preview__meta-item">
            <span className="intel-label">CASE CONTEXT</span>
            <span className="intel-value">{result.caseId}</span>
          </div>
          
          <div className="intel-preview__meta-item">
            <span className="intel-label">VERSION / STATE</span>
            <span className="intel-value">LATEST / {result.status}</span>
          </div>
          
          {result.page && (
            <div className="intel-preview__meta-item">
              <span className="intel-label">EXACT PAGE</span>
              <span className="intel-value">{result.page}</span>
            </div>
          )}
          
          {result.lines && (
            <div className="intel-preview__meta-item">
              <span className="intel-label">LOCATION (LINES)</span>
              <span className="intel-value">{result.lines}</span>
            </div>
          )}
        </div>
        
        <div className="intel-preview__excerpt-container">
          <span className="intel-label">RELEVANT EXCERPT</span>
          <div className="intel-preview__excerpt-text">
            {result.excerpt}
          </div>
        </div>

        <div className="intel-preview__related-evidence">
          <span className="intel-label" style={{ marginTop: '24px', display: 'block' }}>RELATED EVIDENCE</span>
          <div style={{ fontFamily: 'monospace', fontSize: '11px', color: 'var(--text-secondary)', marginTop: '8px' }}>
            EVI-{result.caseId.split('-')[1]}-001<br/>
            EVI-{result.caseId.split('-')[1]}-004
          </div>
        </div>
      </div>
      
      <div className="intel-preview__actions">
        <button className="intel-btn-outline" onClick={handleOpenSource} style={{ width: '100%', borderColor: 'var(--accent)', color: 'var(--accent)', marginBottom: '8px' }}>
          [ OPEN {result.sourceType} DETAIL ]
        </button>
        <button className="intel-btn-outline" onClick={() => navigate(`/integrity?targetId=${targetId}`)} style={{ width: '100%' }}>
          [ VERIFY SOURCE INTEGRITY ]
        </button>
      </div>
    </div>
  );
}
