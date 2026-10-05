import { useAuth } from '../../hooks/useAuth';
import './DashboardHeader.css';

export default function DashboardHeader() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="dashboard-header">
      <div className="dashboard-header__left">
        <span className="dashboard-header__title">COMMAND CENTER</span>
        <span className="dashboard-header__separator">///</span>
        <span className="dashboard-header__name">{user.displayName.toUpperCase()}</span>
        <span className="dashboard-header__separator">/</span>
        <span className="dashboard-header__role">{user.department?.toUpperCase()} / {user.role.toUpperCase()}</span>
        <span className="dashboard-header__separator">/</span>
        <span className="dashboard-header__type">{user.userType}</span>
      </div>
      <div className="dashboard-header__right">
        <span className="status-dot active"></span>
        <span className="dashboard-header__status-text">SESSION ACTIVE</span>
      </div>
    </div>
  );
}
