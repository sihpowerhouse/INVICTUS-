import './CaseList.css';
import type { Case } from '../../types/case';
import CaseListItem from './CaseListItem';

interface CaseListProps {
  cases: Case[];
  isLoading?: boolean;
}

export default function CaseList({ cases, isLoading }: CaseListProps) {
  if (isLoading) {
    return <div className="case-list-empty">LOADING CASES...</div>;
  }

  if (cases.length === 0) {
    return <div className="case-list-empty">NO CASES FOUND</div>;
  }

  return (
    <div className="case-list">
      {cases.map(c => (
        <CaseListItem key={c.id} caseData={c} />
      ))}
    </div>
  );
}
