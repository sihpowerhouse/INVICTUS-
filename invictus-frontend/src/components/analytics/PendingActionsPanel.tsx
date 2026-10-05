import { Link } from 'react-router-dom';
import type { PendingAction } from '../../types/analytics';
import './Analytics.css';

interface Props {
  actions: PendingAction[] | null | undefined;
}

export default function PendingActionsPanel({ actions }: Props) {
  return (
    <div className="analytics-card" style={{ minHeight: '300px' }}>
      <div className="analytics-panel-header">
        <span>PENDING ACTIONS</span>
        {actions && actions.length > 0 && <span>{actions.length} TASKS</span>}
      </div>

      {actions === undefined ? (
        <div className="analytics-no-telemetry">
          <span className="analytics-no-telemetry__title">DATA SOURCE UNAVAILABLE</span>
        </div>
      ) : actions === null ? (
        <div className="analytics-no-telemetry">
          <span className="analytics-no-telemetry__title">PENDING ACTION METRICS NOT EXPOSED BY CURRENT BACKEND</span>
        </div>
      ) : actions.length === 0 ? (
        <div className="analytics-no-telemetry">
          <span className="analytics-no-telemetry__title">NO AUTHORIZED DATA AVAILABLE</span>
        </div>
      ) : (
        <div className="pending-actions-list">
          {actions.map((action) => (
            <Link to={action.route} key={action.id} className="pending-action-item">
              <div className="pending-action-meta">
                <span className={`action-priority ${action.priority.toLowerCase()}`}>
                  {action.priority}
                </span>
                <div className="activity-content">
                  <span className="action-desc">{action.description}</span>
                  <span className="action-type">{action.type.replace('_', ' ')} • {action.id}</span>
                </div>
              </div>
              <span className="activity-time">
                {new Date(action.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
