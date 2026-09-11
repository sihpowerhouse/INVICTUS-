import { Link } from 'react-router-dom';
import type { PendingAction } from '../../types/analytics';
import './Analytics.css';

interface Props {
  actions: PendingAction[];
}

export default function PendingActionsPanel({ actions }: Props) {
  return (
    <div className="analytics-card" style={{ minHeight: '300px' }}>
      <div className="analytics-panel-header">
        <span>PENDING ACTIONS</span>
        <span>{actions.length} TASKS</span>
      </div>
      
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

        {actions.length === 0 && (
          <div style={{ color: '#888', fontSize: '0.8rem', fontFamily: 'monospace', padding: '1rem' }}>
            NO PENDING ACTIONS DETECTED.
          </div>
        )}
      </div>
    </div>
  );
}
