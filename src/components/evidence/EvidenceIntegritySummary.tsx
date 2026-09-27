import './EvidenceIntegritySummary.css';
import type { EvidenceIntegrity } from '../../types/evidence';

interface EvidenceIntegritySummaryProps {
  integrity: EvidenceIntegrity;
}

export default function EvidenceIntegritySummary({ integrity }: EvidenceIntegritySummaryProps) {
  const stateClass = `evd-integrity__state--${integrity.state.toLowerCase()}`;
  
  return (
    <div className="evd-integrity">
      <div className="evd-integrity__header">
        <h3 className="evd-integrity__title">INTEGRITY SUMMARY</h3>
        <span className="evd-integrity__demo-tag">DEMO VERIFICATION</span>
      </div>

      <div className={`evd-integrity__state ${stateClass}`}>
        <div className="evd-integrity__state-dot" />
        <span className="evd-integrity__state-text">{integrity.state}</span>
      </div>

      <div className="evd-integrity__fields">
        <div className="evd-integrity__field">
          <span className="evd-integrity__field-label">SHA-256 HASH</span>
          <span className="evd-integrity__field-value">{integrity.sha256}</span>
        </div>
        
        <div className="evd-integrity__field">
          <span className="evd-integrity__field-label">CRYPTOGRAPHIC SIGNATURE</span>
          <span className="evd-integrity__field-value">
            {integrity.signature || 'NO SIGNATURE PRESENT'}
          </span>
        </div>

        <div className="evd-integrity__field">
          <span className="evd-integrity__field-label">PROTOCOL VERSION</span>
          <span className="evd-integrity__field-value">{integrity.version}</span>
        </div>
      </div>

      <div className="evd-integrity__checked">
        LAST VERIFIED: {new Date(integrity.checkedAt).toLocaleString()}
      </div>
    </div>
  );
}
