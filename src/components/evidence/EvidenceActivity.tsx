import './EvidenceActivity.css';
import type { ActivityEvent } from '../../types/evidence';

interface EvidenceActivityProps {
  events: ActivityEvent[];
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString('en-IN', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
  }).toUpperCase();
}

export default function EvidenceActivity({ events }: EvidenceActivityProps) {
  const sorted = [...events].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="evd-activity">
      <div className="evd-activity__header">
        <h3 className="evd-activity__title">ACTIVITY LOG</h3>
      </div>
      <div className="evd-activity__list" role="list">
        {sorted.map(event => (
          <div key={event.id} className="evd-activity__item" role="listitem">
            <time className="evd-activity__time" dateTime={event.timestamp}>
              {formatTime(event.timestamp)}
            </time>
            <span className={`evd-activity__type-badge evd-activity__type-badge--${event.type.toLowerCase()}`}>
              {event.type.replace(/_/g, ' ')}
            </span>
            <div>
              <div className="evd-activity__actor">{event.actor}</div>
              {event.note && <div className="evd-activity__note">{event.note}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
