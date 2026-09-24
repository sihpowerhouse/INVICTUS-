import type { SystemActivity } from '../../types/analytics';
import './Analytics.css';

interface Props {
  activities: SystemActivity[] | null | undefined;
}

export default function SystemActivityPanel({ activities }: Props) {
  return (
    <div className="analytics-card" style={{ minHeight: '300px' }}>
      <div className="analytics-panel-header">
        <span>SYSTEM ACTIVITY</span>
        {activities && activities.length > 0 && <span>REAL-TIME STREAM</span>}
      </div>

      {activities === undefined ? (
        <div className="analytics-no-telemetry">
          <span className="analytics-no-telemetry__title">DATA SOURCE UNAVAILABLE</span>
        </div>
      ) : activities === null ? (
        <div className="analytics-no-telemetry">
          <span className="analytics-no-telemetry__title">DATA NOT EXPOSED BY CURRENT BACKEND</span>
        </div>
      ) : activities.length === 0 ? (
        <div className="analytics-no-telemetry">
          <span className="analytics-no-telemetry__title">NO SYSTEM ACTIVITY RECORDED IN CURRENT SCOPE.</span>
        </div>
      ) : (
        <div className="system-activity-stream">
          {activities.map((activity) => (
            <div key={activity.id} className="activity-event">
              <div className="activity-dot"></div>
              <div className="activity-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span className="activity-action">{activity.action.replace(/_/g, ' ')}</span>
                  <span className="activity-time">
                    {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <span className="activity-details">
                  {activity.user} executed action on <span className="activity-entity">{activity.entityId}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
