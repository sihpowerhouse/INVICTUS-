import { useState, useEffect } from 'react';
import DepartmentCommandRing from '../components/departments/DepartmentCommandRing';
import OperationalStrip from '../components/dashboard/OperationalStrip';
import DashboardActions from '../components/dashboard/DashboardActions';
import MyCasesWidget from '../components/dashboard/MyCasesWidget';
import { departments } from '../mock/departments';
import { USE_MOCK_DATA } from '../services/api/apiClient';
import { dashboardService } from '../services/dashboardService';
import type { DepartmentStatus } from '../types/department';
import './DashboardPage.css';

/**
 * DashboardPage — the INVICTUS command center.
 * 
 * 100vh No-Scroll Composition:
 * - Compact Header
 * - 2-column workspace:
 *   - LEFT (Centerpiece): Radial Command Ring
 *   - RIGHT: Compact Operations Panel
 */
function DashboardPage() {
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    if (!USE_MOCK_DATA) {
      dashboardService.getOperationalMetrics().then(setMetrics).catch(console.error);
    }
  }, []);

  const dynamicDepartments = USE_MOCK_DATA ? departments : departments.map(d => {
    if (d.id === 'police' && metrics) {
      return { ...d, activeWorkload: metrics.openCases || 0, status: 'OPERATIONAL' as DepartmentStatus };
    }
    return { ...d, activeWorkload: 0, status: 'OPERATIONAL' as DepartmentStatus };
  });

  return (
    <div className="dashboard-page">
      <div className="dashboard-workspace">
        <div className="dashboard-workspace__center">
          <DepartmentCommandRing departments={dynamicDepartments} />
        </div>
        
        <div className="dashboard-workspace__right">
          <OperationalStrip />
          <DashboardActions />
          <MyCasesWidget />
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;


