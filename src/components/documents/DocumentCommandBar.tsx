import './DocumentCommandBar.css';
import Dropdown from '../common/Dropdown';

export interface DocumentFiltersState {
  searchQuery: string;
  type: string;
  status: string;
  language: string;
}

interface DocumentCommandBarProps {
  filters: DocumentFiltersState;
  onChange: (newFilters: DocumentFiltersState) => void;
  onReset: () => void;
}

export default function DocumentCommandBar({ filters, onChange, onReset }: DocumentCommandBarProps) {
  
  const updateFilter = (key: keyof DocumentFiltersState, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  const typeOptions = [
    { value: 'ALL', label: 'ALL TYPES' },
    { value: 'FIR', label: 'FIR' },
    { value: 'POLICE_REPORT', label: 'POLICE REPORT' },
    { value: 'WITNESS_STATEMENT', label: 'WITNESS STATEMENT' },
    { value: 'FORENSIC_REPORT', label: 'FORENSIC REPORT' },
    { value: 'EVIDENCE_RECORD', label: 'EVIDENCE RECORD' }
  ];

  const statusOptions = [
    { value: 'ALL', label: 'ALL STATUSES' },
    { value: 'UPLOADED', label: 'UPLOADED' },
    { value: 'PROCESSING', label: 'PROCESSING' },
    { value: 'OCR_COMPLETE', label: 'OCR COMPLETE' },
    { value: 'VERIFIED', label: 'VERIFIED' },
    { value: 'REQUIRES_REVIEW', label: 'REQUIRES REVIEW' }
  ];

  const langOptions = [
    { value: 'ALL', label: 'ALL LANGUAGES' },
    { value: 'EN', label: 'ENGLISH' },
    { value: 'HI', label: 'HINDI' },
    { value: 'UNKNOWN', label: 'UNKNOWN' }
  ];

  return (
    <div className="document-command-bar">
      <div className="command-search-group">
        <label className="case-filter-label" htmlFor="doc-search">SEARCH DOCUMENTS</label>
        <input 
          id="doc-search"
          type="text" 
          className="doc-filter-input"
          placeholder="Document Name, Case ID, Uploader..." 
          value={filters.searchQuery}
          onChange={e => updateFilter('searchQuery', e.target.value)}
        />
      </div>

      <Dropdown 
        label="TYPE"
        value={filters.type}
        options={typeOptions}
        onChange={(val) => updateFilter('type', val)}
      />

      <Dropdown 
        label="STATUS"
        value={filters.status}
        options={statusOptions}
        onChange={(val) => updateFilter('status', val)}
      />

      <Dropdown 
        label="LANGUAGE"
        value={filters.language}
        options={langOptions}
        onChange={(val) => updateFilter('language', val)}
      />

      <div className="command-bar-actions">
        <button className="btn-reset" onClick={onReset}>RESET</button>
      </div>
    </div>
  );
}
