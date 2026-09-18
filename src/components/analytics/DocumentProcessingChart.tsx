import './Analytics.css';
import type { DocumentProcessingPoint } from '../../types/analytics';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface Props {
  data: DocumentProcessingPoint[];
}

export default function DocumentProcessingChart({ data }: Props) {
  return (
    <div className="analytics-card" style={{ minHeight: '300px' }}>
      <div className="analytics-panel-header">
        <span>DOCUMENT PIPELINE</span>
      </div>

      {data.length === 0 ? (
        <div className="analytics-no-telemetry">
          <span className="analytics-no-telemetry__title">NO PIPELINE TELEMETRY</span>
          <span className="analytics-no-telemetry__sub">Processing aggregate not exposed by current backend</span>
        </div>
      ) : (
        <div style={{ width: '100%', height: '240px' }}>
          <ResponsiveContainer>
            <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorUpload" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#444" stopOpacity={0.5}/>
                  <stop offset="95%" stopColor="#444" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorIndex" x1="0" y1="0" x2="0" y2="1">
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
              <Legend
                wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace', color: '#888' }}
                iconType="circle"
                iconSize={6}
              />
              <Area type="monotone" dataKey="uploaded" stackId="1" stroke="#444" fill="url(#colorUpload)" name="Uploaded" />
              <Area type="monotone" dataKey="ocrCompleted" stackId="1" stroke="#a0e0ff" fill="#a0e0ff" fillOpacity={0.1} name="OCR Done" />
              <Area type="monotone" dataKey="indexed" stackId="1" stroke="#00f0ff" fill="url(#colorIndex)" name="Indexed" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
