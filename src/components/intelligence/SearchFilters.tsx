import './Intelligence.css';

interface SearchFiltersProps {
  onFilterChange: (filters: any) => void;
}

export default function SearchFilters({ onFilterChange }: SearchFiltersProps) {
  // Mock filters UI. In a real implementation, this would manage complex state.
  return (
    <div className="intel-filters">
      <div className="intel-filters__header">
        <span className="intel-filters__title">FILTERS</span>
        <button className="intel-filters__reset" onClick={() => onFilterChange({})}>RESET</button>
      </div>
      
      <div className="intel-filters__group">
        <label className="intel-filters__label">CASE</label>
        <select className="intel-filters__select" aria-label="Filter by Case">
          <option value="">ALL CASES</option>
          <option value="CAS-26190">OPERATION ORION</option>
          <option value="CAS-26191">NIGHTFALL</option>
        </select>
      </div>

      <div className="intel-filters__group">
        <label className="intel-filters__label">DOCUMENT TYPE</label>
        <select className="intel-filters__select" aria-label="Filter by Document Type">
          <option value="">ALL TYPES</option>
          <option value="REPORT">REPORT</option>
          <option value="STATEMENT">STATEMENT</option>
          <option value="TRANSCRIPT">TRANSCRIPT</option>
        </select>
      </div>

      <div className="intel-filters__group">
        <label className="intel-filters__label">DEPARTMENT</label>
        <select className="intel-filters__select" aria-label="Filter by Department">
          <option value="">ALL DEPARTMENTS</option>
          <option value="FORENSICS">FORENSICS</option>
          <option value="CYBER">CYBER</option>
          <option value="FIELD">FIELD OPERATIONS</option>
        </select>
      </div>
      
      <div className="intel-filters__group">
        <label className="intel-filters__label">DATE RANGE</label>
        <select className="intel-filters__select" aria-label="Filter by Date">
          <option value="">ANY TIME</option>
          <option value="24H">LAST 24 HOURS</option>
          <option value="7D">LAST 7 DAYS</option>
          <option value="30D">LAST 30 DAYS</option>
        </select>
      </div>
    </div>
  );
}
