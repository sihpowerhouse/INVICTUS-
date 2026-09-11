import { useState, useEffect } from 'react';
import './IntelligenceTimelinePage.css';
import { intelligenceService } from '../services/intelligenceService';
import type { TimelineEvent } from '../types/intelligence';

import IntelligenceTimeline from '../components/intelligence/IntelligenceTimeline';

export default function IntelligenceTimelinePage() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    intelligenceService.getTimeline('CAS-26190').then(data => {
      if (mounted) {
        setEvents(data);
        setIsLoading(false);
      }
    });
    return () => { mounted = false; };
  }, []);

  return (
    <div className="intel-timeline-page">
      <div className="intel-timeline-page__header">
        <p className="page-tag">INVICTUS / INTELLIGENCE / CAS-26190</p>
        <h1 className="page-title">CASE TIMELINE</h1>
      </div>

      <div className="intel-timeline-page__layout">
        <main className="intel-timeline-main">
          {isLoading ? (
            <div className="intelligence-loading">RECONSTRUCTING TIMELINE...</div>
          ) : (
            <IntelligenceTimeline events={events} />
          )}
        </main>
      </div>
    </div>
  );
}
