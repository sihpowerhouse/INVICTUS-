import { useState, useEffect } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import './MediaPage.css';
import type { Media } from '../types/media';
import { mediaService } from '../services/mediaService';
import MediaCommandBar from '../components/media/MediaCommandBar';
import MediaList from '../components/media/MediaList';

interface MediaPageProps {
  isEmbedded?: boolean;
}

export default function MediaPage({ isEmbedded = false }: MediaPageProps = {}) {
  const [items, setItems] = useState<Media[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const shouldReduceMotion = useReducedMotion();

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
      className="media-page"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {!isEmbedded && (
        <motion.div className="media-page__header" variants={itemVariants}>
          <h1 className="media-page__title">MEDIA EVIDENCE</h1>
          <div className="media-page__subtitle">INVICTUS / MEDIA INTELLIGENCE</div>
        </motion.div>
      )}

      <motion.div variants={itemVariants}>
        <MediaCommandBar />
      </motion.div>

      {isLoading ? (
        <motion.div style={{ padding: '64px', textAlign: 'center', color: 'var(--text-muted)' }} variants={itemVariants}>
          LOADING MEDIA ARCHIVES...
        </motion.div>
      ) : (
        <MediaList items={items} itemVariants={itemVariants} />
      )}
    </motion.div>
  );
}
