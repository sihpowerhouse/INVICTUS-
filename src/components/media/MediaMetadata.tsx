import './MediaPanels.css';
import type { Media } from '../../types/media';

interface MediaMetadataProps {
  media: Media;
}

export default function MediaMetadata({ media }: MediaMetadataProps) {
  function formatDate(iso: string) {
    return new Date(iso).toLocaleString('en-US', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: false
    }).toUpperCase();
  }

  return (
    <div className="media-panel">
      <div className="media-panel__header">
        <h3 className="media-panel__title">MEDIA METADATA</h3>
      </div>
      
      <div className="media-meta__grid">
        <div className="media-meta__item media-meta__item--full">
          <span className="media-meta__label">FILENAME</span>
          <span className="media-meta__value" style={{ fontFamily: 'monospace' }}>{media.filename}</span>
        </div>
        
        <div className="media-meta__item">
          <span className="media-meta__label">TYPE</span>
          <span className="media-meta__value">{media.type}</span>
        </div>
        
        <div className="media-meta__item">
          <span className="media-meta__label">DURATION</span>
          <span className="media-meta__value">{media.durationFormatted}</span>
        </div>
        
        <div className="media-meta__item">
          <span className="media-meta__label">LANGUAGE</span>
          <span className="media-meta__value">{media.language}</span>
        </div>
        
        <div className="media-meta__item">
          <span className="media-meta__label">RECORDED DATE</span>
          <span className="media-meta__value">{formatDate(media.recordedAt)}</span>
        </div>
        
        <div className="media-meta__item media-meta__item--full">
          <span className="media-meta__label">UPLOADED BY</span>
          <span className="media-meta__value">{media.uploadedBy}</span>
        </div>
        
        <div className="media-meta__item media-meta__item--full">
          <span className="media-meta__label">DEPARTMENT</span>
          <span className="media-meta__value">{media.department}</span>
        </div>
      </div>
    </div>
  );
}
