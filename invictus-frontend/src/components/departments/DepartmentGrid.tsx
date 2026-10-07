import type { Department } from '../../types/department';
import DepartmentCard from './DepartmentCard';
import './DepartmentGrid.css';

interface DepartmentGridProps {
  departments: Department[];
}

/**
 * DepartmentGrid — renders the full department command grid.
 *
 * Receives departments as a prop (injected from mock or service layer).
 * Does not fetch data itself.
 */
function DepartmentGrid({ departments }: DepartmentGridProps) {
  return (
    <section>
      <div className="dept-grid__header">
        <p className="dept-grid__tag">Department Operations</p>
        <h2 className="dept-grid__title">Command Center</h2>
        <p className="dept-grid__subtitle">
          Select a department to access its workspace
        </p>
      </div>

      <div className="dept-grid__grid">
        {departments.map((dept) => (
          <DepartmentCard key={dept.id} department={dept} />
        ))}
      </div>
    </section>
  );
}

export default DepartmentGrid;
