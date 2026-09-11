import './Intelligence.css';
import type { EvidenceBasis as IEvidenceBasis } from '../../types/intelligence';

interface EvidenceBasisProps {
  basis: IEvidenceBasis;
}

export default function EvidenceBasis({ basis }: EvidenceBasisProps) {
  return (
    <div className="intel-basis">
      <div className="intel-basis__header">
        <span className="intel-basis__title">EVIDENCE BASIS</span>
        <span className={`intel-basis__badge intel-basis__badge--${basis.relevance.toLowerCase()}`}>
          DEMO RELEVANCE: {basis.relevance}
        </span>
      </div>
      
      <div className="intel-basis__stats">
        <div className="intel-basis__stat intel-basis__stat--primary">
          <span className="intel-basis__count">{basis.totalSources}</span>
          <span className="intel-basis__label">SOURCES</span>
        </div>
        
        <div className="intel-basis__divider"></div>
        
        <div className="intel-basis__breakdown">
          {basis.documentCount > 0 && (
            <div className="intel-basis__stat">
              <span className="intel-basis__count">{basis.documentCount}</span>
              <span className="intel-basis__label">DOCUMENTS</span>
            </div>
          )}
          
          {basis.mediaCount > 0 && (
            <div className="intel-basis__stat">
              <span className="intel-basis__count">{basis.mediaCount}</span>
              <span className="intel-basis__label">MEDIA</span>
            </div>
          )}
          
          {basis.evidenceCount > 0 && (
            <div className="intel-basis__stat">
              <span className="intel-basis__count">{basis.evidenceCount}</span>
              <span className="intel-basis__label">PHYSICAL</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
