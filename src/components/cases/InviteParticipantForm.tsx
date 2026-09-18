import { useState, useEffect } from 'react';
import { caseService } from '../../services/caseService';
import { memberService } from '../../services/memberService';
import type { DocumentPermission, DocumentAccess } from '../../types/access';
import { Shield, FileText } from 'lucide-react';

interface InviteParticipantFormProps {
  caseId: string;
  onCancel: () => void;
  onSubmit: (email: string, role: string, documents: DocumentAccess[]) => void;
}

export default function InviteParticipantForm({ caseId, onCancel, onSubmit }: InviteParticipantFormProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [documents, setDocuments] = useState<any[]>([]);
  const [availableRoles, setAvailableRoles] = useState<string[]>(['EXTERNAL COUNSEL', 'EXPERT WITNESS', 'AUDITOR']);
  const [selectedAccess, setSelectedAccess] = useState<Record<string, DocumentPermission | 'NO ACCESS'>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    
    Promise.all([
      caseService.getCaseById(caseId),
      memberService.getInviteOptions(caseId)
    ]).then(([caseData, inviteOptions]) => {
      if (mounted) {
        if (caseData) {
          setDocuments(caseData.documents || []);
        }
        if (inviteOptions && inviteOptions.roles && inviteOptions.roles.length > 0) {
          // Filter to external roles if applicable or map them.
          // For now, use the returned roles directly if they exist.
          setAvailableRoles(inviteOptions.roles);
          if (!role) setRole(inviteOptions.roles[0]);
        } else if (!role) {
          setRole('EXTERNAL COUNSEL');
        }
        setIsLoading(false);
      }
    }).catch(err => {
      console.error('Failed to load invite options', err);
      if (mounted) setIsLoading(false);
    });

    return () => { mounted = false; };
  }, [caseId, role]);

  const handleAccessChange = (documentId: string, permission: DocumentPermission | 'NO ACCESS') => {
    setSelectedAccess(prev => ({ ...prev, [documentId]: permission }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const accessList: DocumentAccess[] = [];
    Object.entries(selectedAccess).forEach(([docId, perm]) => {
      if (perm !== 'NO ACCESS') {
        accessList.push({ documentId: docId, permission: perm as DocumentPermission });
      }
    });

    onSubmit(email, role, accessList);
  };

  return (
    <div className="invite-participant-form">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', color: 'var(--accent)' }}>
        <Shield size={20} />
        <h3 style={{ margin: 0, letterSpacing: '0.05em' }}>INVITE EXTERNAL PARTICIPANT</h3>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>PARTICIPANT EMAIL</label>
            <input 
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="e.g. lawyer@example.com"
              style={{
                background: 'var(--bg-base)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
                padding: '8px 12px',
                fontFamily: 'var(--font-mono)'
              }}
              required
            />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>ROLE</label>
            <select 
              value={role}
              onChange={e => setRole(e.target.value)}
              style={{
                background: 'var(--bg-base)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
                padding: '8px 12px',
                fontFamily: 'var(--font-mono)'
              }}
            >
              {availableRoles.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>DOCUMENT ACCESS PERMISSIONS</label>
          <div style={{ 
            background: 'var(--bg-base)', 
            border: '1px solid var(--border)', 
            maxHeight: '300px', 
            overflowY: 'auto'
          }}>
            {isLoading ? (
              <div style={{ padding: '16px', color: 'var(--text-muted)' }}>LOADING DOCUMENTS...</div>
            ) : documents.length === 0 ? (
              <div style={{ padding: '16px', color: 'var(--text-muted)' }}>NO DOCUMENTS IN THIS CASE</div>
            ) : (
              documents.map(doc => (
                <div key={doc.id} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderBottom: '1px solid var(--border)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <FileText size={16} color="var(--text-secondary)" />
                    <div>
                      <div style={{ fontSize: '12px', color: 'var(--text-primary)' }}>{doc.name}</div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{doc.id}</div>
                    </div>
                  </div>
                  <select 
                    value={selectedAccess[doc.id] || 'NO ACCESS'}
                    onChange={e => handleAccessChange(doc.id, e.target.value as any)}
                    style={{
                      background: 'var(--bg-panel)',
                      border: '1px solid var(--border)',
                      color: selectedAccess[doc.id] && selectedAccess[doc.id] !== 'NO ACCESS' ? 'var(--accent)' : 'var(--text-muted)',
                      padding: '4px 8px',
                      fontSize: '11px',
                      fontFamily: 'var(--font-mono)'
                    }}
                  >
                    <option value="NO ACCESS">NO ACCESS</option>
                    <option value="READ ONLY">READ ONLY</option>
                  </select>
                </div>
              ))
            )}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '16px' }}>
          <button 
            type="button" 
            onClick={onCancel}
            style={{
              background: 'transparent',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
              padding: '8px 16px',
              cursor: 'pointer'
            }}
          >
            CANCEL
          </button>
          <button 
            type="submit"
            style={{
              background: 'transparent',
              border: '1px solid var(--accent)',
              color: 'var(--accent)',
              padding: '8px 16px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            SEND INVITATION
          </button>
        </div>
      </form>
    </div>
  );
}
