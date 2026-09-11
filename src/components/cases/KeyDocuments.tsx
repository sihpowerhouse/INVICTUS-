import './KeyDocuments.css';
import './PersonsPanel.css'; // Reusing data-panel classes
import type { CaseDocument } from '../../types/case';
import { FileText } from 'lucide-react';

interface KeyDocumentsProps {
  documents?: CaseDocument[];
}

export default function KeyDocuments({ documents = [] }: KeyDocumentsProps) {
  return (
    <div className="data-panel">
      <div className="data-panel-header">
        <h3 className="data-panel-title">KEY DOCUMENTS</h3>
      </div>
      <div className="data-panel-content">
        {documents.length === 0 ? (
          <div className="data-list-empty">NO DOCUMENTS ATTACHED</div>
        ) : (
          <div className="data-list">
            {documents.map(doc => (
              <div key={doc.id} className="docs-grid">
                <div className="doc-name">
                  <FileText size={14} style={{ color: 'var(--text-muted)' }} />
                  {doc.name}
                  <span className="doc-type">{doc.type}</span>
                </div>
                <div className="doc-version">{doc.version}</div>
                <div className="doc-status" data-status={doc.status}>{doc.status}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
