import { Search } from 'lucide-react';

export default function MediaCommandBar() {
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
        <select className="media-cmd__select" defaultValue="ALL" aria-label="Filter by Type">
          <option value="ALL">TYPE: ALL</option>
          <option value="AUDIO">AUDIO</option>
          <option value="VIDEO">VIDEO</option>
        </select>
        
        <select className="media-cmd__select" defaultValue="ALL" aria-label="Filter by Status">
          <option value="ALL">STATUS: ALL</option>
          <option value="UNPROCESSED">UNPROCESSED</option>
          <option value="PROCESSING">PROCESSING</option>
          <option value="READY">READY</option>
          <option value="FLAGGED">FLAGGED</option>
        </select>
        
        <select className="media-cmd__select" defaultValue="ALL" aria-label="Filter by Date">
          <option value="ALL">DATE: ANY</option>
          <option value="TODAY">TODAY</option>
          <option value="WEEK">LAST 7 DAYS</option>
          <option value="MONTH">LAST 30 DAYS</option>
        </select>
      </div>
    </div>
  );
}
