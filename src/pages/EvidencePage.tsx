import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import './EvidencePage.css';
import type { Evidence } from '../types/evidence';
import { evidenceService } from '../services/evidenceService';
import EvidenceCommandBar, { type EvidenceFiltersState } from '../components/evidence/EvidenceCommandBar';
import EvidenceList from '../components/evidence/EvidenceList';

const INITIAL_FILTERS: EvidenceFiltersState = {
  searchQuery: '',
  type: 'ALL',
  status: 'ALL',
  custodyState: 'ALL',
};

export default function EvidencePage() {
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<EvidenceFiltersState>(INITIAL_FILTERS);

  useEffect(() => {
    let mounted = true;
    evidenceService.getEvidence().then(data => {
      if (mounted) {
        setEvidence(data);
        setIsLoading(false);
      }
    });
    return () => { mounted = false; };
  }, []);

  const processed = useMemo(() => {
    return evidence
      .filter(e => {
        if (filters.type !== 'ALL' && e.type !== filters.type) return false;
        if (filters.status !== 'ALL' && e.status !== filters.status) return false;
        if (filters.custodyState !== 'ALL' && e.custodyState !== filters.custodyState) return false;
        if (filters.searchQuery) {
          const q = filters.searchQuery.toLowerCase();
          return (
            e.id.toLowerCase().includes(q) ||
            e.title.toLowerCase().includes(q) ||
            e.caseId.toLowerCase().includes(q) ||
            e.currentHolder.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => new Date(b.lastActivityAt).getTime() - new Date(a.lastActivityAt).getTime());
  }, [evidence, filters]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 5 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <motion.div 
      className="evidence-page"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div className="evidence-page__header" variants={itemVariants}>
        <div className="evidence-page__title-group">
          <p className="page-tag">INVICTUS / EVIDENCE INTELLIGENCE</p>
          <h1 className="evidence-page__title">EVIDENCE VAULT</h1>
        </div>
        <div>
          <button className="btn-primary">+ REGISTER EVIDENCE</button>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <EvidenceCommandBar
          filters={filters}
          resultCount={processed.length}
          onChange={setFilters}
          onReset={() => setFilters(INITIAL_FILTERS)}
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        {isLoading ? (
          <div className="evidence-page__loading">LOADING SECURE VAULT...</div>
        ) : (
          <EvidenceList evidence={processed} />
        )}
      </motion.div>
    </motion.div>
  );
}
