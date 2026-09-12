import './Intelligence.css';
import type { Citation as ICitation } from '../../types/intelligence';

interface CitationProps {
  citation: ICitation;
  index: number;
  isSelected?: boolean;
  onClick: () => void;
}

export default function Citation({ citation, index, isSelected, onClick }: CitationProps) {
  return (
    <div 
      className={`intel-citation ${isSelected ? 'intel-citation--selected' : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
    >
      <div className="intel-citation__index">
        REF {String(index + 1).padStart(2, '0')}
      </div>
      <div className="intel-citation__content">
        <div className="intel-citation__header">
          <span className="intel-citation__label">SOURCE</span>
          <span className="intel-citation__doc">{citation.documentId} / v{citation.version}</span>
        </div>
        <div className="intel-citation__meta">
          <div className="intel-citation__meta-col">
            <span className="intel-citation__label">PAGE</span>
            <span className="intel-citation__value">{String(citation.page).padStart(2, '0')}</span>
          </div>
          <div className="intel-citation__meta-col">
            <span className="intel-citation__label">LINES</span>
            <span className="intel-citation__value">{String(citation.startLine).padStart(3, '0')}–{String(citation.endLine).padStart(3, '0')}</span>
          </div>
        </div>
        <div className="intel-citation__excerpt">
          {citation.excerpt}
        </div>
      </div>
    </div>
  );
}
