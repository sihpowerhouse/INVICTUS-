import './Security.css';
import type { SignatureRecord } from '../../types/security';

interface SignatureStatusProps {
  signature: SignatureRecord;
}

export default function SignatureStatus({ signature }: SignatureStatusProps) {
  return (
    <div className="security-panel">
      <div className="security-panel__header">
        <h3 className="security-panel__title">DIGITAL SIGNATURE</h3>
        <span className={`status-badge ${
          signature.status === 'VERIFIED' ? 'status-badge--verified' : 
          signature.status === 'INVALID' ? 'status-badge--red' : 
          'status-badge--amber'
        }`}>
          {signature.status}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div className="security-value-group">
          <span className="security-label">ALGORITHM</span>
          <span className="security-value">{signature.algorithm}</span>
        </div>
        <div className="security-value-group">
          <span className="security-label">SIGNED AT</span>
          <span className="security-value">{signature.signedAt}</span>
        </div>
        <div className="security-value-group" style={{ gridColumn: '1 / -1' }}>
          <span className="security-label">SIGNED BY</span>
          <span className="security-value security-value--highlight">{signature.signedBy}</span>
        </div>
        <div className="security-value-group" style={{ gridColumn: '1 / -1' }}>
          <span className="security-label">DEPARTMENT</span>
          <span className="security-value">{signature.department}</span>
        </div>
      </div>
      
      <div style={{ 
        marginTop: '8px', 
        padding: '8px', 
        background: 'rgba(255,255,255,0.05)', 
        borderRadius: 'var(--radius-sm)',
        fontFamily: 'monospace',
        fontSize: '10px',
        color: 'var(--text-muted)',
        textAlign: 'center'
      }}>
        MOCK / DEMO STATE ONLY
      </div>
    </div>
  );
}
