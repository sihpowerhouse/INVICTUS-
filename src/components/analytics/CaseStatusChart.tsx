import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import type { CaseStatusCount } from '../../types/analytics';
import './Analytics.css';

interface Props {
  data: CaseStatusCount[];
}

// Only show statuses that have at least one case; zero-count rows are omitted
// so the chart never implies missing data is zero.
export default function CaseStatusChart({ data }: Props) {
  const hasData = data.some(d => d.count > 0);

  const getColor = (status: string) => {
    switch (status) {
      case 'NEW':     return '#ffffff';
      case 'ACTIVE':  return '#00f0ff';
      case 'REVIEW':  return '#a0e0ff';
      case 'ON_HOLD': return '#ffb84a';
      case 'CLOSED':  return '#444444';
      default:        return '#00f0ff';
    }
  };

  // Filter out true-zero counts — they add noise; keep them only if all are zero
  // (so the chart is still rendered when fresh data arrives)
  const visible = data.filter(d => d.count > 0);
  const chartData = visible.length > 0 ? visible : data;

  return (
    <div className="analytics-card" style={{ minHeight: '300px' }}>
      <div className="analytics-panel-header">
        <span>CASE STATUS DISTRIBUTION</span>
        {hasData && <span className="case-status-real-badge">LIVE DATA</span>}
      </div>

      {!hasData ? (
        <div className="analytics-no-telemetry">
          <span className="analytics-no-telemetry__title">NO TELEMETRY</span>
          <span className="analytics-no-telemetry__sub">No authorized cases available</span>
        </div>
      ) : (
        <div style={{ width: '100%', height: '240px' }}>
          <ResponsiveContainer>
            <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" horizontal={false} />
              <XAxis
                type="number"
                stroke="#555"
                tick={{ fill: '#888', fontSize: 10, fontFamily: 'monospace' }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <YAxis
                dataKey="status"
                type="category"
                stroke="#555"
                tick={{ fill: '#aaa', fontSize: 10, fontFamily: 'monospace' }}
                tickLine={false}
                axisLine={false}
                width={70}
              />
              <Tooltip
                cursor={{ fill: 'rgba(0, 240, 255, 0.05)' }}
                wrapperClassName="invictus-tooltip"
              />
              <Bar dataKey="count" radius={[0, 2, 2, 0]} barSize={20} name="Cases">
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getColor(entry.status)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
