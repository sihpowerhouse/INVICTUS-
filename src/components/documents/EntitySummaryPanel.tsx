import type { DocumentEntity } from '../../types/extraction';
import './EntitySummaryPanel.css';

interface EntitySummaryPanelProps {
  entities: DocumentEntity[];
}

export default function EntitySummaryPanel({ entities }: EntitySummaryPanelProps) {
  const names = entities.filter(e => e.type === 'NAME');
  const locations = entities.filter(e => e.type === 'LOCATION');
  const dates = entities.filter(e => e.type === 'DATE');

  return (
    <div className="data-panel">
      <div className="data-panel-header">
        <h3 className="data-panel-title">ENTITY SUMMARY</h3>
      </div>
      <div className="data-panel-content entity-summary-panel">
        <div className="entity-counts">
          <div className="entity-count-item">
            <span className="entity-count-label">NAMES</span>
            <span className="entity-count-value name">{names.length.toString().padStart(2, '0')}</span>
          </div>
          <div className="entity-count-item">
            <span className="entity-count-label">LOCATIONS</span>
            <span className="entity-count-value location">{locations.length.toString().padStart(2, '0')}</span>
          </div>
          <div className="entity-count-item">
            <span className="entity-count-label">DATES</span>
            <span className="entity-count-value date">{dates.length.toString().padStart(2, '0')}</span>
          </div>
        </div>
        
        <div className="entity-list">
          {entities.map(entity => (
            <div key={entity.id} className={`entity-tag ${entity.type}`}>
              <span>{entity.text}</span>
              <span className="entity-tag-confidence">{entity.confidence}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
