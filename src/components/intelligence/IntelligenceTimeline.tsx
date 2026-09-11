import { useNavigate } from 'react-router-dom';
import './Intelligence.css';
import type { TimelineEvent } from '../../types/intelligence';

interface IntelligenceTimelineProps {
  events: TimelineEvent[];
}

export default function IntelligenceTimeline({ events }: IntelligenceTimelineProps) {
  const navigate = useNavigate();

  const handleSourceClick = (event: TimelineEvent) => {
    switch (event.sourceType) {
      case 'CASE':
        navigate(`/cases/${event.sourceId}`);
        break;
      case 'DOCUMENT':
        // Mock ID transform
        navigate(`/documents/${event.sourceId}`);
        break;
      case 'EVIDENCE':
        navigate(`/evidence/${event.sourceId}`);
        break;
      case 'MEDIA':
        navigate(`/media/${event.sourceId}`);
        break;
    }
  };

  if (events.length === 0) {
    return <div className="intelligence-empty">NO TIMELINE EVENTS FOUND</div>;
  }

  return (
    <div className="intel-timeline">
      {events.map((event, index) => (
        <div key={event.id} className="intel-timeline__node">
          <div className="intel-timeline__date-col">
            <span className="intel-timeline__date">{event.date}</span>
            {event.time && <span className="intel-timeline__time">{event.time}</span>}
          </div>
          
          <div className="intel-timeline__marker">
            <div className="intel-timeline__dot"></div>
            {index < events.length - 1 && <div className="intel-timeline__line"></div>}
          </div>
          
          <div className="intel-timeline__content">
            <div className="intel-timeline__event">{event.event}</div>
            
            <div 
              className="intel-timeline__source"
              onClick={() => handleSourceClick(event)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleSourceClick(event)}
            >
              <span className="intel-timeline__source-type">{event.sourceType}</span>
              <span className="intel-timeline__source-name">{event.sourceName}</span>
              <span className="intel-timeline__source-case">{event.caseId}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
