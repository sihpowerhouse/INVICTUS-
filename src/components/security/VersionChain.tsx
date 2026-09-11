import './Security.css';
import type { VersionRecord } from '../../types/security';
import IntegrityStatus from './IntegrityStatus';

interface VersionChainProps {
  versions: VersionRecord[];
}

export default function VersionChain({ versions }: VersionChainProps) {
  // Assuming versions are sorted newest first
  return (
    <div className="security-panel">
      <div className="security-panel__header">
        <h3 className="security-panel__title">VERSION CHAIN</h3>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>
        {/* Connecting line */}
        <div style={{ 
          position: 'absolute', 
          left: '11px', 
          top: '20px', 
          bottom: '20px', 
          width: '2px', 
          background: 'rgba(255,255,255,0.1)',
          zIndex: 0
        }} />

        {versions.map((v) => (
          <div key={v.version} style={{ 
            display: 'flex', 
            gap: '16px', 
            position: 'relative', 
            zIndex: 1,
            opacity: v.isCurrent ? 1 : 0.6
          }}>
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: v.isCurrent ? 'var(--accent)' : 'var(--bg-elevated)',
              border: `2px solid ${v.isCurrent ? 'var(--accent)' : 'var(--border-subtle)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'monospace',
              fontSize: '10px',
              color: v.isCurrent ? '#000' : 'var(--text-muted)',
              fontWeight: 700,
              flexShrink: 0
            }}>
              v{v.version}
            </div>
            
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: `1px solid ${v.isCurrent ? 'rgba(0, 240, 255, 0.3)' : 'rgba(255,255,255,0.05)'}`,
              borderRadius: 'var(--radius-sm)',
              padding: '12px',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div className="security-value-group">
                  <span className="security-label">{v.timestamp}</span>
                  <span className="security-value security-value--highlight">{v.actor}</span>
                  <span className="security-value" style={{ fontSize: '11px' }}>{v.department}</span>
                </div>
                <IntegrityStatus status={v.status} showLabel={false} />
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                <span className="security-label">HASH: {v.hashPreview}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
