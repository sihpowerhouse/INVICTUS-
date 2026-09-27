import './Intelligence.css';
import type { Entity } from '../../types/intelligence';

interface EntityPanelProps {
  entities: Entity[];
}

export default function EntityPanel({ entities }: EntityPanelProps) {
  // Group entities by type
  const grouped = entities.reduce((acc, entity) => {
    if (!acc[entity.type]) acc[entity.type] = [];
    acc[entity.type].push(entity);
    return acc;
  }, {} as Record<string, Entity[]>);

  const types = Object.keys(grouped).sort();

  return (
    <div className="intel-panel-shell" style={{ padding: '24px' }}>
      <div className="intel-panel__header">
        <h3 className="intel-panel__title">EXTRACTED ENTITIES</h3>
      </div>
      
      {types.length === 0 ? (
        <div className="intel-empty-state">NO ENTITIES DETECTED</div>
      ) : (
        <div className="intel-entities-list">
          {types.map(type => (
            <div key={type} className="intel-entity-group">
              <span className="intel-label">{type}</span>
              <div className="intel-entity-items">
                {grouped[type].map(entity => (
                  <div key={entity.id} className="intel-entity-item">
                    <span className="intel-entity-name">{entity.name}</span>
                    <span className="intel-entity-count">{entity.relatedIds.length} ref</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
