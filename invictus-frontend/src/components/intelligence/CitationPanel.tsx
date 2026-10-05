import './Intelligence.css';
import type { Citation as ICitation } from '../../types/intelligence';

interface CitationPanelProps {
  citation: ICitation | null;
  onViewSource?: (versionId: string) => void;
}

export default function CitationPanel({ citation, onViewSource }: CitationPanelProps) {
  if (!citation) {
    return (
      <div className="intel-panel-shell intel-panel-shell--empty">
        <span className="intel-empty-state">SELECT A CITATION TO VIEW SOURCE</span>
      </div>
    );
  }

  const handleOpenSource = () => {
    if (onViewSource && citation.versionId) {
      onViewSource(citation.versionId);
    }
  };

  const hasViewableSource = !!citation.versionId;

  return (
    <div className="intel-panel-shell">
      <div className="intel-panel__header">
        <h3 className="intel-panel__title">CITATION SOURCE</h3>
      </div>
      
      <div className="intel-panel__meta-group">
        <span className="intel-label">DOCUMENT {citation.documentName ? 'NAME' : 'ID'}</span>
        <span className="intel-value">{citation.documentName || citation.documentId}</span>
      </div>
      
      <div className="intel-panel__grid">
        {citation.versionId && (
          <div>
            <span className="intel-label">VERSION ID</span>
            <span className="intel-value" style={{fontFamily: 'monospace'}}>{citation.versionId.substring(0, 8)}...</span>
          </div>
        )}
        {citation.version !== undefined && (
          <div>
            <span className="intel-label">VERSION</span>
            <span className="intel-value" style={{fontFamily: 'monospace'}}>{citation.version}</span>
          </div>
        )}
        {citation.page !== undefined && (
          <div>
            <span className="intel-label">PAGE</span>
            <span className="intel-value" style={{fontFamily: 'monospace'}}>{citation.page}</span>
          </div>
        )}
        {citation.chunkIndex !== undefined && (
          <div>
            <span className="intel-label">CHUNK</span>
            <span className="intel-value" style={{fontFamily: 'monospace'}}>{citation.chunkIndex}</span>
          </div>
        )}
        {(citation.startLine !== undefined || citation.endLine !== undefined) && (
          <div>
            <span className="intel-label">LINES</span>
            <span className="intel-value" style={{fontFamily: 'monospace'}}>
              {citation.startLine || '?'}–{citation.endLine || '?'}
            </span>
          </div>
        )}
      </div>
      
      {citation.excerpt && (
        <div className="intel-panel__excerpt-box">
          <span className="intel-label">SOURCE EXCERPT</span>
          <div className="intel-panel__excerpt">
            {citation.excerpt}
          </div>
        </div>
      )}
      
      <div className="intel-panel__actions">
        {hasViewableSource ? (
          <button className="intel-btn-outline" onClick={handleOpenSource} style={{ width: '100%', borderColor: 'var(--accent)', color: 'var(--accent)' }}>
            [ VIEW IN DOCUMENT ]
          </button>
        ) : (
          <div className="intel-value" style={{ color: 'var(--foreground-muted)', textAlign: 'center', marginTop: '1rem', fontSize: '0.8rem' }}>
            [ INFORMATIONAL ONLY ]
          </div>
        )}
      </div>
    </div>
  );
}

