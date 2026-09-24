import type { AnalyticsSummary as SummaryType } from '../../types/analytics';
import './Analytics.css';

interface Props {
  summary: SummaryType;
}

interface MetricCardProps {
  label: string;
  value: number | string;
  unavailableLabel?: string;
  trend?: number | string;
}

function MetricCard({ label, value, unavailableLabel, trend }: MetricCardProps) {
  const isUnavailable = value === 'N/A' || value === null || value === undefined;

  return (
    <div className={`summary-metric${isUnavailable ? ' summary-metric--unavailable' : ''}`}>
      <span className="summary-label">{label}</span>
      <div className="summary-value-row">
        <span className={`summary-value${isUnavailable ? ' summary-value--unavailable' : ''}`}>
          {isUnavailable ? '—' : (typeof value === 'number' ? value.toLocaleString() : value)}
        </span>
        {!isUnavailable && trend !== undefined && trend !== 'N/A' && (
          <span className="summary-trend">
            {Number(trend) > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      {isUnavailable && unavailableLabel && (
        <span className="summary-unavailable-label">{unavailableLabel}</span>
      )}
    </div>
  );
}

export default function AnalyticsSummary({ summary }: Props) {
  return (
    <div className="analytics-summary-strip">
      <MetricCard
        label="SYSTEM ACTIVE CASES"
        value={summary.activeCases}
        trend={summary.activeCasesTrend}
      />
      <MetricCard
        label="SYSTEM DOCS PROCESSED"
        value={summary.documentsProcessed}
        unavailableLabel="DATA NOT EXPOSED BY CURRENT BACKEND"
      />
      <MetricCard
        label="SYSTEM EVIDENCE ITEMS"
        value={summary.evidenceItems}
        unavailableLabel="DATA NOT EXPOSED BY CURRENT BACKEND"
      />
      <MetricCard
        label="SYSTEM PENDING ACTIONS"
        value={summary.pendingActions}
        unavailableLabel="DATA NOT EXPOSED BY CURRENT BACKEND"
      />
    </div>
  );
}

