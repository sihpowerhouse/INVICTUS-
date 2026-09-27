import './Security.css';
import type { SecurityEvent as ISecurityEvent } from '../../types/security';

interface SecurityEventProps {
  event: ISecurityEvent;
}

export default function SecurityEvent({ event }: SecurityEventProps) {
  const isCritical = event.severity === 'CRITICAL';
  const isWarning = event.severity === 'WARNING';

  return (
    <div style={{
      background: isCritical ? 'rgba(255, 59, 48, 0.05)' : isWarning ? 'rgba(255, 176, 32, 0.05)' : 'rgba(255,255,255,0.02)',
      border: `1px solid ${isCritical ? 'rgba(255, 59, 48, 0.3)' : isWarning ? 'rgba(255, 176, 32, 0.3)' : 'rgba(255,255,255,0.05)'}`,
      borderLeft: `3px solid ${isCritical ? '#ff3b30' : isWarning ? '#ffb020' : 'var(--accent)'}`,
      borderRadius: 'var(--radius-sm)',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ 
          fontFamily: 'monospace', 
          fontSize: '12px', 
          fontWeight: 700, 
          letterSpacing: '0.05em',
          color: isCritical ? '#ff3b30' : isWarning ? '#ffb020' : 'var(--text-primary)'
        }}>
          {event.type}
        </span>
        <span className="security-label">{new Date(event.timestamp).toLocaleString()}</span>
      </div>

      <div className="security-value" style={{ lineHeight: 1.4 }}>
        {event.description}
      </div>

      {(event.actor || event.target) && (
        <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
          {event.actor && (
            <div className="security-value-group">
              <span className="security-label">ACTOR</span>
              <span className="security-value">{event.actor}</span>
            </div>
          )}
          {event.target && (
            <div className="security-value-group">
              <span className="security-label">TARGET</span>
              <span className="security-value">{event.target}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
