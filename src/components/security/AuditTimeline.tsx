import './Security.css';
import type { AuditEvent } from '../../types/security';

interface AuditTimelineProps {
  events: AuditEvent[];
}

export default function AuditTimeline({ events }: AuditTimelineProps) {
  return (
    <div className="security-panel">
      <div className="security-panel__header">
        <h3 className="security-panel__title">AUDIT TIMELINE</h3>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {events.map((event, idx) => {
          // Subdue older events slightly
          const opacity = idx === 0 ? 1 : Math.max(0.6, 1 - idx * 0.1);
          
          return (
            <div 
              key={event.id} 
              style={{
                display: 'flex',
                gap: '16px',
                padding: '12px',
                background: 'rgba(255,255,255,0.02)',
                borderLeft: `2px solid ${
                  event.result === 'SUCCESS' ? 'var(--accent)' : 
                  event.result === 'FAILURE' ? '#ff3b30' : '#ffb020'
                }`,
                borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
                opacity
              }}
            >
              <div style={{ width: '80px', flexShrink: 0 }}>
                <span className="security-label" style={{ display: 'block', marginBottom: '4px' }}>TIME</span>
                <span className="security-value" style={{ fontSize: '11px' }}>
                  {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              </div>
              
              <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1.5fr 1fr 1.5fr', gap: '16px' }}>
                <div className="security-value-group">
                  <span className="security-label">ACTOR</span>
                  <span className="security-value security-value--highlight">{event.actor}</span>
                  <span className="security-value" style={{ fontSize: '10px' }}>{event.department}</span>
                </div>
                
                <div className="security-value-group">
                  <span className="security-label">ACTION</span>
                  <span className="security-value">{event.action}</span>
                </div>
                
                <div className="security-value-group">
                  <span className="security-label">TARGET</span>
                  <span className="security-value" style={{ wordBreak: 'break-all' }}>{event.target}</span>
                  <span className="security-value" style={{ fontSize: '10px' }}>{event.targetType}</span>
                </div>
              </div>

              <div style={{ alignSelf: 'flex-start' }}>
                <span className={`status-badge ${
                  event.result === 'SUCCESS' ? 'status-badge--verified' : 
                  event.result === 'FAILURE' ? 'status-badge--red' : 'status-badge--amber'
                }`} style={{ padding: '2px 6px', fontSize: '9px' }}>
                  {event.result}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
