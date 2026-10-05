import { useNavigate } from 'react-router-dom';
import './Intelligence.css';
import type { PotentialInconsistency } from '../../types/intelligence';

interface InconsistencyCardProps {
  inconsistency: PotentialInconsistency;
}

export default function InconsistencyCard({ inconsistency }: InconsistencyCardProps) {
  const navigate = useNavigate();

  const handleSourceClick = (sourceId: string) => {
    if (sourceId.startsWith('DOC-')) navigate(`/documents/${sourceId}`);
    else if (sourceId.startsWith('MED-')) navigate(`/media/${sourceId}`);
  };

  return (
    <div className="intel-inconsistency-card">
      <div className="intel-inconsistency__claim-side">
        <div className="intel-inconsistency__header">
          <span className="intel-inconsistency__badge">CONFLICT</span>
        </div>
        <h3 className="intel-inconsistency__title">{inconsistency.type}</h3>
        <p className="intel-inconsistency__desc">{inconsistency.description}</p>
      </div>
      
      <div className="intel-inconsistency__sources-side">
        <div className="intel-inconsistency__sources">
          <div className="intel-inconsistency__source-box">
            <div className="intel-inconsistency__source-header">
              <span className="intel-label">SOURCE A</span>
              <button 
                className="intel-btn-text" 
                onClick={() => handleSourceClick(inconsistency.sourceA.sourceId)}
              >
                {inconsistency.sourceA.sourceName} ↗
              </button>
            </div>
            <div className="intel-inconsistency__value">"{inconsistency.sourceA.value}"</div>
          </div>
          
          <div className="intel-inconsistency__vs">VS</div>
          
          <div className="intel-inconsistency__source-box">
            <div className="intel-inconsistency__source-header">
              <span className="intel-label">SOURCE B</span>
              <button 
                className="intel-btn-text" 
                onClick={() => handleSourceClick(inconsistency.sourceB.sourceId)}
              >
                {inconsistency.sourceB.sourceName} ↗
              </button>
            </div>
            <div className="intel-inconsistency__value">"{inconsistency.sourceB.value}"</div>
          </div>
        </div>
      </div>
    </div>
  );
}
