import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardService } from '../../services/dashboardService';
import type { OperationalMetrics, ExternalAccessEvent } from '../../types/dashboard';
import './OperationalStrip.css';

export default function OperationalStrip() {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<OperationalMetrics | null>(null);
  const [accessEvents, setAccessEvents] = useState<ExternalAccessEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      dashboardService.getOperationalMetrics(),
      dashboardService.getRecentExternalAccess()
    ]).then(([metricsData, accessData]) => {
      if (mounted) {
        setMetrics(metricsData);
        setAccessEvents(accessData.slice(0, 2)); // Max 2 items for compact console height
        setIsLoading(false);
      }
    }).catch(() => {
      if (mounted) setIsLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="operational-strip skeleton-mode">
        <div className="skeleton-box" style={{ width: '100%', height: '40px' }} />
        <div className="skeleton-box" style={{ width: '100%', height: '40px' }} />
        <div className="skeleton-box" style={{ width: '100%', height: '80px' }} />
      </div>
    );
  }

  return (
    <div className="operational-strip">
      <div className="strip-section">
        <div className="strip-section__header">
          <div className="strip-label">OPERATIONAL STATUS</div>
          <button 
            type="button" 
            className="operational-strip__analytics-link"
            onClick={() => navigate('/analytics')}
            aria-label="View Operational Analytics"
          >
            OPERATIONAL ANALYTICS →
          </button>
        </div>
        <div className="strip-metrics">
          <div className="strip-metric">
            <span className="strip-metric-title">OPEN CASES</span>
            <span className="strip-metric-value">{metrics?.openCases || 0}</span>
          </div>
          <div className="strip-metric">
            <span className="strip-metric-title">DOCS PENDING AI</span>
            <span className="strip-metric-value pending">{metrics?.docsPendingAI || 0}</span>
          </div>
        </div>
      </div>

      <div className="strip-section">
        <div className="strip-label">RECENT EXTERNAL ACCESS</div>
        <div className="strip-events">
          {accessEvents.length === 0 ? (
            <span className="strip-empty">NO RECENT ACCESS</span>
          ) : (
            accessEvents.map(evt => (
              <div key={evt.id} className="strip-event">
                <div className="strip-event-header">
                  <span className="event-actor">{evt.actor}</span>
                  <span className="event-time">{evt.timestamp}</span>
                </div>
                <div className="event-action">{evt.action}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
