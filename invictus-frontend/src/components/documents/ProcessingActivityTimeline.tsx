import type { ProcessingTimelineEvent } from '../../types/extraction';
import './ProcessingActivityTimeline.css';

interface ProcessingActivityTimelineProps {
  timeline: ProcessingTimelineEvent[];
}

export default function ProcessingActivityTimeline({ timeline }: ProcessingActivityTimelineProps) {
  return (
    <div className="data-panel">
      <div className="data-panel-header">
        <h3 className="data-panel-title">PROCESSING ACTIVITY</h3>
      </div>
      <div className="data-panel-content processing-timeline">
        {timeline.map((event, idx) => (
          <div key={idx} className={`timeline-event ${event.status.toLowerCase()}`}>
            <div className="timeline-icon">
              {event.status === 'COMPLETED' ? '✓' : event.status === 'ACTIVE' ? '●' : '○'}
            </div>
            <div className="timeline-content">
              <span className="timeline-step">{event.step}</span>
              {event.timestamp && (
                <span className="timeline-time">
                  {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
