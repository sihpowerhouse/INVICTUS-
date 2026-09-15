import DepartmentCommandRing from '../components/departments/DepartmentCommandRing';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import OperationalStrip from '../components/dashboard/OperationalStrip';
import DashboardActions from '../components/dashboard/DashboardActions';
import MyCasesWidget from '../components/dashboard/MyCasesWidget';
import { departments } from '../mock/departments';
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
  return (
    <div className="dashboard-page">
      <DashboardHeader />
      
      <div className="dashboard-workspace">
        <div className="dashboard-workspace__center">
          <DepartmentCommandRing departments={departments} />
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
