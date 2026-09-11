import { useState, useEffect } from 'react';
import './MediaPage.css';
import type { Media } from '../types/media';
import { mediaService } from '../services/mediaService';
import MediaCommandBar from '../components/media/MediaCommandBar';
import MediaList from '../components/media/MediaList';

export default function MediaPage() {
  const [items, setItems] = useState<Media[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    mediaService.getMedia().then(data => {
      if (mounted) {
        setItems(data);
        setIsLoading(false);
      }
    });
    return () => { mounted = false; };
  }, []);

  return (
    <div className="media-page">
      <div className="media-page__header">
        <h1 className="media-page__title">MEDIA EVIDENCE</h1>
        <div className="media-page__subtitle">INVICTUS / MEDIA INTELLIGENCE</div>
      </div>

      <MediaCommandBar />

      {isLoading ? (
        <div style={{ padding: '64px', textAlign: 'center', color: 'var(--text-muted)' }}>
          LOADING MEDIA ARCHIVES...
        </div>
      ) : (
        <MediaList items={items} />
      )}
    </div>
  );
}
