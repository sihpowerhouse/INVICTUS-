import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import './MediaDetailsPage.css';
import type { Media } from '../types/media';
import { mediaService } from '../services/mediaService';

import MediaViewer from '../components/media/MediaViewer';
import TranscriptPanel from '../components/media/TranscriptPanel';
import MediaMetadata from '../components/media/MediaMetadata';
import ImportantMoments from '../components/media/ImportantMoments';
import RelatedEvidence from '../components/media/RelatedEvidence';

export default function MediaDetailsPage() {
  const { mediaId } = useParams<{ mediaId: string }>();
  const navigate = useNavigate();
  const [media, setMedia] = useState<Media | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const shouldReduceMotion = useReducedMotion();

  // Playback state
  const [currentTimeMs, setCurrentTimeMs] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!mediaId) return;

    let mounted = true;
    mediaService.getMediaById(mediaId).then(data => {
      if (mounted) {
        setMedia(data || null);
        setIsLoading(false);
        setCurrentTimeMs(0);
        setIsPlaying(false);
      }
    });

    return () => { mounted = false; };
  }, [mediaId]);

  if (isLoading) {
    return <div style={{ padding: '64px', textAlign: 'center', color: 'var(--text-muted)' }}>LOADING SECURE MEDIA RECORD...</div>;
  }

  if (!media) {
    return (
      <div className="media-details-page">
        <div className="media-not-found">
          <h3 style={{ color: 'var(--text-muted)' }}>MEDIA RECORD NOT FOUND</h3>
          <button className="btn-primary" onClick={() => navigate('/media')} style={{ marginTop: '16px' }}>
            RETURN TO MEDIA INTELLIGENCE
          </button>
        </div>
      </div>
    );
  }

  const handleTimeSelect = (timeMs: number) => {
    setCurrentTimeMs(timeMs);
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.05
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  return (
    <motion.div 
      className="media-details-page"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div className="media-details__header" variants={itemVariants}>
        <div className="media-details__title-area">
          <p className="page-tag" style={{ cursor: 'pointer' }} onClick={() => navigate('/media')}>
            &larr; BACK TO MEDIA INTELLIGENCE
          </p>
          <h1 className="media-details__title">{media.title}</h1>
          <div className="media-details__badges">
            <span className="media-details__badge">{media.id}</span>
            <span 
              className="media-details__badge media-details__badge--case"
              onClick={() => navigate(`/cases/${media.caseId}`)}
              role="link"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && navigate(`/cases/${media.caseId}`)}
            >
              {media.caseId} ↗
            </span>
            <span className="media-details__badge">{media.type}</span>
            <span className={`media-details__badge media-details__badge--status-${media.status.toLowerCase()}`}>
              {media.status}
            </span>
          </div>
        </div>
      </motion.div>

      <div className="media-details__content">
        <div className="media-details__main">
          <motion.div variants={itemVariants}>
            <MediaViewer 
              type={media.type}
              durationMs={media.duration}
              currentTimeMs={currentTimeMs}
              isPlaying={isPlaying}
              playbackSpeed={playbackSpeed}
              onTimeChange={setCurrentTimeMs}
              onPlayPause={setIsPlaying}
              onSpeedChange={setPlaybackSpeed}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <TranscriptPanel 
              lines={media.transcript}
              currentTimeMs={currentTimeMs}
              onTimeSelect={handleTimeSelect}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </motion.div>
        </div>
        
        <div className="media-details__sidebar">
          <motion.div variants={itemVariants}>
            <ImportantMoments 
              moments={media.importantMoments}
              onTimeSelect={handleTimeSelect}
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <MediaMetadata media={media} />
          </motion.div>
          <motion.div variants={itemVariants}>
            <RelatedEvidence 
              caseIds={media.relatedCaseIds}
              evidenceIds={media.relatedEvidenceIds}
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
