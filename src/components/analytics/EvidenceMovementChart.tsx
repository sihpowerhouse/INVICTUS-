import './Analytics.css';
import type { EvidenceMovementPoint } from '../../types/analytics';
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

interface Props {
  data: EvidenceMovementPoint[];
}

export default function EvidenceMovementChart({ data }: Props) {
  const getColor = (state: string) => {
    switch (state) {
      case 'RECEIVED':    return '#ffffff';
      case 'EXAMINED':    return '#00f0ff';
      case 'TRANSFERRED': return '#a0e0ff';
      case 'RETURNED':    return '#888888';
      case 'ARCHIVED':    return '#444444';
      default:            return '#00f0ff';
    }
  };

  return (
    <div className="analytics-card" style={{ minHeight: '300px' }}>
      <div className="analytics-panel-header">
        <span>EVIDENCE OPERATIONS</span>
      </div>

      {data.length === 0 ? (
        <div className="analytics-no-telemetry">
          <span className="analytics-no-telemetry__title">NO EVIDENCE TELEMETRY</span>
          <span className="analytics-no-telemetry__sub">Evidence operation aggregate not exposed by current backend</span>
        </div>
      ) : (
        <div style={{ width: '100%', height: '240px' }}>
          <ResponsiveContainer>
            <BarChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false} />
              <XAxis
                dataKey="state"
                stroke="#555"
                tick={{ fill: '#888', fontSize: 9, fontFamily: 'monospace' }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#555"
                tick={{ fill: '#888', fontSize: 10, fontFamily: 'monospace' }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                cursor={{ fill: 'rgba(0, 240, 255, 0.05)' }}
                wrapperClassName="invictus-tooltip"
              />
              <Bar dataKey="count" name="Items" barSize={30} radius={[2, 2, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getColor(entry.state)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
