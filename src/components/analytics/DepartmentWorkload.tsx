import './Analytics.css';
import type { DepartmentWorkload as DeptWorkloadType } from '../../types/analytics';

interface Props {
  data: DeptWorkloadType[];
}

export default function DepartmentWorkload({ data }: Props) {
  return (
    <div className="analytics-card" style={{ minHeight: '300px' }}>
      <div className="analytics-panel-header">
        <span>DEPARTMENT WORKLOAD</span>
      </div>

      {data.length === 0 ? (
        <div className="analytics-no-telemetry">
          <span className="analytics-no-telemetry__title">NO DEPARTMENT TELEMETRY</span>
          <span className="analytics-no-telemetry__sub">Organisational visibility not exposed by current backend</span>
        </div>
      ) : (
        // This branch only renders when real data is available (mock mode or future API)
        <div style={{ padding: '0.5rem 0' }}>
          {data.map(dept => (
            <div key={dept.department} style={{ marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: '#aaa', letterSpacing: '1px', textTransform: 'uppercase' }}>
                  {dept.department}
                </span>
                <span style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: '#555' }}>
                  {dept.activeCases} active
                </span>
              </div>
              <div style={{ background: '#1a1a1a', height: '4px', borderRadius: '2px' }}>
                <div style={{
                  background: '#00f0ff',
                  height: '100%',
                  width: `${Math.min(100, dept.activeCases)}%`,
                  borderRadius: '2px',
                  opacity: 0.6
                }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
