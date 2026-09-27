import './KeyDocuments.css';
import './PersonsPanel.css'; // Reusing data-panel classes
import type { CaseDocument } from '../../types/case';
import { FileText, Upload } from 'lucide-react';

interface KeyDocumentsProps {
  documents?: CaseDocument[];
  onUploadClick?: () => void;
  onDocumentClick?: (documentId: string) => void;
}

export default function KeyDocuments({ documents = [], onUploadClick, onDocumentClick }: KeyDocumentsProps) {
  return (
    <div className="data-panel">
      <div className="data-panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 className="data-panel-title">KEY DOCUMENTS</h3>
        {onUploadClick && (
          <button 
            onClick={onUploadClick} 
            className="btn-secondary" 
            style={{ padding: '4px 12px', fontSize: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Upload size={12} />
            UPLOAD DOCUMENT
          </button>
        )}
      </div>
      <div className="data-panel-content">
        {documents.length === 0 ? (
          <div className="data-list-empty">NO DOCUMENTS ATTACHED</div>
        ) : (
          <div className="data-list">
            {documents.map(doc => (
              <div 
                key={doc.id} 
                className="docs-grid" 
                style={onDocumentClick ? { cursor: 'pointer' } : {}}
                onClick={() => onDocumentClick && onDocumentClick(doc.id)}
              >
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
