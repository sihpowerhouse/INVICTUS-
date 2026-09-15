import { useState, useEffect } from 'react';
import { UserPlus, UserCheck, Clock, Shield, History, Mail } from 'lucide-react';
import type { CaseMember } from '../../types/case';
import type { AccessHistoryEvent, ExternalInvitation, DocumentAccess } from '../../types/access';
import { memberService } from '../../services/memberService';
import { accessService } from '../../services/accessService';
import { invitationService } from '../../services/invitationService';
import OTPModal from '../common/OTPModal';
import InviteParticipantForm from './InviteParticipantForm';
import './CaseMembersList.css';

interface CaseMembersListProps {
  caseId: string;
}

export default function CaseMembersList({ caseId }: CaseMembersListProps) {
  const [members, setMembers] = useState<CaseMember[]>([]);
  const [history, setHistory] = useState<AccessHistoryEvent[]>([]);
  const [invitations, setInvitations] = useState<ExternalInvitation[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  
  // OTP state
  const [isOTPOpen, setIsOTPOpen] = useState(false);
  const [pendingInviteData, setPendingInviteData] = useState<{email: string, role: string, documents: DocumentAccess[]} | null>(null);

  useEffect(() => {
    let mounted = true;
    
    Promise.all([
      memberService.getCaseMembers(caseId),
      accessService.getAccessHistory(caseId),
      invitationService.getPendingInvitationsForCase(caseId)
    ]).then(([membersData, historyData, invitationsData]) => {
      if (mounted) {
        setMembers(membersData);
        setHistory(historyData);
        setInvitations(invitationsData);
        setIsLoading(false);
      }
    });
    
    return () => { mounted = false; };
  }, [caseId]);

  const handleInviteSubmit = (email: string, role: string, documents: DocumentAccess[]) => {
    setPendingInviteData({ email, role, documents });
    setIsInviteOpen(false);
    setIsOTPOpen(true);
  };

  const handleVerifyOTP = async (code: string) => {
    const isValid = await memberService.verifyOTP('CURRENT_USER', code);
    if (isValid && pendingInviteData) {
      const token = await invitationService.createInvitation(
        caseId, 
        pendingInviteData.email, 
        pendingInviteData.role, 
        pendingInviteData.documents
      );
      
      // Add to pending invitations
      const newInv = await invitationService.getInvitation(token);
      if (newInv) {
        setInvitations(prev => [newInv, ...prev]);
        
        // Also add to access history mock
        setHistory(prev => [{
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          user: 'CURRENT_USER',
          action: 'INVITATION SENT',
          resource: `${pendingInviteData.email} (${pendingInviteData.documents.length} Docs)`,
          result: 'SUCCESS'
        }, ...prev]);
      }
      
      setTimeout(() => setIsOTPOpen(false), 800);
      setPendingInviteData(null);
      return true;
    }
    return false;
  };

  if (isLoading) {
    return <div className="loading-text">LOADING ACCESS DATA...</div>;
  }

  return (
    <div className="case-members-workspace">
      {isInviteOpen ? (
        <div className="data-panel" style={{ padding: '24px' }}>
          <InviteParticipantForm 
            caseId={caseId} 
            onCancel={() => setIsInviteOpen(false)} 
            onSubmit={handleInviteSubmit} 
          />
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ margin: 0, color: 'var(--text-primary)', letterSpacing: '0.1em', fontSize: '1.2rem' }}>ACCESS MANAGEMENT</h2>
            <button 
              className="btn-primary" 
              onClick={() => setIsInviteOpen(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <UserPlus size={16} />
              INVITE PARTICIPANT
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
            {/* CURRENT MEMBERS */}
            <div className="data-panel">
              <div className="data-panel-header">
                <Shield size={16} color="var(--accent)" />
                <h3 className="data-panel-title">CURRENT MEMBERS</h3>
              </div>
              <div className="data-panel-content">
                {members.length === 0 ? (
                  <div className="empty-text">NO ACTIVE MEMBERS</div>
                ) : (
                  <div className="members-list">
                    {members.map(member => (
                      <div key={member.id} className="member-item">
                        <div className="member-info">
                          <span className="member-name">{member.name.toUpperCase()}</span>
                          <span className="member-role">{member.role.toUpperCase()} &bull; {member.memberType || 'INTERNAL'}</span>
                        </div>
                        <div className={`member-status status-${member.accessState.toLowerCase()}`}>
                          {member.accessState === 'APPROVED' && <UserCheck size={14} />}
                          <span>{member.accessState}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* PENDING INVITATIONS */}
            <div className="data-panel">
              <div className="data-panel-header">
                <Mail size={16} color="var(--status-warning)" />
                <h3 className="data-panel-title">PENDING INVITATIONS</h3>
              </div>
              <div className="data-panel-content">
                {invitations.length === 0 ? (
                  <div className="empty-text">NO PENDING INVITATIONS</div>
                ) : (
                  <div className="members-list">
                    {invitations.map(inv => (
                      <div key={inv.id} className="member-item">
                        <div className="member-info">
                          <span className="member-name">{inv.email}</span>
                          <span className="member-role">{inv.role.toUpperCase()} &bull; {inv.documents.length} DOCUMENTS</span>
                        </div>
                        <div className="member-status status-pending">
                          <Clock size={14} />
                          <span>PENDING</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ACCESS HISTORY */}
          <div className="data-panel">
            <div className="data-panel-header">
              <History size={16} color="var(--text-secondary)" />
              <h3 className="data-panel-title">ACCESS HISTORY</h3>
            </div>
            <div className="data-panel-content" style={{ padding: '0' }}>
              <table className="access-history-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)', textAlign: 'left' }}>
                    <th style={{ padding: '12px 16px', fontWeight: 'normal' }}>TIMESTAMP</th>
                    <th style={{ padding: '12px 16px', fontWeight: 'normal' }}>USER</th>
                    <th style={{ padding: '12px 16px', fontWeight: 'normal' }}>ACTION</th>
                    <th style={{ padding: '12px 16px', fontWeight: 'normal' }}>RESOURCE</th>
                    <th style={{ padding: '12px 16px', fontWeight: 'normal' }}>RESULT</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map(event => (
                    <tr key={event.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>
                        {new Date(event.timestamp).toLocaleString()}
                      </td>
                      <td style={{ padding: '12px 16px' }}>{event.user}</td>
                      <td style={{ padding: '12px 16px', color: 'var(--text-primary)' }}>{event.action}</td>
                      <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>{event.resource}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ 
                          color: event.result === 'SUCCESS' ? 'var(--accent)' : 'var(--status-error)',
                          border: `1px solid ${event.result === 'SUCCESS' ? 'var(--accent)' : 'var(--status-error)'}`,
                          padding: '2px 6px',
                          borderRadius: '2px',
                          fontSize: '10px'
                        }}>
                          {event.result}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {history.length === 0 && (
                    <tr>
                      <td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                        NO ACCESS EVENTS LOGGED
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <OTPModal 
        isOpen={isOTPOpen}
        onVerify={handleVerifyOTP}
        onCancel={() => setIsOTPOpen(false)}
        title="AUTHORIZE EXTERNAL INVITATION"
        message="A 6-digit verification code was sent to your official email to authorize this invitation."
      />
    </div>
  );
}
