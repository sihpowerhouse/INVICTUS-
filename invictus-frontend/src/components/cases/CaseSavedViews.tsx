import './CaseSavedViews.css';
import type { CaseFiltersState } from './CaseCommandBar';

interface CaseSavedViewsProps {
  currentFilters: CaseFiltersState;
  onApplyView: (filters: Partial<CaseFiltersState>) => void;
}

export default function CaseSavedViews({ currentFilters, onApplyView }: CaseSavedViewsProps) {
  
  const views = [
    { id: 'ALL', label: 'ALL CASES', overrides: { priority: 'ALL', status: 'ALL', sort: 'RECENTLY_UPDATED' } },
    { id: 'MY_CASES', label: 'MY CASES', overrides: { priority: 'ALL', status: 'ALL', sort: 'RECENTLY_UPDATED' } }, // Logic handled locally if needed
    { id: 'NEW_TODAY', label: 'NEW TODAY', overrides: { priority: 'ALL', status: 'NEW', sort: 'NEWEST' } },
    { id: 'CRITICAL', label: 'CRITICAL', overrides: { priority: 'CRITICAL', status: 'ALL', sort: 'NEWEST' } },
    { id: 'PENDING_REVIEW', label: 'PENDING REVIEW', overrides: { priority: 'ALL', status: 'REVIEW', sort: 'RECENTLY_UPDATED' } },
  ];

  // A simple heuristic to determine active view
  const getActiveView = () => {
    if (currentFilters.status === 'NEW') return 'NEW_TODAY';
    if (currentFilters.priority === 'CRITICAL') return 'CRITICAL';
    if (currentFilters.status === 'REVIEW') return 'PENDING_REVIEW';
    return 'ALL';
  };

  const activeId = getActiveView();

  return (
    <div className="case-saved-views">
      {views.map(view => (
        <button 
          key={view.id}
          className={`saved-view-btn ${activeId === view.id ? 'active' : ''}`}
          data-critical={view.id === 'CRITICAL'}
          onClick={() => onApplyView(view.overrides)}
        >
          {view.label}
        </button>
      ))}
    </div>
  );
}
