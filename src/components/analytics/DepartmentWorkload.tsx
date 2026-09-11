import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import type { DepartmentWorkload as DeptWorkloadType } from '../../types/analytics';
import './Analytics.css';

interface Props {
  data: DeptWorkloadType[];
}

export default function DepartmentWorkload({ data }: Props) {
  return (
    <div className="analytics-card" style={{ minHeight: '300px' }}>
      <div className="analytics-panel-header">
        <span>DEPARTMENT WORKLOAD</span>
      </div>
      <div style={{ width: '100%', height: '240px' }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false} />
            <XAxis 
              dataKey="department" 
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
              cursor={{ fill: 'rgba(0, 240, 255, 0.05)' }}
              wrapperClassName="invictus-tooltip"
            />
            <Legend 
              wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace', color: '#888' }}
              iconType="square"
              iconSize={8}
            />
            <Bar dataKey="activeCases" name="Active Cases" stackId="a" fill="#00f0ff" barSize={30} />
            <Bar dataKey="pendingTasks" name="Pending Tasks" stackId="a" fill="#555" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
