import './CaseCommandBar.css';
import Dropdown from '../common/Dropdown';

export interface CaseFiltersState {
  searchQuery: string;
  priority: string;
  status: string;
  department: string;
  officer: string;
  sort: string;
}

interface CaseCommandBarProps {
  filters: CaseFiltersState;
  onChange: (newFilters: CaseFiltersState) => void;
  onReset: () => void;
}

export default function CaseCommandBar({ filters, onChange, onReset }: CaseCommandBarProps) {
  
  const updateFilter = (key: keyof CaseFiltersState, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  const priorityOptions = [
    { value: 'ALL', label: 'ALL PRIORITIES' },
    { value: 'CRITICAL', label: 'CRITICAL' },
    { value: 'HIGH', label: 'HIGH' },
    { value: 'MEDIUM', label: 'MEDIUM' },
    { value: 'LOW', label: 'LOW' }
  ];

  const statusOptions = [
    { value: 'ALL', label: 'ALL STATUSES' },
    { value: 'NEW', label: 'NEW' },
    { value: 'ACTIVE', label: 'ACTIVE' },
    { value: 'REVIEW', label: 'REVIEW' },
    { value: 'ON_HOLD', label: 'ON HOLD' },
    { value: 'CLOSED', label: 'CLOSED' },
    { value: 'ARCHIVED', label: 'ARCHIVED' }
  ];

  const sortOptions = [
    { value: 'RECENTLY_UPDATED', label: 'RECENTLY UPDATED' },
    { value: 'NEWEST', label: 'NEWEST FIRST' },
    { value: 'OLDEST', label: 'OLDEST FIRST' },
    { value: 'PRIORITY', label: 'BY PRIORITY' },
    { value: 'CASE_ID', label: 'BY CASE ID' }
  ];

  return (
    <div className="case-command-bar">
      <div className="command-search-group">
        <label className="case-filter-label" htmlFor="case-search">SEARCH CASES</label>
        <input 
          id="case-search"
          type="text" 
          className="case-filter-input"
          placeholder="Case ID, Title, Keyword..." 
          value={filters.searchQuery}
          onChange={e => updateFilter('searchQuery', e.target.value)}
        />
      </div>

      <Dropdown 
        label="PRIORITY"
        value={filters.priority}
        options={priorityOptions}
        onChange={(val) => updateFilter('priority', val)}
      />

      <Dropdown 
        label="STATUS"
        value={filters.status}
        options={statusOptions}
        onChange={(val) => updateFilter('status', val)}
      />

      <Dropdown 
        label="SORT"
        value={filters.sort}
        options={sortOptions}
        onChange={(val) => updateFilter('sort', val)}
      />

      <div className="command-bar-actions">
        <button className="btn-reset" onClick={onReset}>RESET</button>
      </div>
    </div>
  );
}
