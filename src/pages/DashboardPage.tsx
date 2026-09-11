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
      <DepartmentCommandRing departments={departments} />
    </>
  );
}

export default DashboardPage;
