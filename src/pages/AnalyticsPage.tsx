import './AnalyticsPage.css';
import { demoAnalyticsData } from '../data/demoAnalytics';
import {
  BarChart, Bar, Cell, PieChart, Pie, ResponsiveContainer, Tooltip as RechartsTooltip,
  CartesianGrid, XAxis, YAxis
} from 'recharts';

const COLORS = ['#00e5ff', '#0077ff', '#0044aa', '#002255', '#001133', '#000011'];

import AdvancedActivityChart from '../components/analytics/AdvancedActivityChart';
import { useState, useMemo } from 'react';

export default function AnalyticsPage() {
  const [timeView, setTimeView] = useState<'7_DAYS' | 'MONTHLY' | 'YEARLY'>('7_DAYS');
  const data = demoAnalyticsData;

  const chartData = 
    timeView === '7_DAYS' ? data.dailyActivity :
    timeView === 'MONTHLY' ? data.monthlyActivity :
    data.yearlyActivity;

  // Calculate dynamic metrics for header
  const headerMetrics = useMemo(() => {
    if (chartData.length === 0) return { current: 0, average: 0, peak: 0, trend: 0 };
    
    const current = chartData[chartData.length - 1].current;
    const peak = Math.max(...chartData.map(d => d.current));
    const avg = chartData.reduce((acc, curr) => acc + curr.current, 0) / chartData.length;
    
    const previous = chartData[chartData.length - 1].previous;
    const trendValue = previous ? ((current - previous) / previous) * 100 : 0;
    
    return {
      current,
      peak,
      average: Math.round(avg),
      trend: trendValue
    };
  }, [chartData]);

  return (
    <div className="analytics-page">
      <header className="analytics-page__header">
        <div className="analytics-page__title-group">
          <h1 className="analytics-page__title">ANALYTICS</h1>
          <p className="page-tag">Evidence Intelligence Overview</p>
        </div>
        <div className="analytics-page__actions">
          <div className="analytics-demo-badge">
            [ DEMO DATA ]
          </div>
        </div>
      </header>

      {/* TOP KPI ROW */}
      <div className="analytics-kpi-grid">
        <div className="analytics-kpi-card">
          <div className="analytics-kpi-label">TOTAL CASES</div>
          <div className="analytics-kpi-value">{data.header.totalCases}</div>
        </div>
        <div className="analytics-kpi-card">
          <div className="analytics-kpi-label">ACTIVE CASES</div>
          <div className="analytics-kpi-value">{data.header.activeCases}</div>
        </div>
        <div className="analytics-kpi-card">
          <div className="analytics-kpi-label">DOCUMENTS</div>
          <div className="analytics-kpi-value">{data.header.documents.toLocaleString()}</div>
        </div>
        <div className="analytics-kpi-card">
          <div className="analytics-kpi-label">AI PROCESSED</div>
          <div className="analytics-kpi-value">{data.header.aiProcessed}</div>
        </div>
      </div>

      {/* SECOND KPI ROW */}
      <div className="analytics-kpi-grid">
        <div className="analytics-kpi-card secondary-kpi">
          <div className="analytics-kpi-label">PROCESSING</div>
          <div className="analytics-kpi-value">{data.secondaryMetrics.processing}</div>
        </div>
        <div className="analytics-kpi-card secondary-kpi">
          <div className="analytics-kpi-label">COMPLETED</div>
          <div className="analytics-kpi-value">{data.secondaryMetrics.completed}</div>
        </div>
        <div className="analytics-kpi-card secondary-kpi">
          <div className="analytics-kpi-label">VERIFIED DOCUMENTS</div>
          <div className="analytics-kpi-value">{data.secondaryMetrics.verifiedDocuments.toLocaleString()}</div>
        </div>
        <div className="analytics-kpi-card secondary-kpi">
          <div className="analytics-kpi-label">ACCESS EVENTS</div>
          <div className="analytics-kpi-value">{data.secondaryMetrics.accessEvents.toLocaleString()}</div>
        </div>
      </div>

      <div className="analytics-dashboard-grid">
        {/* MAIN CHART */}
        <div className="analytics-panel main-chart-panel">
          <div className="analytics-panel-header chart-header-split">
            <div className="chart-header-left">
              <span>DOCUMENT ACTIVITY</span>
              <div className="chart-mini-metrics">
                <div className="mini-metric"><span className="mini-lbl">CURRENT</span> <span className="mini-val">{headerMetrics.current.toLocaleString()}</span></div>
                <div className="mini-metric"><span className="mini-lbl">AVERAGE</span> <span className="mini-val">{headerMetrics.average.toLocaleString()}</span></div>
                <div className="mini-metric"><span className="mini-lbl">PEAK</span> <span className="mini-val">{headerMetrics.peak.toLocaleString()}</span></div>
                <div className="mini-metric"><span className="mini-lbl">TREND</span> <span className="mini-val trend-positive">+{headerMetrics.trend.toFixed(1)}%</span></div>
              </div>
            </div>
            <div className="chart-header-actions">
              <span className="live-indicator" style={{ color: 'var(--color-text-secondary)', letterSpacing: '1px' }}>ACTIVITY TREND</span>
              <div className="analytics-time-selector">
                <button 
                  className={`time-btn ${timeView === '7_DAYS' ? 'active' : ''}`}
                  onClick={() => setTimeView('7_DAYS')}
                >7 DAYS</button>
                <button 
                  className={`time-btn ${timeView === 'MONTHLY' ? 'active' : ''}`}
                  onClick={() => setTimeView('MONTHLY')}
                >MONTHLY</button>
                <button 
                  className={`time-btn ${timeView === 'YEARLY' ? 'active' : ''}`}
                  onClick={() => setTimeView('YEARLY')}
                >YEARLY</button>
              </div>
            </div>
          </div>
          <div className="analytics-chart-container">
            <AdvancedActivityChart data={chartData} timeView={timeView} />
          </div>
        </div>

        {/* SIDE PANEL: CASE STATUS & DOCUMENT TYPES */}
        <div className="analytics-side-column">
          <div className="analytics-panel compact-panel">
            <div className="analytics-panel-header">CASE STATUS</div>
            <div className="analytics-chart-container-small">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.caseStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {data.caseStatus.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#111', borderColor: '#333', fontFamily: 'var(--font-mono)', fontSize: '10px' }}
                    itemStyle={{ color: 'var(--color-cyan)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="analytics-legend">
                {data.caseStatus.map((status, idx) => (
                  <div className="analytics-legend-item" key={status.name}>
                    <div className="analytics-legend-color" style={{backgroundColor: COLORS[idx % COLORS.length]}}></div>
                    <div className="analytics-legend-label">{status.name}</div>
                    <div className="analytics-legend-value">{status.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="analytics-panel compact-panel">
            <div className="analytics-panel-header">DOCUMENT TYPES</div>
            <div className="analytics-chart-container-small bar-container">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.documentDistribution} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222" horizontal={false} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={100} stroke="#666" tick={{fill: '#888', fontSize: 9, fontFamily: 'var(--font-mono)'}} axisLine={false} tickLine={false} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#111', borderColor: '#333', fontFamily: 'var(--font-mono)', fontSize: '10px', padding: '4px 8px' }}
                    cursor={{fill: '#1a1a1a'}}
                  />
                  <Bar dataKey="value" fill="var(--color-cyan)" radius={[0, 2, 2, 0]}>
                    {data.documentDistribution.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % 3]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* AI PIPELINE */}
        <div className="analytics-panel">
          <div className="analytics-panel-header">AI INTELLIGENCE</div>
          <div className="ai-pipeline-grid">
            <div className="ai-pipeline-stat">
              <div className="ai-pipeline-label">DOCUMENTS ANALYZED</div>
              <div className="ai-pipeline-value highlight">{data.aiIntelligence.documentsAnalyzed}</div>
            </div>
            <div className="ai-pipeline-stat">
              <div className="ai-pipeline-label">AI READY</div>
              <div className="ai-pipeline-value">{data.aiIntelligence.aiReady}</div>
            </div>
            <div className="ai-pipeline-stat">
              <div className="ai-pipeline-label">PROCESSING</div>
              <div className="ai-pipeline-value">{data.aiIntelligence.processing}</div>
            </div>
            <div className="ai-pipeline-stat">
              <div className="ai-pipeline-label">FAILED</div>
              <div className="ai-pipeline-value error">{data.aiIntelligence.failed}</div>
            </div>
          </div>
          <div className="ai-pipeline-footer">
            <div className="ai-pipeline-footer-item">
              <span className="ai-dot active"></span> AI ENABLED DOCUMENTS: {data.aiIntelligence.aiEnabled}
            </div>
            <div className="ai-pipeline-footer-item">
              <span className="ai-dot inactive"></span> AI DISABLED DOCUMENTS: {data.aiIntelligence.aiDisabled}
            </div>
          </div>
        </div>

        {/* RECENT SYSTEM ACTIVITY */}
        <div className="analytics-panel">
          <div className="analytics-panel-header">RECENT SYSTEM ACTIVITY</div>
          <div className="activity-list">
            {data.recentActivity.map((activity, idx) => (
              <div className="activity-item" key={idx}>
                <div className="activity-time">{activity.time}</div>
                <div className="activity-desc">{activity.description}</div>
                <div className="activity-actor">{activity.actor}</div>
              </div>
            ))}
          </div>
        </div>

        {/* DEPARTMENT ACTIVITY */}
        <div className="analytics-panel">
          <div className="analytics-panel-header">DEPARTMENT ACTIVITY</div>
          <div className="department-list">
            {data.departmentActivity.map((dept, idx) => (
              <div className="department-item" key={idx}>
                <div className="department-name">{dept.department}</div>
                <div className="department-bar-bg">
                  <div className="department-bar-fill" style={{width: `${(dept.documents / 342) * 100}%`}}></div>
                </div>
                <div className="department-value">{dept.documents} docs</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
