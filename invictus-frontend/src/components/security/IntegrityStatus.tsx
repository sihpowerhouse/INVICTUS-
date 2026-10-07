import './Security.css';
import type { IntegrityStatusType } from '../../types/security';

interface IntegrityStatusProps {
  status: IntegrityStatusType;
  showLabel?: boolean;
}

export default function IntegrityStatus({ status, showLabel = true }: IntegrityStatusProps) {
  let badgeClass = 'status-badge--unknown';
  let label: string = status;

  switch (status) {
    case 'VERIFIED':
      badgeClass = 'status-badge--verified';
      break;
    case 'PENDING':
    case 'REQUIRES_REVIEW':
      badgeClass = 'status-badge--amber';
      label = status.replace('_', ' ');
      break;
    case 'FAILED':
      badgeClass = 'status-badge--red';
      break;
  }

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
      {showLabel && <span className="security-label">STATUS</span>}
      <span className={`status-badge ${badgeClass}`}>
        {label}
      </span>
    </div>
  );
}
