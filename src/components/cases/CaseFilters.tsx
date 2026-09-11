import './CaseFilters.css';

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
        <label className="case-filter-label" htmlFor="case-status">STATUS</label>
        <select 
          id="case-status"
          className="case-filter-select"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="ALL">ALL STATUSES</option>
          <option value="ACTIVE">ACTIVE</option>
          <option value="REVIEW">REVIEW</option>
          <option value="ON_HOLD">ON HOLD</option>
          <option value="CLOSED">CLOSED</option>
          <option value="ARCHIVED">ARCHIVED</option>
        </select>
      </div>
    </div>
  );
}
