import { useNavigate } from 'react-router-dom';
import './Intelligence.css';
import type { Citation as ICitation } from '../../types/intelligence';

interface CitationPanelProps {
  citation: ICitation | null;
}

export default function CitationPanel({ citation }: CitationPanelProps) {
  const navigate = useNavigate();

  if (!citation) {
    return (
      <div className="intel-panel-shell intel-panel-shell--empty">
        <span className="intel-empty-state">SELECT A CITATION TO VIEW SOURCE</span>
      </div>
    );
  }

  const handleOpenSource = () => {
    // Navigate to the document route, conceptually passing the target line
    navigate(`/documents/${citation.documentId}`);
  };

  return (
    <div className="intel-panel-shell">
      <div className="intel-panel__header">
        <h3 className="intel-panel__title">SOURCE</h3>
      </div>
      
      <div className="intel-panel__meta-group">
        <span className="intel-label">DOCUMENT</span>
        <span className="intel-value" style={{fontFamily: 'monospace'}}>{citation.documentName}</span>
      </div>
      
      <div className="intel-panel__grid">
        <div>
          <span className="intel-label">VERSION</span>
          <span className="intel-value">{citation.version}</span>
        </div>
        <div>
          <span className="intel-label">PAGE</span>
          <span className="intel-value">{citation.page}</span>
        </div>
        <div>
          <span className="intel-label">LINES</span>
          <span className="intel-value">{citation.startLine}–{citation.endLine}</span>
        </div>
      </div>
      
      <div className="intel-panel__excerpt-box">
        <span className="intel-label">EXCERPT</span>
        <div className="intel-panel__excerpt">
          "{citation.excerpt}"
        </div>
      </div>
      
      <div className="intel-panel__actions">
        <button className="btn-primary" onClick={handleOpenSource}>
          [ OPEN DOCUMENT ]
        </button>
      </div>
    </div>
  );
}
