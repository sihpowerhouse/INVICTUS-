import { useState, useEffect } from 'react';
import { motion, useReducedMotion, type Variants, AnimatePresence } from 'framer-motion';
import './IntelligenceInconsistenciesPage.css';
import { intelligenceService } from '../services/intelligenceService';
import type { PotentialInconsistency, Entity } from '../types/intelligence';

import InconsistencyCard from '../components/intelligence/InconsistencyCard';
import EntityPanel from '../components/intelligence/EntityPanel';

export default function IntelligenceInconsistenciesPage() {
  const [inconsistencies, setInconsistencies] = useState<PotentialInconsistency[]>([]);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    let mounted = true;
    
    Promise.all([
      intelligenceService.getInconsistencies('CAS-26190'),
      intelligenceService.getEntities('CAS-26190')
    ]).then(([incData, entData]) => {
      if (mounted) {
        setInconsistencies(incData);
        setEntities(entData);
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
      className="intel-inconsistencies-page"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div className="intel-inconsistencies-page__header" variants={itemVariants}>
        <p className="page-tag">INVICTUS / INTELLIGENCE / CAS-26190</p>
        <h1 className="page-title">POTENTIAL INCONSISTENCIES</h1>
      </motion.div>

      <div className="intel-inconsistencies-page__layout">
        <main className="intel-inconsistencies-main">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div 
                key="loading" 
                className="intelligence-loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                ANALYZING CONFLICTS...
              </motion.div>
            ) : inconsistencies.length === 0 ? (
              <motion.div 
                key="empty" 
                className="intelligence-empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                NO INCONSISTENCIES FOUND
              </motion.div>
            ) : (
              <motion.div 
                key="list"
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="intel-inconsistencies-list"
              >
                {inconsistencies.map(inc => (
                  <motion.div key={inc.id} variants={itemVariants}>
                    <InconsistencyCard inconsistency={inc} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <AnimatePresence mode="wait">
          <motion.aside 
            className="intel-inconsistencies-sidebar"
            key="sidebar"
            initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 20 }}
            animate={{ opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } }}
          >
            {isLoading ? (
              <div className="intelligence-loading">EXTRACTING ENTITIES...</div>
            ) : (
              <EntityPanel entities={entities} />
            )}
          </motion.aside>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
