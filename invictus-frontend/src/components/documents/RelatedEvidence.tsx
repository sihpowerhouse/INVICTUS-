import { useNavigate } from 'react-router-dom';
import './MetadataPanel.css'; // Reuse metadata panel styles

export default function RelatedEvidence({ caseId }: { caseId: string }) {
  const navigate = useNavigate();

  // For the demo, we link to canonical evidence
  const evidenceId = caseId === 'CAS-26190' ? 'EVD-26190-001' : 'EVD-26190-002';

  return (
    <div className="metadata-panel">
      <div className="metadata-panel-header">
        <h3 className="metadata-panel-title">RELATED EVIDENCE</h3>
      </div>
      <div className="metadata-grid" style={{ paddingBottom: '16px' }}>
        <button 
          className="btn-outline" 
          style={{ width: '100%', textAlign: 'left', display: 'flex', justifyContent: 'space-between', padding: '12px' }}
          onClick={() => navigate(`/evidence/${evidenceId}`)}
        >
          <span>{evidenceId}</span>
          <span style={{ color: 'var(--text-muted)' }}>VIEW &rarr;</span>
        </button>
      </div>
    </div>
  );
}
