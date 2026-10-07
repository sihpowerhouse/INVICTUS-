import { useSearchParams } from 'react-router-dom';
import './DocumentsWorkspaceNav.css';

export type WorkspaceView = 'all' | 'cases' | 'evidence' | 'media' | 'timeline';

interface DocumentsWorkspaceNavProps {
  currentView: WorkspaceView;
}

export default function DocumentsWorkspaceNav({ currentView }: DocumentsWorkspaceNavProps) {
  const [, setSearchParams] = useSearchParams();

  const navItems: { id: WorkspaceView; label: string }[] = [
    { id: 'all', label: 'ALL DOCUMENTS' },
    { id: 'cases', label: 'CASE FILES' },
    { id: 'evidence', label: 'EVIDENCE' },
    { id: 'media', label: 'MEDIA' },
    { id: 'timeline', label: 'TIMELINE' },
  ];

  const handleNavClick = (viewId: WorkspaceView) => {
    setSearchParams({ view: viewId });
  };

  return (
    <nav className="workspace-nav">
      {navItems.map(item => (
        <button
          key={item.id}
          className={`workspace-nav__item ${currentView === item.id ? 'active' : ''}`}
          onClick={() => handleNavClick(item.id)}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
}
