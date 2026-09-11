import './LocationsPanel.css';
// Reusing data-panel classes
import './PersonsPanel.css';
import type { CaseLocation } from '../../types/case';

interface LocationsPanelProps {
  locations?: CaseLocation[];
}

export default function LocationsPanel({ locations = [] }: LocationsPanelProps) {
  return (
    <div className="data-panel">
      <div className="data-panel-header">
        <h3 className="data-panel-title">LOCATIONS</h3>
      </div>
      <div className="data-panel-content">
        {locations.length === 0 ? (
          <div className="data-list-empty">NO LOCATIONS RECORDED</div>
        ) : (
          <div className="data-list">
            {locations.map(loc => (
              <div key={loc.id} className="locations-grid">
                <div className="location-name">{loc.location}</div>
                <div className="location-type">{loc.type}</div>
                <div className="location-ref">{loc.reference}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
