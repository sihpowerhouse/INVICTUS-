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

export default function CaseStatusChart({ data }: Props) {
  // Map statuses to distinct but restrained colors
  const getColor = (status: string) => {
    switch(status) {
      case 'NEW': return '#ffffff';
      case 'ACTIVE': return '#00f0ff';
      case 'REVIEW': return '#a0e0ff';
      case 'ON_HOLD': return '#ffb84a';
      case 'CLOSED': return '#444444';
      default: return '#00f0ff';
    }
  };

  return (
    <div className="analytics-card" style={{ minHeight: '300px' }}>
      <div className="analytics-panel-header">
        <span>CASE STATUS DISTRIBUTION</span>
      </div>
      <div style={{ width: '100%', height: '240px' }}>
        <ResponsiveContainer>
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" horizontal={false} />
            <XAxis 
              type="number"
              stroke="#555" 
              tick={{ fill: '#888', fontSize: 10, fontFamily: 'monospace' }}
              tickLine={false}
              axisLine={false}
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
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(entry.status)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
