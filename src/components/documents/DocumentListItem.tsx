import { Link } from 'react-router-dom';
import type { Document } from '../../types/document';
import './DocumentListItem.css';

interface DocumentListItemProps {
  document: Document;
}

export default function DocumentListItem({ document: doc }: DocumentListItemProps) {
  
  const statusClass = `doc-badge--status-${doc.status.toLowerCase()}`;
  
  // Format date to something readable for demo purposes
  const formattedDate = new Date(doc.updatedAt).toLocaleDateString(undefined, {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return (
    <Link to={`/documents/${doc.id}`} className="doc-list-item" aria-label={`View document ${doc.name}`}>
      <div className="doc-list-item__main">
        <div className="doc-list-item__top">
          <h2 className="doc-list-item__name">{doc.name}</h2>
          
          <div className="doc-list-item__badges">
            <span className="doc-badge doc-badge--type">{doc.type.replace('_', ' ')}</span>
            <span className="doc-badge doc-badge--case">{doc.caseId}</span>
            <span className={`doc-badge ${statusClass}`}>{doc.status.replace('_', ' ')}</span>
          </div>
        </div>

        <div className="doc-list-item__meta-row">
          <div className="doc-meta-group">
            <span className="doc-meta-label">VERSION:</span>
            <span className="doc-meta-value">{doc.version}</span>
          </div>
          <div className="doc-meta-group">
            <span className="doc-meta-label">LANGUAGE:</span>
            <span className="doc-meta-value">{doc.language}</span>
          </div>
          <div className="doc-meta-group">
            <span className="doc-meta-label">SIZE:</span>
            <span className="doc-meta-value">{doc.size}</span>
          </div>
          <div className="doc-meta-group">
            <span className="doc-meta-label">UPLOADED BY:</span>
            <span className="doc-meta-value">{doc.uploadedBy}</span>
          </div>
        </div>
      </div>

      <div className="doc-list-item__action">
        <div className="doc-list-item__time">{formattedDate}</div>
        <div className="btn-open-case">OPEN &rarr;</div>
      </div>
    </Link>
  );
}
