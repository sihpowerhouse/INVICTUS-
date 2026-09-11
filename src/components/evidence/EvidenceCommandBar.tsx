import './EvidenceCommandBar.css';
import type { EvidenceType, EvidenceStatus, CustodyState } from '../../types/evidence';

export interface EvidenceFiltersState {
  searchQuery: string;
  type: EvidenceType | 'ALL';
  status: EvidenceStatus | 'ALL';
  custodyState: CustodyState | 'ALL';
}

interface EvidenceCommandBarProps {
  filters: EvidenceFiltersState;
  resultCount: number;
  onChange: (filters: EvidenceFiltersState) => void;
  onReset: () => void;
}

export default function EvidenceCommandBar({
  filters,
  resultCount,
  onChange,
  onReset,
}: EvidenceCommandBarProps) {
  return (
    <div className="evd-command-bar">
      <div className="evd-command-bar__top">
        <div className="evd-search-wrap">
          <span className="evd-search-icon">⌕</span>
          <input
            className="evd-search-input"
            type="search"
            placeholder="SEARCH EVIDENCE ID, TITLE, CASE..."
            value={filters.searchQuery}
            onChange={e => onChange({ ...filters, searchQuery: e.target.value })}
            aria-label="Search evidence"
          />
        </div>
      </div>

      <div className="evd-command-bar__filters">
        <select
          className="evd-filter-select"
          value={filters.type}
          onChange={e => onChange({ ...filters, type: e.target.value as EvidenceType | 'ALL' })}
          aria-label="Filter by type"
        >
          <option value="ALL">ALL TYPES</option>
          <option value="DIGITAL_DOCUMENT">DIGITAL DOCUMENT</option>
          <option value="IMAGE">IMAGE</option>
          <option value="VIDEO">VIDEO</option>
          <option value="AUDIO">AUDIO</option>
          <option value="DEVICE">DEVICE</option>
          <option value="PHYSICAL_RECORD">PHYSICAL RECORD</option>
          <option value="FORENSIC_SAMPLE">FORENSIC SAMPLE</option>
          <option value="OTHER">OTHER</option>
        </select>

        <select
          className="evd-filter-select"
          value={filters.status}
          onChange={e => onChange({ ...filters, status: e.target.value as EvidenceStatus | 'ALL' })}
          aria-label="Filter by status"
        >
          <option value="ALL">ALL STATUS</option>
          <option value="REGISTERED">REGISTERED</option>
          <option value="IN_CUSTODY">IN CUSTODY</option>
          <option value="UNDER_EXAMINATION">UNDER EXAMINATION</option>
          <option value="TRANSFERRED">TRANSFERRED</option>
          <option value="VERIFIED">VERIFIED</option>
          <option value="REQUIRES_REVIEW">REQUIRES REVIEW</option>
          <option value="ARCHIVED">ARCHIVED</option>
        </select>

        <select
          className="evd-filter-select"
          value={filters.custodyState}
          onChange={e => onChange({ ...filters, custodyState: e.target.value as CustodyState | 'ALL' })}
          aria-label="Filter by custody state"
        >
          <option value="ALL">ALL CUSTODY</option>
          <option value="IN_CUSTODY">IN CUSTODY</option>
          <option value="AT_FSL">AT FSL</option>
          <option value="UNDER_EXAMINATION">UNDER EXAMINATION</option>
          <option value="TRANSFERRED">TRANSFERRED</option>
          <option value="RELEASED">RELEASED</option>
          <option value="ARCHIVED">ARCHIVED</option>
        </select>

        <button className="evd-btn-reset" onClick={onReset}>RESET</button>

        <span className="evd-result-count">{resultCount} RECORDS</span>
      </div>
    </div>
  );
}
