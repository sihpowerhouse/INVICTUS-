import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion, type Variants } from 'framer-motion';
import './CasesPage.css';
import type { Case } from '../types/case';
import { caseService } from '../services/caseService';
import CaseCommandBar, { type CaseFiltersState } from '../components/cases/CaseCommandBar';
import CaseSavedViews from '../components/cases/CaseSavedViews';
import CaseResultSummary from '../components/cases/CaseResultSummary';
import CaseGroup from '../components/cases/CaseGroup';
import CaseListItem from '../components/cases/CaseListItem';

export default function CasesPage() {
  const [cases, setCases] = useState<Case[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedCaseId, setExpandedCaseId] = useState<string | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const initialFilters: CaseFiltersState = {
    searchQuery: '',
    priority: 'ALL',
    status: 'ALL',
    department: 'ALL',
    officer: 'ALL',
    sort: 'RECENTLY_UPDATED'
  };

  const [filters, setFilters] = useState<CaseFiltersState>(initialFilters);

  useEffect(() => {
    let mounted = true;
    
    caseService.getCases().then(data => {
      if (mounted) {
        setCases(data);
        setIsLoading(false);
      }
    });

    return () => { mounted = false; };
  }, []);

  const handleApplyView = (overrides: Partial<CaseFiltersState>) => {
    setFilters(prev => ({ ...prev, ...overrides }));
  };

  const handleReset = () => {
    setFilters(initialFilters);
  };

  // Filter & Sort Logic
  const processedCases = useMemo(() => {
    let filtered = cases.filter(c => {
      if (filters.priority !== 'ALL' && c.priority !== filters.priority) return false;
      if (filters.status !== 'ALL' && c.status !== filters.status) return false;
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        return c.id.toLowerCase().includes(q) || c.title.toLowerCase().includes(q);
      }
      return true;
    });

    filtered.sort((a, b) => {
      if (filters.sort === 'NEWEST') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (filters.sort === 'OLDEST') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (filters.sort === 'PRIORITY') {
        const priorities = { 'CRITICAL': 4, 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
        return priorities[b.priority] - priorities[a.priority];
      }
      if (filters.sort === 'CASE_ID') return a.id.localeCompare(b.id);
      // Default: RECENTLY_UPDATED
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

    return filtered;
  }, [cases, filters]);

  // Grouping Logic
  const groupedCases = useMemo(() => {
    const groups: Record<string, Case[]> = {
      TODAY: [],
      YESTERDAY: [],
      'THIS WEEK': [],
      OLDER: []
    };

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    processedCases.forEach(c => {
      const d = new Date(c.updatedAt);
      if (d >= today) {
        groups.TODAY.push(c);
      } else if (d >= yesterday && d < today) {
        groups.YESTERDAY.push(c);
      } else if (d >= lastWeek && d < yesterday) {
        groups['THIS WEEK'].push(c);
      } else {
        groups.OLDER.push(c);
      }
    });

    return groups;
  }, [processedCases]);

  const toggleExpand = (caseId: string) => {
    setExpandedCaseId(prev => prev === caseId ? null : caseId);
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
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as any } }
  };

  return (
    <motion.div 
      className="cases-page"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div className="cases-page__header" variants={itemVariants}>
        <div className="cases-page__title-group">
          <p className="page-tag">INVICTUS / REGISTRY</p>
          <h1 className="cases-page__title">CASE OPERATIONS</h1>
        </div>
        <div className="cases-page__actions">
          <button className="btn-primary">+ NEW CASE</button>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <CaseCommandBar 
          filters={filters}
          onChange={setFilters}
          onReset={handleReset}
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <CaseSavedViews 
          currentFilters={filters}
          onApplyView={handleApplyView}
        />
      </motion.div>

      {!isLoading && (
        <motion.div variants={itemVariants}>
          <CaseResultSummary 
            totalCount={processedCases.length} 
            filters={filters} 
          />
        </motion.div>
      )}

      {isLoading ? (
        <div className="cases-page__loading">LOADING REGISTRY...</div>
      ) : processedCases.length === 0 ? (
        <div className="cases-page__empty">NO CASES MATCH CURRENT FILTERS</div>
      ) : (
        <motion.div className="cases-page__registry" variants={itemVariants}>
          <div className="cases-list-header">
            <div className="cases-header-col">CASE ID</div>
            <div className="cases-header-col">TITLE</div>
            <div className="cases-header-col">STATUS</div>
            <div className="cases-header-col">PRIORITY</div>
            <div className="cases-header-col cases-header-col--owner">OWNER / DEPT</div>
            <div className="cases-header-col cases-header-col--right">ACTIVITY</div>
            <div className="cases-header-col cases-header-col--center">ACTION</div>
          </div>
          
          <div className="cases-page__groups">
            <AnimatePresence mode="popLayout">
              {Object.entries(groupedCases).map(([groupName, groupCases]) => {
                if (groupCases.length === 0) return null;
                return (
                  <motion.div 
                    key={groupName}
                    layout={!shouldReduceMotion}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <CaseGroup title={groupName}>
                      <AnimatePresence mode="popLayout">
                        {groupCases.map(c => (
                          <motion.div 
                            key={c.id}
                            layout={!shouldReduceMotion}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <CaseListItem 
                              caseData={c} 
                              isExpanded={expandedCaseId === c.id}
                              onToggle={() => toggleExpand(c.id)}
                            />
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </CaseGroup>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
