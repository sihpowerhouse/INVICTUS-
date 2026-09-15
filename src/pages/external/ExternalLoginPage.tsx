import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';

export default function ExternalLoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('EMAIL AND PASSWORD REQUIRED');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      await login({ email, password });
    } catch (err: any) {
      setError(err.message || 'AUTHENTICATION FAILED');
      setIsLoading(false);
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
        maxWidth: '400px'
      }}>
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <div style={{ color: 'var(--accent)', fontSize: '1.5rem', marginBottom: '0.5rem', letterSpacing: '0.1em' }}>INVICTUS</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', letterSpacing: '0.05em' }}>EXTERNAL PORTAL LOGIN</div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {error && <div style={{ color: 'var(--error)', fontSize: '0.8rem', textAlign: 'center' }}>{error}</div>}
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ color: 'var(--text-secondary)', fontSize: '0.7rem' }}>EMAIL ADDRESS</label>
            <input 
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{
                background: 'var(--bg-base)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
                padding: '0.75rem',
                fontFamily: 'var(--font-mono)',
                outline: 'none'
              }}
              placeholder="e.g. lawyer@example.com"
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ color: 'var(--text-secondary)', fontSize: '0.7rem' }}>PASSWORD</label>
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
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            style={{
              background: 'var(--accent)',
              color: 'var(--bg-base)',
              border: 'none',
              padding: '1rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 'bold',
              letterSpacing: '0.1em',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
              marginTop: '1rem'
            }}
          >
            {isLoading ? 'AUTHENTICATING...' : 'SECURE LOGIN'}
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.75rem' }}>
          <Link to="/external/register" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
            REQUEST ACCESS
          </Link>
        </div>
      </div>
    </div>
  );
}
