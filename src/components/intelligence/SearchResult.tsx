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
    let targetId = result.id;
    if (result.id === 'RES-001') targetId = 'DOC-26190-001';
    if (result.id === 'RES-002') targetId = 'DOC-26190-002';
    if (result.id === 'RES-003') targetId = 'MEDIA-26190-002';

    if (result.sourceType === 'DOCUMENT') {
      navigate(`/documents/${targetId}`);
    } else if (result.sourceType === 'MEDIA') {
      navigate(`/media/${targetId}`);
    } else if (result.sourceType === 'CASE') {
      navigate(`/cases/${result.caseId}`);
    }
  };

  return (
    <div 
      className={`intel-research-result ${isSelected ? 'intel-research-result--selected' : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
    >
      <div className="intel-research-result__metadata">
        <div className="intel-research-result__source-id">
          {result.id}
        </div>
        <div className="intel-research-result__badges">
          <span className="intel-research-result__badge intel-research-result__badge--type">
            {result.sourceType}
          </span>
          <span className="intel-research-result__badge intel-research-result__badge--case">
            {result.caseId}
          </span>
          <span className="intel-research-result__badge intel-research-result__badge--relevance">
            {result.relevanceScore}% MATCH
          </span>
        </div>
      </div>
      
      <h3 className="intel-research-result__title">{result.title}</h3>
      
      <div className="intel-research-result__excerpt">
        "{result.excerpt}"
      </div>
      
      <div className="intel-research-result__footer">
        <div className="intel-research-result__location">
          <span className="intel-research-result__status">
            {result.status === 'VERIFIED' ? '[ VERIFIED ]' : result.status === 'RESTRICTED' ? '[ RESTRICTED ]' : `[ ${result.status} ]`}
          </span>
          {result.page && <span>PAGE {result.page}</span>}
          {result.lines && <span>LINES {result.lines}</span>}
          <span className="intel-research-result__date">{new Date(result.date).toISOString().split('T')[0]}</span>
        </div>
        
        <button 
          className="intel-btn-outline intel-btn-sm" 
          onClick={handleOpenSource}
          disabled={!result.isAuthorized}
        >
          {result.isAuthorized ? '[ OPEN SOURCE ]' : '[ ACCESS REQUIRED ]'}
        </button>
      </div>
    </div>
  );
}
