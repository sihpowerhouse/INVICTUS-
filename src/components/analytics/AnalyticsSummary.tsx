import type { AnalyticsSummary as SummaryType } from '../../types/analytics';
import './Analytics.css';

interface Props {
  summary: SummaryType;
}

export default function AnalyticsSummary({ summary }: Props) {
  return (
    <div className="analytics-summary-strip">
      <div className="summary-metric">
        <span className="summary-label">ACTIVE CASES</span>
        <div className="summary-value-row">
          <span className="summary-value">{summary.activeCases}</span>
          <span className="summary-trend">
            {summary.activeCasesTrend > 0 ? '+' : ''}{summary.activeCasesTrend}%
          </span>
        </div>
      </div>
      
      <div className="summary-metric">
        <span className="summary-label">DOCS PROCESSED</span>
        <div className="summary-value-row">
          <span className="summary-value">{summary.documentsProcessed.toLocaleString()}</span>
        </div>
      </div>
      
      <div className="summary-metric">
        <span className="summary-label">EVIDENCE ITEMS</span>
        <div className="summary-value-row">
          <span className="summary-value">{summary.evidenceItems.toLocaleString()}</span>
        </div>
      </div>
      
      <div className="summary-metric">
        <span className="summary-label">PENDING ACTIONS</span>
        <div className="summary-value-row">
          <span className="summary-value">{summary.pendingActions}</span>
        </div>
      </div>
    </div>
  );
}
