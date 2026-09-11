import type { Document } from '../../types/document';
import DocumentListItem from './DocumentListItem';
import './DocumentList.css';

interface DocumentListProps {
  documents: Document[];
}

export default function DocumentList({ documents }: DocumentListProps) {
  if (documents.length === 0) {
    return (
      <div className="cases-page__empty">
        NO DOCUMENTS MATCH CURRENT FILTERS
      </div>
    );
  }

  return (
    <div className="document-list">
      {documents.map(doc => (
        <DocumentListItem key={doc.id} document={doc} />
      ))}
    </div>
  );
}
