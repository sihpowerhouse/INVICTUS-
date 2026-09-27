import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import './SessionTimeoutWarning.css';

export default function SessionTimeoutWarning() {
  const { sessionExpiresAt, isAuthenticated, logout, refresh } = useAuth();
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  
  useEffect(() => {
    if (!isAuthenticated || !sessionExpiresAt) {
      return;
    }

    const interval = setInterval(() => {
      const remaining = Math.max(0, sessionExpiresAt - Date.now());
      
      if (remaining === 0) {
        clearInterval(interval);
        logout();
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isAuthenticated, sessionExpiresAt, logout]);

  // Only show warning if less than 5 minutes remaining
  if (timeLeft === null || timeLeft > 5 * 60 * 1000) {
    return null;
  }

  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);
  const isCritical = timeLeft < 60000;

  const handleContinue = async () => {
    // In production, this would make an API call to refresh the session token.
    // We delegate to the authService/context to handle the architectural boundary.
    await refresh();
  };

  return (
    <div className={`session-warning-banner ${isCritical ? 'critical' : ''}`}>
      <div className="session-warning-content">
        <span className="session-warning-title">SESSION EXPIRING (DEMO)</span>
        <span className="session-warning-time">
          {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
        </span>
        <div className="session-warning-actions">
          <button className="btn-continue" onClick={handleContinue}>CONTINUE SESSION</button>
          <button className="btn-signout" onClick={logout}>SIGN OUT</button>
        </div>
      </div>
    </div>
  );
}
