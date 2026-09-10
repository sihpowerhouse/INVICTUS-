import DepartmentCommandRing from '../components/departments/DepartmentCommandRing';
import { departments } from '../mock/departments';

/**
 * DashboardPage — the INVICTUS command center.
 *
 * Primary view is the full-viewport radial command ring.
 */
function DashboardPage() {
  return (
    <>
      <div style={{ padding: '0 24px', paddingTop: '24px' }}>
        <p className="page-tag">INVICTUS / COMMAND CENTER</p>
        <h1 style={{ fontSize: '14px', letterSpacing: '0.1em', marginTop: '4px', color: 'var(--text-muted)' }}>
          NATIONAL EVIDENCE INTELLIGENCE
        </h1>
      </div>
      
      <DepartmentCommandRing departments={departments} />
    </>
  );
}

export default DashboardPage;
