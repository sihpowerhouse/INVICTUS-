import { useNavigate } from 'react-router-dom';
import type { Evidence } from '../../types/evidence';
import './EvidenceList.css';

interface EvidenceListItemProps {
  evidence: Evidence;
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 2) return 'JUST NOW';
  if (mins < 60) return `${mins}M AGO`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}H AGO`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}D AGO`;
  return new Date(iso).toLocaleDateString();
}

export function EvidenceListItem({ evidence }: EvidenceListItemProps) {
  const navigate = useNavigate();
  const statusClass = `evd-badge--status-${evidence.status.toLowerCase()}`;
  const custodyClass = `evd-badge--custody-${evidence.custodyState.toLowerCase()}`;

  return (
    <div
      className="evd-item"
      role="link"
      tabIndex={0}
      onClick={() => navigate(`/evidence/${evidence.id}`)}
      onKeyDown={e => e.key === 'Enter' && navigate(`/evidence/${evidence.id}`)}
    >
      <span className="evd-item__id">{evidence.id}</span>

      <div className="evd-item__title-group">
        <span className="evd-item__title">{evidence.title}</span>
        <span className="evd-item__case">{evidence.caseId}</span>
      </div>

      <span className="evd-item__type">{evidence.type.replace(/_/g, ' ')}</span>

      <span className={`evd-badge ${statusClass}`}>
        {evidence.status.replace(/_/g, ' ')}
      </span>

      <span className={`evd-badge evd-item__custody-col ${custodyClass}`}>
        {evidence.custodyState.replace(/_/g, ' ')}
      </span>

      <div className="evd-item__activity">
        <span className="evd-item__activity-time">{relativeTime(evidence.lastActivityAt)}</span>
      </div>
    </div>
  );
}

interface EvidenceListProps {
  evidence: Evidence[];
}

export default function EvidenceList({ evidence }: EvidenceListProps) {
  if (evidence.length === 0) {
    return (
      <div className="evd-list">
        <div className="evd-list__empty">NO EVIDENCE RECORDS MATCH CURRENT FILTERS</div>
      </div>
    );
  }

  return (
    <div className="evd-list">
      <div className="evd-list__header">
        <span className="evd-list__col-label">EVIDENCE ID</span>
        <span className="evd-list__col-label">TITLE / CASE</span>
        <span className="evd-list__col-label">TYPE</span>
        <span className="evd-list__col-label">STATUS</span>
        <span className="evd-list__col-label">CUSTODY</span>
        <span className="evd-list__col-label">LAST ACTIVITY</span>
      </div>
      {evidence.map(e => (
        <EvidenceListItem key={e.id} evidence={e} />
      ))}
    </div>
  );
}
