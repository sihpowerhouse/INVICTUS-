import { useState, useEffect } from 'react';
import { motion, useReducedMotion, type Variants, AnimatePresence } from 'framer-motion';
import './IntelligenceTimelinePage.css';
import { intelligenceService } from '../services/intelligenceService';
import type { TimelineEvent } from '../types/intelligence';

import IntelligenceTimeline from '../components/intelligence/IntelligenceTimeline';

export default function IntelligenceTimelinePage() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    let mounted = true;
    intelligenceService.getTimeline('CAS-26190').then(data => {
      if (mounted) {
        setEvents(data);
        setIsLoading(false);
      }
    });
    return () => { mounted = false; };
  }, []);

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
      <motion.div className="intel-timeline-page__header" variants={itemVariants}>
        <p className="page-tag">INVICTUS / INTELLIGENCE / CAS-26190</p>
        <h1 className="page-title">CASE TIMELINE</h1>
      </motion.div>

      <div className="intel-timeline-page__layout">
        <main className="intel-timeline-main">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div 
                key="loading"
                className="intelligence-loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                RECONSTRUCTING TIMELINE...
              </motion.div>
            ) : (
              <motion.div 
                key="timeline"
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }}
              >
                <IntelligenceTimeline events={events} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </motion.div>
  );
}
