import './CaseFilters.css';
import Dropdown from '../common/Dropdown';

interface CaseFiltersProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  statusFilter: string;
  setStatusFilter: (s: string) => void;
}

export default function CaseFilters({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter
}: CaseFiltersProps) {
  return (
    <div className="case-filters">
      <div className="case-filter-group">
        <label className="case-filter-label" htmlFor="case-search">SEARCH</label>
        <input 
          id="case-search"
          type="text" 
          className="case-filter-input"
          placeholder="Case ID, Title, Officer..." 
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="case-filter-group">
        <Dropdown
          label="STATUS"
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: 'ALL', label: 'ALL STATUSES' },
            { value: 'ACTIVE', label: 'ACTIVE' },
            { value: 'REVIEW', label: 'REVIEW' },
            { value: 'ON_HOLD', label: 'ON HOLD' },
            { value: 'CLOSED', label: 'CLOSED' },
            { value: 'ARCHIVED', label: 'ARCHIVED' }
          ]}
          className="case-filter-select"
        />
      </div>
    </div>
  );
}
