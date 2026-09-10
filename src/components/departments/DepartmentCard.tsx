import type { Department, DepartmentStatus } from '../../types/department';
import './DepartmentCard.css';

interface DepartmentCardProps {
  department: Department;
}

/** Maps DepartmentStatus → CSS modifier + display label. */
const statusMeta: Record<DepartmentStatus, { modifier: string; label: string }> = {
  OPERATIONAL: { modifier: 'operational', label: 'Operational' },
  ELEVATED:    { modifier: 'elevated',    label: 'Elevated' },
  CRITICAL:    { modifier: 'critical',    label: 'Critical' },
};

/**
 * DepartmentCard — a single department tile in the command center grid.
 *
 * Renders the department icon, status indicator, description,
 * workload count, and quick-action chips.
 *
 * Presentation only — no data fetching or side effects.
 */
function DepartmentCard({ department }: DepartmentCardProps) {
  const Icon = department.icon;
  const { modifier, label } = statusMeta[department.status];

  return (
    <article className="dept-card" tabIndex={0} role="button" aria-label={`${department.title} department`}>
      {/* Header: icon + status */}
      <div className="dept-card__header">
        <div className="dept-card__icon-wrap">
          <Icon size={22} strokeWidth={1.8} />
        </div>

        <span className={`dept-card__status dept-card__status--${modifier}`}>
          <span className="dept-card__status-dot" aria-hidden="true" />
          {label}
        </span>
      </div>

      {/* Title + description */}
      <div>
        <h3 className="dept-card__title">{department.title}</h3>
        <p className="dept-card__desc">{department.description}</p>
      </div>

      {/* Workload */}
      <div className="dept-card__workload">
        <span className="dept-card__workload-count">{department.activeWorkload}</span>
        active items
      </div>

      {/* Quick actions */}
      <div className="dept-card__actions">
        {department.actions.map((action) => {
          const ActionIcon = action.icon;
          return (
            <span className="dept-card__action" key={action.label}>
              <ActionIcon size={12} strokeWidth={2} />
              {action.label}
            </span>
          );
        })}
      </div>
    </article>
  );
}

export default DepartmentCard;
