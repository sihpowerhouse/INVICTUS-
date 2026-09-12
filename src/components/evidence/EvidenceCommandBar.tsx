import './EvidenceCommandBar.css';
import type { EvidenceType, EvidenceStatus, CustodyState } from '../../types/evidence';
import Dropdown from '../common/Dropdown';

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
        <Dropdown
          value={filters.type}
          onChange={val => onChange({ ...filters, type: val as EvidenceType | 'ALL' })}
          options={[
            { value: 'ALL', label: 'ALL TYPES' },
            { value: 'DIGITAL_DOCUMENT', label: 'DIGITAL DOCUMENT' },
            { value: 'IMAGE', label: 'IMAGE' },
            { value: 'VIDEO', label: 'VIDEO' },
            { value: 'AUDIO', label: 'AUDIO' },
            { value: 'DEVICE', label: 'DEVICE' },
            { value: 'PHYSICAL_RECORD', label: 'PHYSICAL RECORD' },
            { value: 'FORENSIC_SAMPLE', label: 'FORENSIC SAMPLE' },
            { value: 'OTHER', label: 'OTHER' }
          ]}
          className="evd-filter-select"
        />

        <Dropdown
          value={filters.status}
          onChange={val => onChange({ ...filters, status: val as EvidenceStatus | 'ALL' })}
          options={[
            { value: 'ALL', label: 'ALL STATUS' },
            { value: 'REGISTERED', label: 'REGISTERED' },
            { value: 'IN_CUSTODY', label: 'IN CUSTODY' },
            { value: 'UNDER_EXAMINATION', label: 'UNDER EXAMINATION' },
            { value: 'TRANSFERRED', label: 'TRANSFERRED' },
            { value: 'VERIFIED', label: 'VERIFIED' },
            { value: 'REQUIRES_REVIEW', label: 'REQUIRES REVIEW' },
            { value: 'ARCHIVED', label: 'ARCHIVED' }
          ]}
          className="evd-filter-select"
        />

        <Dropdown
          value={filters.custodyState}
          onChange={val => onChange({ ...filters, custodyState: val as CustodyState | 'ALL' })}
          options={[
            { value: 'ALL', label: 'ALL CUSTODY' },
            { value: 'IN_CUSTODY', label: 'IN CUSTODY' },
            { value: 'AT_FSL', label: 'AT FSL' },
            { value: 'UNDER_EXAMINATION', label: 'UNDER EXAMINATION' },
            { value: 'TRANSFERRED', label: 'TRANSFERRED' },
            { value: 'RELEASED', label: 'RELEASED' },
            { value: 'ARCHIVED', label: 'ARCHIVED' }
          ]}
          className="evd-filter-select"
        />

        <button className="evd-btn-reset" onClick={onReset}>RESET</button>

        <span className="evd-result-count">{resultCount} RECORDS</span>
      </div>
    </div>
  );
}
