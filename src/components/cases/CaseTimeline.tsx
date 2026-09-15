import { useState, useEffect, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, FileText } from 'lucide-react';
import type { CaseTimelineEvent } from '../../types/case';
import { caseTimelineService, type CaseTimelineFilter } from '../../services/caseTimelineService';
import './CaseTimeline.css';

interface CaseTimelineProps {
  caseId: string;
  onOpenDocument?: (documentId: string) => void;
}

export default function CaseTimeline({ caseId, onOpenDocument }: CaseTimelineProps) {
  const [events, setEvents] = useState<CaseTimelineEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<CaseTimelineFilter['category']>('ALL');
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set());

  const fetchTimeline = () => {
    setIsLoading(true);
    setError(false);
    caseTimelineService.getTimeline(caseId, { query: searchQuery, category: activeCategory })
      .then(data => {
        setEvents(data);
        setIsLoading(false);
      })
      .catch(() => {
        setError(true);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchTimeline();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseId, searchQuery, activeCategory]);

  const toggleExpand = (id: string) => {
    setExpandedEvents(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleResourceClick = (event: CaseTimelineEvent) => {
    if (event.resourceType === 'DOCUMENT' && event.resourceId && onOpenDocument) {
      onOpenDocument(event.resourceId);
    }
  };

  const categories: CaseTimelineFilter['category'][] = ['ALL', 'DOCUMENTS', 'EVIDENCE', 'MEDIA', 'ACCESS', 'AI', 'SECURITY'];

  // Group events by human readable date
  const groupedEvents = useMemo(() => {
    const groups: { [key: string]: CaseTimelineEvent[] } = {
      'TODAY': [],
      'YESTERDAY': [],
      'THIS WEEK': [],
      'OLDER': []
    };

    const now = new Date();
    const todayStr = now.toDateString();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    events.forEach(event => {
      const eventDate = new Date(event.timestamp);
      const eventDateStr = eventDate.toDateString();
      const diffTime = Math.abs(now.getTime() - eventDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (eventDateStr === todayStr) {
        groups['TODAY'].push(event);
      } else if (eventDateStr === yesterdayStr) {
        groups['YESTERDAY'].push(event);
      } else if (diffDays <= 7) {
        groups['THIS WEEK'].push(event);
      } else {
        groups['OLDER'].push(event);
      }
    });

    return Object.entries(groups).filter(([, evts]) => evts.length > 0);
  }, [events]);

  const formatTime = (iso: string) => {
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getSeverityClass = (event: CaseTimelineEvent) => {
    if (event.type.startsWith('AI_')) return 'type-ai';
    if (event.severity === 'CRITICAL') return 'severity-critical';
    if (event.severity === 'WARNING') return 'severity-warning';
    return 'severity-info';
  };

  return (
    <div className="case-timeline-container">
      <div className="case-timeline-header">
        <div className="case-timeline-search">
          <Search size={16} color="var(--text-muted)" style={{ marginTop: '8px' }} />
          <input 
            type="text" 
            placeholder="SEARCH CASE ACTIVITY..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="case-timeline-filters">
          {categories.map(cat => (
            <button 
              key={cat} 
              className={`timeline-filter-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="case-timeline-scroll">
        {error ? (
          <div className="timeline-message">
            <div>CASE TIMELINE UNAVAILABLE</div>
            <button onClick={fetchTimeline}>RETRY</button>
          </div>
        ) : isLoading ? (
          <div className="case-timeline">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="timeline-skeleton-event">
                <div className="skeleton-line" style={{ width: '10%' }}></div>
                <div className="skeleton-line" style={{ width: '40%', height: '16px' }}></div>
                <div className="skeleton-line" style={{ width: '60%' }}></div>
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="timeline-message">
            NO CASE ACTIVITY<br/>
            <span style={{color: 'var(--text-secondary)'}}>Case activity will appear here as the investigation progresses.</span>
          </div>
        ) : (
          <div className="case-timeline">
            {groupedEvents.map(([groupName, groupEvents]) => (
              <div key={groupName}>
                <div className="timeline-group-header">{groupName}</div>
                {groupEvents.map(event => {
                  const isExpanded = expandedEvents.has(event.id);
                  return (
                    <div key={event.id} className={`timeline-event ${getSeverityClass(event)}`}>
                      <div className="timeline-event-header">
                        <div className="timeline-title" onClick={() => toggleExpand(event.id)}>
                          {event.title}
                          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </div>
                        <div className="timeline-time">{formatTime(event.timestamp)}</div>
                      </div>
                      
                      {event.actor && (
                        <div className="timeline-actor">
                          {event.actor} 
                          {event.department && <span>• {event.department}</span>}
                          {event.actorRole === 'EXTERNAL_PARTICIPANT' && <span style={{color: 'var(--status-warning)'}}>• EXTERNAL</span>}
                        </div>
                      )}
                      
                      <div className="timeline-desc">{event.description}</div>
                      
                      {event.resourceId && (
                        <div className="timeline-resource" onClick={() => handleResourceClick(event)}>
                          {event.resourceType === 'DOCUMENT' && <FileText size={12} />}
                          <span>{event.resourceId}</span>
                          <span className="timeline-resource-type">{event.resourceType}</span>
                        </div>
                      )}

                      {isExpanded && (
                        <div className="timeline-details">
                          <div className="detail-item">
                            <span className="detail-label">EVENT ID</span>
                            <span className="detail-value">{event.id}</span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">TIMESTAMP</span>
                            <span className="detail-value">{new Date(event.timestamp).toLocaleString()}</span>
                          </div>
                          {event.status && (
                            <div className="detail-item">
                              <span className="detail-label">RESULT</span>
                              <span className="detail-value" style={{
                                color: event.status === 'SUCCESS' ? 'var(--status-success)' : 
                                       event.status === 'FAILED' ? 'var(--status-error)' : 'var(--text-secondary)'
                              }}>
                                {event.status}
                              </span>
                            </div>
                          )}
                          {event.actorRole && (
                            <div className="detail-item">
                              <span className="detail-label">ROLE</span>
                              <span className="detail-value">{event.actorRole}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
