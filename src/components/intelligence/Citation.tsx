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
      <div className="intel-citation__id">[{index + 1}]</div>
      <div className="intel-citation__content">
        <div className="intel-citation__doc">{citation.documentName}</div>
        <div className="intel-citation__meta">
          <span>v{citation.version}</span>
          <span>•</span>
          <span>PAGE {citation.page}</span>
          <span>•</span>
          <span>LINES {citation.startLine}–{citation.endLine}</span>
        </div>
      </div>
    </div>
  );
}
