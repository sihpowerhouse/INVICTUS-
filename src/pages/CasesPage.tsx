import { useState, useEffect, useMemo } from 'react';
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

  return (
    <div className="cases-page">
      <div className="cases-page__header">
        <div className="cases-page__title-group">
          <p className="page-tag">INVICTUS / REGISTRY</p>
          <h1 className="cases-page__title">CASE OPERATIONS</h1>
        </div>
        <div className="cases-page__actions">
          <button className="btn-primary">+ NEW CASE</button>
        </div>
      </div>

      <CaseCommandBar 
        filters={filters}
        onChange={setFilters}
        onReset={handleReset}
      />

      <CaseSavedViews 
        currentFilters={filters}
        onApplyView={handleApplyView}
      />

      {!isLoading && (
        <CaseResultSummary 
          totalCount={processedCases.length} 
          filters={filters} 
        />
      )}

      {isLoading ? (
        <div className="cases-page__loading">LOADING REGISTRY...</div>
      ) : processedCases.length === 0 ? (
        <div className="cases-page__empty">NO CASES MATCH CURRENT FILTERS</div>
      ) : (
        <div className="cases-page__groups">
          {Object.entries(groupedCases).map(([groupName, groupCases]) => {
            if (groupCases.length === 0) return null;
            return (
              <CaseGroup key={groupName} title={groupName}>
                {groupCases.map(c => (
                  <CaseListItem key={c.id} caseData={c} />
                ))}
              </CaseGroup>
            );
          })}
        </div>
      )}
    </div>
  );
}
