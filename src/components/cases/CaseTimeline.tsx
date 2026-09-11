import './CaseTimeline.css';
import type { CaseTimelineEvent } from '../../types/case';

interface CaseTimelineProps {
  events?: CaseTimelineEvent[];
}

export default function CaseTimeline({ events = [] }: CaseTimelineProps) {
  if (events.length === 0) {
    return <div style={{ color: 'var(--text-muted)', fontFamily: 'monospace', fontSize: '12px' }}>NO TIMELINE EVENTS</div>;
  }

  return (
    <div className="case-timeline">
      {events.map((event) => (
        <div key={event.id} className="timeline-event">
          <div className="timeline-date">{event.date}</div>
          <div className="timeline-content">
            <div className="timeline-event-title">{event.event}</div>
            <div className="timeline-event-desc">{event.description}</div>
            {event.sourceReference && (
              <span className="timeline-event-ref">REF: {event.sourceReference}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
