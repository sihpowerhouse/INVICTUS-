import { motion, useReducedMotion, type Variants } from 'framer-motion';
import './IntelligenceTimelinePage.css';

interface IntelligenceTimelinePageProps {
  isEmbedded?: boolean;
}

export default function IntelligenceTimelinePage({ isEmbedded = false }: IntelligenceTimelinePageProps = {}) {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: shouldReduceMotion ? 0 : 0.05 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <motion.div 
      className="intel-timeline-page"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {!isEmbedded && (
        <motion.div className="intel-timeline-page__header" variants={itemVariants}>
          <p className="page-tag">INVICTUS / TIMELINE</p>
          <h1 className="page-title">GLOBAL TIMELINE</h1>
        </motion.div>
      )}

      <div className="intel-timeline-page__layout">
        <main className="intel-timeline-main" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '50vh', textAlign: 'center'}}>
          <motion.div 
            className="intelligence-loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ marginBottom: '1rem', color: 'var(--color-text-secondary)', fontSize: '14px', letterSpacing: '0.1em' }}
          >
            DOCUMENT ACTIVITY UNAVAILABLE
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ color: 'var(--color-text-tertiary)', fontSize: '13px' }}
          >
            Select a document from the registry to inspect its real lifecycle.
          </motion.p>
        </main>
      </div>
    </motion.div>
  );
}
