import { useNavigate } from 'react-router-dom';
import './Intelligence.css';
import type { SearchResult as ISearchResult } from '../../types/intelligence';

interface SearchResultProps {
  result: ISearchResult;
  isSelected?: boolean;
  onClick?: () => void;
}

export default function SearchResult({ result, isSelected, onClick }: SearchResultProps) {
  const navigate = useNavigate();

  const handleOpenSource = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (result.sourceType === 'DOCUMENT') {
      navigate(`/documents/${result.id.replace('RES-', 'DOC-26190-')}`); // Mock ID transform
    } else if (result.sourceType === 'MEDIA') {
      navigate(`/media/${result.id.replace('RES-', 'MED-26190-')}`);
    } else if (result.sourceType === 'CASE') {
      navigate(`/cases/${result.caseId}`);
    }
  };

  return (
    <div 
      className={`intel-result ${isSelected ? 'intel-result--selected' : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
    >
      <div className="intel-result__header">
        <div className="intel-result__relevance">
          <span className="intel-result__score">{result.relevanceScore}%</span>
          <span className="intel-result__score-label">DEMO RELEVANCE</span>
        </div>
        <div className="intel-result__meta">
          <span className="intel-result__date">{new Date(result.date).toISOString().split('T')[0]}</span>
          <span className={`intel-result__status intel-result__status--${result.status.toLowerCase()}`}>
            {result.status}
          </span>
        </div>
      </div>
      
      <div className="intel-result__title-area">
        <h3 className="intel-result__title">{result.title}</h3>
        <span className="intel-result__source-type">{result.sourceType}</span>
        <span className="intel-result__case">{result.caseId}</span>
      </div>
      
      <div className="intel-result__excerpt">
        "{result.excerpt}"
      </div>
      
      <div className="intel-result__footer">
        <div className="intel-result__location">
          {result.page && <span>PAGE {result.page}</span>}
          {result.lines && <span>LINES {result.lines}</span>}
        </div>
        
        <button 
          className="intel-btn-outline intel-btn-sm" 
          onClick={handleOpenSource}
          disabled={!result.isAuthorized}
        >
          {result.isAuthorized ? '[ OPEN SOURCE ]' : '[ UNAUTHORIZED ]'}
        </button>
      </div>
    </div>
  );
}
