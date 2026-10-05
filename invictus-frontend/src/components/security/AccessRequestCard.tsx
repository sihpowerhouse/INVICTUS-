import './Security.css';
import type { AccessRequest, AccessRequestStatus } from '../../types/security';

interface AccessRequestCardProps {
  request: AccessRequest;
  onUpdateStatus?: (id: string, newStatus: AccessRequestStatus) => void;
}

export default function AccessRequestCard({ request, onUpdateStatus }: AccessRequestCardProps) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.05)',
      borderRadius: 'var(--radius-sm)',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div className="security-value-group">
          <span className="security-label">REQUESTER</span>
          <span className="security-value security-value--highlight" style={{ fontSize: '14px' }}>{request.requester}</span>
          <span className="security-value">{request.department}</span>
        </div>
        
        <span className={`status-badge ${
          request.status === 'APPROVED' ? 'status-badge--verified' : 
          request.status === 'DENIED' ? 'status-badge--red' : 'status-badge--amber'
        }`}>
          {request.status}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '4px' }}>
        <div className="security-value-group">
          <span className="security-label">REQUESTED DOCUMENT</span>
          <span className="security-value" style={{ color: 'var(--accent)' }}>{request.documentName}</span>
          <span className="security-value" style={{ fontSize: '10px' }}>{request.documentId}</span>
        </div>
        
        <div className="security-value-group">
          <span className="security-label">CASE</span>
          <span className="security-value">{request.caseId}</span>
        </div>

        <div className="security-value-group">
          <span className="security-label">REQUESTED PERMISSION</span>
          <span className="security-value security-value--highlight">{request.permission}</span>
        </div>

        <div className="security-value-group">
          <span className="security-label">DATE</span>
          <span className="security-value">{new Date(request.requestedAt).toLocaleString()}</span>
        </div>
      </div>

      <div className="security-value-group">
        <span className="security-label">REASON</span>
        <span className="security-value" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', lineHeight: 1.4 }}>
          "{request.reason}"
        </span>
      </div>

      {request.status === 'PENDING' && onUpdateStatus && (
        <div style={{ display: 'flex', gap: '8px', marginTop: '8px', borderTop: '1px dashed rgba(255,255,255,0.1)', paddingTop: '16px' }}>
          <button 
            className="security-btn security-btn--success" 
            style={{ flex: 1 }}
            onClick={() => onUpdateStatus(request.id, 'APPROVED')}
          >
            APPROVE
          </button>
          <button 
            className="security-btn security-btn--danger" 
            style={{ flex: 1 }}
            onClick={() => onUpdateStatus(request.id, 'DENIED')}
          >
            DENY
          </button>
        </div>
      )}
    </div>
  );
}
