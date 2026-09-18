import type { IntegrityStatusType } from '../../types/security';
import './Security.css';

export interface VerificationResultProps {
  documentStatus: IntegrityStatusType;
  caseMerkleValid?: boolean;
}

export default function VerificationResult({ documentStatus, caseMerkleValid }: VerificationResultProps) {
  const isDocVerified = documentStatus === 'VERIFIED';
  const isMerkleVerified = caseMerkleValid === true;

  const docColor = isDocVerified ? '#00e676' : (documentStatus === 'FAILED' ? '#ff3d00' : 'var(--text-muted)');
  const merkleColor = isMerkleVerified ? '#00e676' : 'var(--text-muted)';
  
  const borderColor = isDocVerified && (caseMerkleValid === undefined || caseMerkleValid) ? 'rgba(0, 230, 118, 0.3)' : 'rgba(255, 255, 255, 0.1)';
  const bgColor = isDocVerified && (caseMerkleValid === undefined || caseMerkleValid) ? 'rgba(0, 230, 118, 0.05)' : 'rgba(255, 255, 255, 0.02)';
  const shadow = isDocVerified && (caseMerkleValid === undefined || caseMerkleValid) ? '0 0 20px rgba(0, 230, 118, 0.05)' : 'none';

  return (
    <div className="security-panel" style={{ 
      borderColor, 
      background: bgColor,
      boxShadow: shadow
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
        <div style={{ 
          width: '32px', 
          height: '32px', 
          borderRadius: '50%', 
          background: isDocVerified ? 'rgba(0, 230, 118, 0.2)' : 'rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: docColor
        }}>
          {isDocVerified ? '✓' : '—'}
        </div>
        <h2 style={{ 
          fontFamily: 'monospace', 
          fontSize: '18px', 
          color: docColor, 
          margin: 0,
          letterSpacing: '0.1em'
        }}>
          {isDocVerified ? 'DOCUMENT INTEGRITY VERIFIED' : 'DOCUMENT INTEGRITY FAILED'}
        </h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        <div className="security-value-group">
          <span className="security-label">VERSION CHAIN</span>
          <span className="security-value security-value--highlight" style={{ color: docColor }}>
            {isDocVerified ? 'INTACT' : 'BROKEN'}
          </span>
        </div>
        <div className="security-value-group">
          <span className="security-label">SIGNATURE</span>
          <span className="security-value security-value--highlight" style={{ color: docColor }}>
            {isDocVerified ? 'VALID' : 'INVALID'}
          </span>
        </div>
        <div className="security-value-group">
          <span className="security-label">CASE MERKLE ROOT</span>
          <span className="security-value security-value--highlight" style={{ color: merkleColor }}>
            {caseMerkleValid === true ? 'MATCHED' : (caseMerkleValid === false ? 'MISMATCH' : 'NOT VERIFIED')}
          </span>
        </div>
      </div>
      
      <div style={{ 
        marginTop: '16px', 
        padding: '8px', 
        background: 'rgba(255,255,255,0.05)', 
        borderRadius: 'var(--radius-sm)',
        fontFamily: 'monospace',
        fontSize: '10px',
        color: 'var(--text-muted)',
        textAlign: 'center',
        border: '1px dashed rgba(255,255,255,0.1)'
      }}>
        CRYPTOGRAPHIC PROOFS BACKED BY REAL SYSTEM
      </div>
    </div>
  );
}
