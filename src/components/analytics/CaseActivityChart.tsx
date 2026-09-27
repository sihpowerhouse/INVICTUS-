import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import type { CaseActivityPoint } from '../../types/analytics';
import './Analytics.css';

interface Props {
  data: CaseActivityPoint[] | null | undefined;
}

export default function CaseActivityChart({ data }: Props) {

  return (
    <div className="analytics-card" style={{ gridColumn: '1 / -1', minHeight: '300px' }}>
      <div className="analytics-panel-header">
        <span>CASE ACTIVITY OVER TIME</span>
        <span>LAST 30 DAYS</span>
      </div>

      {data === undefined ? (
        <div className="analytics-no-telemetry">
          <span className="analytics-no-telemetry__title">DATA SOURCE UNAVAILABLE</span>
        </div>
      ) : data === null ? (
        <div className="analytics-no-telemetry">
          <span className="analytics-no-telemetry__title">DATA NOT EXPOSED BY CURRENT BACKEND</span>
        </div>
      ) : data.length === 0 ? (
        <div className="analytics-no-telemetry">
          <span className="analytics-no-telemetry__title">NO AUTHORIZED DATA AVAILABLE</span>
        </div>
      ) : (
        <div style={{ width: '100%', height: '250px' }}>
          <ResponsiveContainer>
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00f0ff" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false} />
              <XAxis
                dataKey="date"
                stroke="#555"
                tick={{ fill: '#888', fontSize: 10, fontFamily: 'monospace' }}
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
                contentStyle={{ background: '#111', border: '1px solid #00f0ff', borderRadius: '0' }}
                wrapperClassName="invictus-tooltip"
              />
              <Area
                type="monotone"
                dataKey="active"
                stroke="#00f0ff"
                fillOpacity={1}
                fill="url(#colorActive)"
                name="Active Investigations"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="new"
                stroke="#555"
                strokeWidth={2}
                dot={{ r: 3, fill: '#111', stroke: '#555' }}
                activeDot={{ r: 5, fill: '#00f0ff', stroke: '#111' }}
                name="New Cases"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
