import './Security.css';

export default function VerificationResult() {
  return (
    <div className="security-panel" style={{ 
      borderColor: 'rgba(0, 230, 118, 0.3)', 
      background: 'rgba(0, 230, 118, 0.05)',
      boxShadow: '0 0 20px rgba(0, 230, 118, 0.05)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
        <div style={{ 
          width: '32px', 
          height: '32px', 
          borderRadius: '50%', 
          background: 'rgba(0, 230, 118, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#00e676'
        }}>
          ✓
        </div>
        <h2 style={{ 
          fontFamily: 'monospace', 
          fontSize: '18px', 
          color: '#00e676', 
          margin: 0,
          letterSpacing: '0.1em'
        }}>
          INTEGRITY VERIFIED
        </h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        <div className="security-value-group">
          <span className="security-label">VERSION CHAIN</span>
          <span className="security-value security-value--highlight" style={{ color: '#00e676' }}>INTACT</span>
        </div>
        <div className="security-value-group">
          <span className="security-label">SIGNATURE</span>
          <span className="security-value security-value--highlight" style={{ color: '#00e676' }}>VALID</span>
        </div>
        <div className="security-value-group">
          <span className="security-label">MERKLE ROOT</span>
          <span className="security-value security-value--highlight" style={{ color: '#00e676' }}>MATCHED</span>
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
        FRONTEND DEMO VERIFICATION ONLY
      </div>
    </div>
  );
}
