import { useNavigate } from 'react-router-dom';
import './MediaPanels.css';

interface RelatedEvidenceProps {
  caseIds: string[];
  evidenceIds: string[];
}

export default function RelatedEvidence({ caseIds, evidenceIds }: RelatedEvidenceProps) {
  const navigate = useNavigate();

  return (
    <div className="media-panel">
      <div className="media-panel__header">
        <h3 className="media-panel__title">RELATED EVIDENCE</h3>
      </div>
      
      {(caseIds.length === 0 && evidenceIds.length === 0) ? (
        <p className="media-panel__empty">NO RELATED EVIDENCE LINKED</p>
      ) : (
        <div className="media-related__list" role="list">
          {caseIds.map(id => (
            <div 
              key={id} 
              className="media-related__item"
              role="listitem"
              tabIndex={0}
              onClick={() => navigate(`/cases/${id}`)}
              onKeyDown={(e) => e.key === 'Enter' && navigate(`/cases/${id}`)}
            >
              <span className="media-related__icon">💼</span>
              <span className="media-related__name">CASE {id}</span>
            </div>
          ))}
          
          {evidenceIds.map(id => (
            <div 
              key={id} 
              className="media-related__item"
              role="listitem"
              tabIndex={0}
              onClick={() => navigate(`/evidence/${id}`)}
              onKeyDown={(e) => e.key === 'Enter' && navigate(`/evidence/${id}`)}
            >
              <span className="media-related__icon">🛡️</span>
              <span className="media-related__name">{id}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
