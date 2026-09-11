import { Link } from 'react-router-dom';
import './CaseListItem.css';
import type { Case } from '../../types/case';
import CaseStatusBadge from './CaseStatusBadge';

interface CaseListItemProps {
  caseData: Case;
}

export default function CaseListItem({ caseData }: CaseListItemProps) {
  
  return (
    <Link to={`/cases/${caseData.id}`} className="case-list-item" aria-label={`View case ${caseData.id}`}>
      <div className="case-list-item__main">
        <div className="case-list-item__top">
          {caseData.isNew && (
            <span className="case-list-item__new-badge">NEW + {caseData.lastActivity}</span>
          )}
          <span className="case-list-item__id">{caseData.id}</span>
          <h2 className="case-list-item__title">{caseData.title}</h2>
          
          <div className="case-list-item__badges">
            {caseData.attention && caseData.attention !== 'NONE' && (
              <CaseStatusBadge type="attention" value={caseData.attention} label={caseData.attentionDetails} />
            )}
            <CaseStatusBadge type="status" value={caseData.status} />
            <CaseStatusBadge type="priority" value={caseData.priority} />
          </div>
        </div>

        <div className="case-list-item__meta-row">
          <div className="case-meta-group">
            <span className="case-meta-label">DEPT:</span>
            <span className="case-meta-value">{caseData.department}</span>
          </div>
          <div className="case-meta-group">
            <span className="case-meta-label">OFFICER:</span>
            <span className="case-meta-value">{caseData.officer}</span>
          </div>
          <div className="case-meta-group">
            <span className="case-meta-label">DOCS:</span>
            <span className="case-meta-value">{caseData.documentsCount}</span>
          </div>
          <div className="case-meta-group">
            <span className="case-meta-label">EVIDENCE:</span>
            <span className="case-meta-value">{caseData.evidenceCount}</span>
          </div>
          <div className="case-meta-group">
            <span className="case-meta-label">PERSONS:</span>
            <span className="case-meta-value">{caseData.personsCount}</span>
          </div>
        </div>
      </div>

      <div className="case-list-item__action">
        {!caseData.isNew && (
          <div className="case-list-item__time">{caseData.lastActivity}</div>
        )}
        <div className="btn-open-case">OPEN CASE &rarr;</div>
      </div>
    </Link>
  );
}
