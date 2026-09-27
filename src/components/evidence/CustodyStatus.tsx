import './CustodyStatus.css';
import type { Evidence } from '../../types/evidence';

interface CustodyStatusProps {
  evidence: Evidence;
}

const STATE_LABEL: Record<string, string> = {
  IN_CUSTODY: 'IN CUSTODY',
  AT_FSL: 'AT FSL',
  UNDER_EXAMINATION: 'UNDER EXAMINATION',
  TRANSFERRED: 'TRANSFERRED',
  RELEASED: 'RELEASED',
  ARCHIVED: 'ARCHIVED',
};

export default function CustodyStatus({ evidence }: CustodyStatusProps) {
  const stateKey = evidence.custodyState.toLowerCase();
  const stateLabel = STATE_LABEL[evidence.custodyState] ?? evidence.custodyState;

  return (
    <div className="custody-status">
      <span className="custody-status__label">CURRENT CUSTODY STATE</span>

      <div className="custody-status__state">
        <span
          className={`custody-status__indicator custody-status__indicator--${stateKey}`}
          role="img"
          aria-label={stateLabel}
        />
        <span className="custody-status__state-text">{stateLabel}</span>
      </div>

      <div className="custody-status__detail-grid">
        <div className="custody-status__detail">
          <span className="custody-status__detail-label">CURRENT HOLDER</span>
          <span className="custody-status__detail-value">{evidence.currentHolder}</span>
        </div>
        <div className="custody-status__detail">
          <span className="custody-status__detail-label">DEPARTMENT</span>
          <span className="custody-status__detail-value">{evidence.department}</span>
        </div>
        <div className="custody-status__detail" style={{ gridColumn: '1 / -1' }}>
          <span className="custody-status__detail-label">LOCATION</span>
          <span className="custody-status__detail-value">{evidence.location}</span>
        </div>
      </div>
    </div>
  );
}
