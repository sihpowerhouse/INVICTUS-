import { useState } from 'react';
import { Search } from 'lucide-react';
import Dropdown from '../common/Dropdown';

export default function MediaCommandBar() {
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('ALL');

  return (
    <div className="media-cmd">
      <div style={{ display: 'flex', alignItems: 'center', flex: 1, position: 'relative' }}>
        <Search size={14} style={{ position: 'absolute', left: 12, color: 'var(--text-muted)' }} />
        <input 
          type="text" 
          className="media-cmd__search" 
          placeholder="SEARCH MEDIA BY ID, CASE, FILENAME..." 
          style={{ paddingLeft: 36 }}
        />
      </div>
      
      <div className="media-cmd__filters">
        <Dropdown
          value={typeFilter}
          onChange={setTypeFilter}
          options={[
            { value: 'ALL', label: 'TYPE: ALL' },
            { value: 'AUDIO', label: 'AUDIO' },
            { value: 'VIDEO', label: 'VIDEO' }
          ]}
        />
        
        <Dropdown
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: 'ALL', label: 'STATUS: ALL' },
            { value: 'UNPROCESSED', label: 'UNPROCESSED' },
            { value: 'PROCESSING', label: 'PROCESSING' },
            { value: 'READY', label: 'READY' },
            { value: 'FLAGGED', label: 'FLAGGED' }
          ]}
        />
        
        <Dropdown
          value={dateFilter}
          onChange={setDateFilter}
          options={[
            { value: 'ALL', label: 'DATE: ANY' },
            { value: 'TODAY', label: 'TODAY' },
            { value: 'WEEK', label: 'LAST 7 DAYS' },
            { value: 'MONTH', label: 'LAST 30 DAYS' }
          ]}
        />
      </div>
    </div>
  );
}
