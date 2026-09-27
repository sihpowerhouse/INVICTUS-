import type { ExtractedIntelligence } from '../../types/extraction';
import './ExtractionStatusPanel.css';

interface ExtractionStatusPanelProps {
  intelligence: ExtractedIntelligence;
}

export default function ExtractionStatusPanel({ intelligence }: ExtractionStatusPanelProps) {
  const getConfidenceLevel = (score: number | null) => {
    if (score === null) return 'none';
    if (score >= 90) return 'high';
    if (score >= 70) return 'review';
    return 'low';
  };

  const level = getConfidenceLevel(intelligence.confidence);
  const requiresReview = level === 'review' || level === 'low' || intelligence.status === 'REQUIRES REVIEW';

  return (
    <div className="data-panel">
      <div className="data-panel-header">
        <h3 className="data-panel-title">EXTRACTION STATUS</h3>
      </div>
      <div className="data-panel-content extraction-status-panel">
        <div className="extraction-meta-grid">
          <div className="extraction-meta-item">
            <span className="extraction-meta-label">METHOD</span>
            <span>{intelligence.method || 'N/A'}</span>
          </div>
          <div className="extraction-meta-item">
            <span className="extraction-meta-label">PROVIDER / MODEL</span>
            <span>{intelligence.provider} / {intelligence.model}</span>
          </div>
        </div>

        <div className="extraction-meter-container">
          <div className="extraction-meter-label">
            <span>CONFIDENCE</span>
            <span className={`confidence-value ${level}`}>
              {intelligence.confidence !== null ? `${intelligence.confidence}%` : 'NOT AVAILABLE'}
            </span>
          </div>
          {intelligence.confidence !== null && (
            <div className="extraction-meter-bar">
              <div 
                className={`extraction-meter-fill ${level}`} 
                style={{ width: `${intelligence.confidence}%` }} 
              />
            </div>
          )}
        </div>

        {requiresReview && (
          <div className="human-review-alert">
            <span>HUMAN REVIEW REQUIRED</span>
            <button className="btn-review-action">REVIEW EXTRACTION</button>
          </div>
        )}
      </div>
    </div>
  );
}
