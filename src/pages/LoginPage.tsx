import { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import './LoginPage.css';

export default function LoginPage() {
  const { login } = useAuth();
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [capsLock, setCapsLock] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cursor tracking motion values
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  
  // Smooth springs for inertia
  const springX = useSpring(mouseX, { stiffness: 30, damping: 15, mass: 0.5 });
  const springY = useSpring(mouseY, { stiffness: 30, damping: 15, mass: 0.5 });

  // Map 0-1 values to inverse translation for atmospheric background drift
  const bgX = useTransform(springX, [0, 1], ['5%', '-5%']);
  const bgY = useTransform(springY, [0, 1], ['5%', '-5%']);
  
  // Subtle parallax for the login card
  const cardX = useTransform(springX, [0, 1], ['-3px', '3px']);
  const cardY = useTransform(springY, [0, 1], ['-3px', '3px']);
  
  // Card spotlight mapped to percentage coordinates
  const spotlightX = useTransform(springX, [0, 1], ['0%', '100%']);
  const spotlightY = useTransform(springY, [0, 1], ['0%', '100%']);
  const spotlightBackground = useMotionTemplate`radial-gradient(circle at ${spotlightX} ${spotlightY}, rgba(0, 240, 255, 0.04) 0%, transparent 60%)`;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setCapsLock(e.getModifierState('CapsLock'));
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyDown);
    };
  }, []);

  const handlePointerMove = (e: React.PointerEvent) => {
    // Restrict interactive effect to devices that support fine pointing (mice)
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      mouseX.set(x);
      mouseY.set(y);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeId || !password) {
      setError('EMPLOYEE ID AND PASSWORD REQUIRED');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      await login({ employeeId, password });
    } catch (err: any) {
      setError(err.message || 'AUTHENTICATION FAILED');
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="login-page"
      onPointerMove={handlePointerMove}
    >
      {/* Ambient environment */}
      <motion.div 
        className="login-page__atmosphere"
        style={{ x: bgX, y: bgY }}
      >
        <div className="login-page__glow login-page__glow--cyan" />
        <div className="login-page__glow login-page__glow--blue" />
        <div className="login-page__glow login-page__glow--violet" />
      </motion.div>
      
      {/* Decorative overlays */}
      <div className="login-page__grid-overlay" />
      <div className="login-page__noise-overlay" />

      {/* Meta context details */}
      <div className="login-page__meta login-page__meta--top-left">INVICTUS // SECURE ACCESS</div>
      <div className="login-page__meta login-page__meta--top-right">NODE: AUTH-01</div>
      <div className="login-page__meta login-page__meta--bottom-left">STATUS: READY</div>
      <div className="login-page__meta login-page__meta--bottom-right">SECURE CHANNEL</div>

      {/* Login Card */}
      <motion.div 
        className="login-page__container"
        style={{ x: cardX, y: cardY }}
      >
        <motion.div 
          className="login-page__card-spotlight"
          style={{ background: spotlightBackground }}
        />

        <div className="login-page__brand">
          <div className="login-page__title">INVICTUS</div>
          <div className="login-page__subtitle">SECURE EVIDENCE INTELLIGENCE</div>
          <div className="login-page__status-line">AUTHORIZED ACCESS ONLY</div>
        </div>

        <form className="login-page__form" onSubmit={handleSubmit}>
          {error && <div className="login-page__error">{error}</div>}
          
          <div className="login-page__field">
            <label htmlFor="employeeId">EMPLOYEE ID / USER ID</label>
            <div className="login-page__input-wrapper">
              <input 
                id="employeeId"
                type="text" 
                value={employeeId}
                onChange={e => setEmployeeId(e.target.value)}
                placeholder="e.g. SEC-PS-HEAD-001"
                autoComplete="off"
              />
              <div className="login-page__input-glow" />
            </div>
          </div>

          <div className="login-page__field">
            <label htmlFor="password">
              PASSWORD
              {capsLock && <span className="login-page__warning">CAPS LOCK ENABLED</span>}
            </label>
            <div className="login-page__input-wrapper">
              <input 
                id="password"
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
              />
              <div className="login-page__input-glow" />
            </div>
          </div>

          <div className="login-page__actions">
            <button 
              type="submit" 
              className={`login-page__submit ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              <span className="login-page__submit-text">
                {isLoading ? 'AUTHENTICATING...' : 'AUTHENTICATE'}
              </span>
              <div className="login-page__submit-sweep" />
            </button>
            <div className="login-page__divider">
              <span>OR</span>
            </div>
            <div className="login-page__secure-access-label">
              SECURE ACCESS
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
