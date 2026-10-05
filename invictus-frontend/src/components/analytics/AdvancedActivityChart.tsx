import { useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  ReferenceLine
} from 'recharts';

interface DataPoint {
  name: string;
  current: number;
  previous: number;
  event?: string;
  movingAverage?: number;
}

interface AdvancedActivityChartProps {
  data: Omit<DataPoint, 'movingAverage'>[];
  timeView: '7_DAYS' | 'MONTHLY' | 'YEARLY';
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const fullNames: Record<string, string> = {
      MON: 'MONDAY', TUE: 'TUESDAY', WED: 'WEDNESDAY', 
      THU: 'THURSDAY', FRI: 'FRIDAY', SAT: 'SATURDAY', SUN: 'SUNDAY',
      JAN: 'JANUARY', FEB: 'FEBRUARY', MAR: 'MARCH', APR: 'APRIL',
      MAY: 'MAY', JUN: 'JUNE', JUL: 'JULY', AUG: 'AUGUST',
      SEP: 'SEPTEMBER', OCT: 'OCTOBER', NOV: 'NOVEMBER', DEC: 'DECEMBER'
    };
    const displayName = fullNames[label as string] || label;
    
    // Extract values
    let current = 0;
    let previous = 0;
    let trend = 0;
    let event = null;

    payload.forEach((p: any) => {
      if (p.dataKey === 'current') current = p.value;
      if (p.dataKey === 'previous') previous = p.value;
      if (p.dataKey === 'movingAverage') trend = p.value;
      if (p.payload.event) event = p.payload.event;
    });

    return (
      <div className="analytics-custom-tooltip">
        <div className="tooltip-header">DOCUMENT ACTIVITY</div>
        <div className="tooltip-day">{displayName}</div>
        
        {event && (
          <div className="tooltip-event">
            <span className="event-label">EVENT:</span> {event}
          </div>
        )}

        <div className="tooltip-metrics">
          <div className="tooltip-metric">
            <span className="metric-label">CURRENT</span>
            <span className="metric-value current-val">{current.toLocaleString()}</span>
          </div>
          <div className="tooltip-metric">
            <span className="metric-label">PREVIOUS</span>
            <span className="metric-value prev-val">{previous.toLocaleString()}</span>
          </div>
          <div className="tooltip-metric">
            <span className="metric-label">TREND</span>
            <span className="metric-value trend-val">{trend.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default function AdvancedActivityChart({ data, timeView }: AdvancedActivityChartProps) {
  // Calculate rolling average
  const enrichedData = useMemo(() => {
    const windowSize = timeView === '7_DAYS' ? 3 : (timeView === 'YEARLY' ? 2 : 3);
    
    return data.map((point, index, arr) => {
      let sum = 0;
      let count = 0;
      
      for (let i = Math.max(0, index - windowSize + 1); i <= index; i++) {
        sum += arr[i].current;
        count++;
      }
      
      const ma = count > 0 ? sum / count : point.current;
      
      return {
        ...point,
        movingAverage: ma
      };
    });
  }, [data, timeView]);

  // Dynamic Threshold Calculation
  const thresholdValue = useMemo(() => {
    if (enrichedData.length === 0) return 0;
    const avg = enrichedData.reduce((acc, curr) => acc + curr.current, 0) / enrichedData.length;
    return Math.ceil(avg * 1.5); // 50% above average is threshold
  }, [enrichedData]);

  // Custom Dot for rendering events and normal points
  const CustomizedDot = (props: any) => {
    const { cx, cy, payload, dataKey } = props;
    
    if (dataKey !== 'current') return null;
    
    const isEvent = !!payload.event;
    
    if (isEvent) {
      return (
        <g>
          {/* Subtle glow for event */}
          <circle cx={cx} cy={cy} r={8} fill="rgba(0, 229, 255, 0.2)" />
          <circle cx={cx} cy={cy} r={5} fill="#fff" stroke="#00e5ff" strokeWidth={2} />
        </g>
      );
    }
    
    return <circle cx={cx} cy={cy} r={4} fill="#07090b" stroke="#00e5ff" strokeWidth={2} />;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={enrichedData} margin={{ top: 40, right: 30, left: -10, bottom: 10 }}>
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        
        <CartesianGrid strokeDasharray="4 4" stroke="rgba(255, 255, 255, 0.08)" vertical={false} />
        
        <XAxis 
          dataKey="name" 
          stroke="#555" 
          tick={{fill: '#888', fontSize: 11, fontFamily: 'var(--font-mono)'}} 
          axisLine={false} 
          tickLine={false}
          dy={10}
        />
        
        <YAxis 
          stroke="#555" 
          tick={{fill: '#666', fontSize: 11, fontFamily: 'var(--font-mono)'}} 
          axisLine={false} 
          tickLine={false} 
          domain={[0, (dataMax: number) => Math.ceil(dataMax * 1.15)]}
        />
        
        <RechartsTooltip 
          content={<CustomTooltip />}
          cursor={{ stroke: 'rgba(0, 229, 255, 0.3)', strokeWidth: 1, strokeDasharray: '4 4' }}
          isAnimationActive={false}
        />
        
        <ReferenceLine 
          y={thresholdValue} 
          stroke="rgba(255, 170, 0, 0.4)" 
          strokeDasharray="3 3" 
          label={{ 
            position: 'insideTopLeft', 
            value: 'NORMAL ACTIVITY THRESHOLD', 
            fill: 'rgba(255, 170, 0, 0.7)', 
            fontSize: 10,
            fontFamily: 'var(--font-mono)' 
          }} 
        />

        {/* Draw vertical reference lines for events */}
        {enrichedData.map((entry, index) => {
          if (entry.event) {
            return (
              <ReferenceLine 
                key={`event-${index}`} 
                x={entry.name} 
                stroke="rgba(0, 229, 255, 0.2)" 
                strokeDasharray="3 3"
              />
            );
          }
          return null;
        })}

        {/* Previous Period - Muted gray-blue */}
        <Line 
          isAnimationActive={true}
          animationDuration={800}
          animationEasing="ease-out"
          type="monotone" 
          dataKey="previous" 
          stroke="#3a4b5c" 
          strokeWidth={2}
          dot={false}
          activeDot={false}
        />

        {/* Rolling Average Trend - dashed */}
        <Line 
          isAnimationActive={true}
          animationDuration={800}
          animationEasing="ease-out"
          type="monotone" 
          dataKey="movingAverage" 
          stroke="rgba(255, 255, 255, 0.3)" 
          strokeWidth={1}
          strokeDasharray="5 5"
          dot={false}
          activeDot={false}
        />

        {/* Primary Signal - Bright Cyan */}
        <Line 
          isAnimationActive={true}
          animationDuration={800}
          animationEasing="ease-out"
          type="monotone" 
          dataKey="current" 
          stroke="#00e5ff" 
          strokeWidth={3} 
          activeDot={{ r: 7, fill: '#fff', stroke: '#00e5ff', strokeWidth: 2, style: { filter: 'url(#glow)' } }}
          dot={<CustomizedDot />}
          label={{ position: 'top', fill: 'rgba(255, 255, 255, 0.7)', fontSize: 11, fontFamily: 'var(--font-mono)', dy: -12 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
