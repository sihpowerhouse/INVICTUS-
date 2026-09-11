import './MediaPanels.css';
import type { ImportantMoment } from '../../types/media';

interface ImportantMomentsProps {
  moments: ImportantMoment[];
  onTimeSelect: (timeMs: number) => void;
}

export default function ImportantMoments({ moments, onTimeSelect }: ImportantMomentsProps) {
  return (
    <div className="media-panel">
      <div className="media-panel__header">
        <h3 className="media-panel__title">IMPORTANT MOMENTS</h3>
      </div>
      
      {moments.length === 0 ? (
        <p className="media-panel__empty">NO KEY MOMENTS IDENTIFIED</p>
      ) : (
        <div className="media-moments__list" role="list">
          {moments.map(m => (
            <div 
              key={m.id} 
              className="media-moment"
              role="listitem"
              tabIndex={0}
              onClick={() => onTimeSelect(m.timestampMs)}
              onKeyDown={(e) => e.key === 'Enter' && onTimeSelect(m.timestampMs)}
            >
              <span className="media-moment__time">{m.timestamp}</span>
              <span className="media-moment__title">{m.title}</span>
              {m.description && <span className="media-moment__desc">{m.description}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
