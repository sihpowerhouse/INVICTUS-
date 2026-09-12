import { useState } from 'react';
import Dropdown from '../common/Dropdown';
import './Intelligence.css';

interface SearchFiltersProps {
  onFilterChange: (filters: any) => void;
}

export default function SearchFilters({ onFilterChange }: SearchFiltersProps) {
  const [caseFilter, setCaseFilter] = useState('');
  const [docFilter, setDocFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  // Mock filters UI. In a real implementation, this would manage complex state.
  return (
    <div className="intel-filters">
      <div className="intel-filters__header">
        <span className="intel-filters__title">FILTERS</span>
        <button className="intel-filters__reset" onClick={() => onFilterChange({})}>RESET</button>
      </div>
      
      <div className="intel-filters__group" style={{ marginBottom: '16px' }}>
        <Dropdown
          label="CASE"
          value={caseFilter}
          onChange={setCaseFilter}
          options={[
            { value: '', label: 'ALL CASES' },
            { value: 'CAS-26190', label: 'OPERATION ORION' },
            { value: 'CAS-26191', label: 'NIGHTFALL' }
          ]}
        />
      </div>

      <div className="intel-filters__group" style={{ marginBottom: '16px' }}>
        <Dropdown
          label="DOCUMENT TYPE"
          value={docFilter}
          onChange={setDocFilter}
          options={[
            { value: '', label: 'ALL TYPES' },
            { value: 'REPORT', label: 'REPORT' },
            { value: 'STATEMENT', label: 'STATEMENT' },
            { value: 'TRANSCRIPT', label: 'TRANSCRIPT' }
          ]}
        />
      </div>

      <div className="intel-filters__group" style={{ marginBottom: '16px' }}>
        <Dropdown
          label="DEPARTMENT"
          value={deptFilter}
          onChange={setDeptFilter}
          options={[
            { value: '', label: 'ALL DEPARTMENTS' },
            { value: 'FORENSICS', label: 'FORENSICS' },
            { value: 'CYBER', label: 'CYBER' },
            { value: 'FIELD', label: 'FIELD OPERATIONS' }
          ]}
        />
      </div>
      
      <div className="intel-filters__group">
        <Dropdown
          label="DATE RANGE"
          value={dateFilter}
          onChange={setDateFilter}
          options={[
            { value: '', label: 'ANY TIME' },
            { value: '24H', label: 'LAST 24 HOURS' },
            { value: '7D', label: 'LAST 7 DAYS' },
            { value: '30D', label: 'LAST 30 DAYS' }
          ]}
        />
      </div>
    </div>
  );
}
