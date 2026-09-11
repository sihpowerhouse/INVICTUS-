import './ChainOfCustody.css';
import type { CustodyEvent } from '../../types/evidence';

interface ChainOfCustodyProps {
  events: CustodyEvent[];
}

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  const day = d.getDate().toString().padStart(2, '0');
  const month = d.toLocaleString('en', { month: 'short' }).toUpperCase();
  const year = d.getFullYear();
  const time = d.toTimeString().slice(0, 5);
  return `${day} ${month} ${year} · ${time}`;
}

function ageCls(index: number): string {
  // index 0 = newest (current)
  if (index === 0) return 'coc__event--current';
  if (index === 1) return 'coc__event--past-1';
  if (index === 2) return 'coc__event--past-2';
  return 'coc__event--past-old';
}

export default function ChainOfCustody({ events }: ChainOfCustodyProps) {
  // Sort: newest first
  const sorted = [...events].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="coc">
      <div className="coc__header">
        <h3 className="coc__title">CHAIN OF CUSTODY</h3>
        <span className="coc__count">{events.length} EVENTS</span>
      </div>

      <div className="coc__timeline" role="list">
        {sorted.map((event, index) => {
          const cls = ageCls(index);
          const isCurrent = index === 0;

          return (
            <div
              key={event.id}
              className={`coc__event ${cls}`}
              role="listitem"
              aria-label={`${event.action.replace(/_/g, ' ')} — ${event.actor}`}
            >
              <div className="coc__track">
                <div className="coc__dot" aria-hidden="true" />
                {index < sorted.length - 1 && (
                  <div className="coc__line" aria-hidden="true" />
                )}
              </div>

              <div className="coc__content">
                <div className="coc__event-head">
                  <span className="coc__action">
                    {event.action.replace(/_/g, ' ')}
                  </span>
                  {isCurrent && (
                    <span className="coc__current-tag">CURRENT</span>
                  )}
                </div>

                <div className="coc__actor-row">
                  <span className="coc__actor">{event.actor}</span>
                  <span className="coc__dept-sep" aria-hidden="true">·</span>
                  <span className="coc__dept">{event.department}</span>
                </div>

                <div className="coc__meta">
                  <time className="coc__timestamp" dateTime={event.timestamp}>
                    {formatTimestamp(event.timestamp)}
                  </time>
                  {event.location && (
                    <span className="coc__location">{event.location}</span>
                  )}
                </div>

                {event.note && (
                  <p className="coc__note">{event.note}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
