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
import type { DocumentProcessingPoint } from '../../types/analytics';
import './Analytics.css';

interface Props {
  data: DocumentProcessingPoint[];
}

export default function DocumentProcessingChart({ data }: Props) {
  return (
    <div className="analytics-card" style={{ minHeight: '300px' }}>
      <div className="analytics-panel-header">
        <span>DOCUMENT PIPELINE</span>
      </div>
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
            <Area 
              type="monotone" 
              dataKey="uploaded" 
              stroke="#666" 
              fillOpacity={1} 
              fill="url(#colorUpload)" 
              name="Uploaded"
            />
            <Area 
              type="monotone" 
              dataKey="indexed" 
              stroke="#00f0ff" 
              fillOpacity={1} 
              fill="url(#colorIndex)" 
              name="Indexed"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
