import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Shield, FileText } from 'lucide-react';
import { invitationService } from '../../services/invitationService';
import type { ExternalInvitation } from '../../types/access';

export default function ExternalRegisterPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  
  const [invitation, setInvitation] = useState<ExternalInvitation | null>(null);
  const [isLoading, setIsLoading] = useState(!!token);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (token) {
      let mounted = true;
      invitationService.getInvitation(token).then(data => {
        if (mounted) {
          setInvitation(data);
          setIsLoading(false);
        }
      });
      return () => { mounted = false; };
    }
  }, [token]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password === confirmPassword && password.length > 0 && token) {
      try {
        await invitationService.acceptExternalInvitation(token, password);
        navigate('/external/dashboard');
      } catch (err) {
        console.error('Failed to accept invitation:', err);
        // You could add an error state here if needed
      }
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'var(--bg-base)',
      fontFamily: 'var(--font-mono)'
    }}>
      <div style={{
        background: 'var(--bg-panel)',
        border: '1px solid var(--border)',
        padding: '3rem',
        width: '100%',
        maxWidth: '500px'
      }}>
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <div style={{ color: 'var(--accent)', fontSize: '1.5rem', marginBottom: '0.5rem', letterSpacing: '0.1em' }}>INVICTUS</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', letterSpacing: '0.05em' }}>EXTERNAL PORTAL REGISTRATION</div>
        </div>

        {isLoading ? (
          <div style={{ color: 'var(--text-muted)', textAlign: 'center', margin: '3rem 0' }}>
            VERIFYING INVITATION TOKEN...
          </div>
        ) : invitation ? (
          <>
            <div style={{ 
              border: '1px solid var(--border)', 
              background: 'var(--bg-base)', 
              padding: '1.5rem',
              marginBottom: '2rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent)', marginBottom: '1rem' }}>
                <Shield size={16} />
                <span style={{ fontSize: '12px', fontWeight: 'bold', letterSpacing: '0.1em' }}>SECURE INVITATION</span>
              </div>
              
              <div style={{ display: 'grid', gap: '0.5rem', fontSize: '12px', marginBottom: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr' }}>
                  <span style={{ color: 'var(--text-muted)' }}>INVITED EMAIL:</span>
                  <span style={{ color: 'var(--text-primary)' }}>{invitation.email}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr' }}>
                  <span style={{ color: 'var(--text-muted)' }}>ROLE:</span>
                  <span style={{ color: 'var(--text-primary)' }}>{invitation.role}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr' }}>
                  <span style={{ color: 'var(--text-muted)' }}>CASE REF:</span>
                  <span style={{ color: 'var(--text-primary)' }}>{invitation.caseId}</span>
                </div>
              </div>

              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>AUTHORIZED DOCUMENTS:</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {invitation.documents.map((doc, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-panel)', padding: '6px 12px', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FileText size={12} color="var(--text-muted)" />
                      <span style={{ fontSize: '11px', color: 'var(--text-primary)' }}>{doc.documentId}</span>
                    </div>
                    <span style={{ fontSize: '10px', color: 'var(--accent)' }}>{doc.permission}</span>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ color: 'var(--text-secondary)', fontSize: '0.7rem' }}>CREATE PASSWORD</label>
                <input 
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{
                    background: 'var(--bg-base)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                    padding: '0.75rem',
                    fontFamily: 'var(--font-mono)',
                    outline: 'none'
                  }}
                  required
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ color: 'var(--text-secondary)', fontSize: '0.7rem' }}>CONFIRM PASSWORD</label>
                <input 
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  style={{
                    background: 'var(--bg-base)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                    padding: '0.75rem',
                    fontFamily: 'var(--font-mono)',
                    outline: 'none'
                  }}
                  required
                />
              </div>

              <button 
                type="submit"
                style={{
                  background: 'transparent',
                  color: 'var(--accent)',
                  border: '1px solid var(--accent)',
                  padding: '1rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 'bold',
                  letterSpacing: '0.1em',
                  cursor: 'pointer',
                  marginTop: '1rem'
                }}
              >
                COMPLETE REGISTRATION
              </button>
            </form>
          </>
        ) : (
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '2rem', lineHeight: '1.5' }}>
            Access to the INVICTUS External Portal requires an invitation link. If you have an access code, please enter it below.
            <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ color: 'var(--text-secondary)', fontSize: '0.7rem' }}>ACCESS CODE (OPTIONAL)</label>
                <input 
                  type="text"
                  style={{
                    background: 'var(--bg-base)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                    padding: '0.75rem',
                    fontFamily: 'var(--font-mono)',
                    outline: 'none'
                  }}
                  placeholder="16-DIGIT CODE"
                  onChange={e => {
                    if (e.target.value.length >= 10) {
                      window.location.href = `?token=${e.target.value}`;
                    }
                  }}
                />
              </div>
            </form>
          </div>
        )}

        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.75rem' }}>
          <Link to="/external/login" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
            RETURN TO LOGIN
          </Link>
        </div>
      </div>
    </div>
  );
}
