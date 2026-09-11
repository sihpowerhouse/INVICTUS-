import { useNavigate } from 'react-router-dom';
import type { Media } from '../../types/media';

interface MediaListProps {
  items: Media[];
}

export default function MediaList({ items }: MediaListProps) {
  const navigate = useNavigate();

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-US', {
      day: '2-digit', month: 'short', year: 'numeric'
    }).toUpperCase();
  }

  return (
    <div className="media-list">
      <div className="media-list__header">
        <div className="media-list__col">MEDIA ID</div>
        <div className="media-list__col">FILENAME</div>
        <div className="media-list__col">CASE</div>
        <div className="media-list__col">TYPE</div>
        <div className="media-list__col">DURATION</div>
        <div className="media-list__col">STATUS</div>
        <div className="media-list__col">LAST ACTIVITY</div>
      </div>
      
      <div className="media-list__body" role="list">
        {items.length === 0 ? (
          <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
            NO MEDIA RECORDS FOUND
          </div>
        ) : (
          items.map(media => (
            <div 
              key={media.id} 
              className="media-item"
              role="listitem"
              tabIndex={0}
              onClick={() => navigate(`/media/${media.id}`)}
              onKeyDown={e => e.key === 'Enter' && navigate(`/media/${media.id}`)}
            >
              <div className="media-item__id">{media.id}</div>
              <div className="media-item__title" title={media.filename}>{media.filename}</div>
              <div className="media-item__case">{media.caseId}</div>
              <div>
                <span className="media-badge media-badge--type">{media.type}</span>
              </div>
              <div className="media-item__duration">{media.durationFormatted}</div>
              <div>
                <span className={`media-badge media-badge--status-${media.status.toLowerCase()}`}>
                  {media.status}
                </span>
              </div>
              <div className="media-item__date">{formatDate(media.lastActivityAt)}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
