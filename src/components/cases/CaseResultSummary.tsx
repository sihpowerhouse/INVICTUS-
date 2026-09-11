import './CaseResultSummary.css';
import type { CaseFiltersState } from './CaseCommandBar';

interface CaseResultSummaryProps {
  totalCount: number;
  filters: CaseFiltersState;
}

export default function CaseResultSummary({ totalCount, filters }: CaseResultSummaryProps) {
  
  // Construct a readable string for the active filters
  let filterString = '';
  if (filters.priority !== 'ALL') filterString += `${filters.priority.toLowerCase()} `;
  if (filters.status !== 'ALL') filterString += `${filters.status.toLowerCase()} `;
  if (!filterString) filterString = 'all ';
  
  filterString += 'cases';

  if (filters.searchQuery) {
    filterString += ` matching "${filters.searchQuery}"`;
  }

  return (
    <div className="case-result-summary">
      <span className="case-result-summary__count">{totalCount} CASES</span>
      <span className="case-result-summary__meta">Showing: {filterString}</span>
    </div>
  );
}
