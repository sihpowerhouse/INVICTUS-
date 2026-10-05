import './MetadataPanel.css';
import type { Document } from '../../types/document';

interface MetadataPanelProps {
  document: Document;
}

export default function MetadataPanel({ document: doc }: MetadataPanelProps) {
  return (
    <div className="metadata-panel">
      <div className="metadata-panel-header">
        <h3 className="metadata-panel-title">EXTRACTED METADATA</h3>
        <button className="btn-text">EDIT METADATA</button>
      </div>

      <div className="metadata-grid">
        <div className="metadata-item">
          <span className="metadata-label">CASE / FIR NO.</span>
          <span className="metadata-value">{doc.caseId}</span>
        </div>
        
        <div className="metadata-item">
          <span className="metadata-label">DOCUMENT TYPE</span>
          <span className="metadata-value">{doc.type.replace('_', ' ')}</span>
        </div>

        <div className="metadata-item">
          <span className="metadata-label">LANGUAGE</span>
          <span className="metadata-value">{doc.language}</span>
        </div>

        <div className="metadata-item">
          <span className="metadata-label">INCIDENT DATE</span>
          <span className="metadata-value">{doc.incidentDate || 'UNKNOWN'}</span>
        </div>

        <div className="metadata-item">
          <span className="metadata-label">CONFIDENTIALITY</span>
          <span className="metadata-value">{doc.confidentiality || 'UNCLASSIFIED'}</span>
        </div>

        <div className="metadata-item" style={{ gridColumn: '1 / -1' }}>
          <span className="metadata-label">KEYWORDS</span>
          <div>
            {doc.keywords && doc.keywords.length > 0 ? (
              doc.keywords.map(kw => (
                <span key={kw} className="metadata-value--badge">{kw}</span>
              ))
            ) : (
              <span className="metadata-value">NO KEYWORDS</span>
            )}
          </div>
        </div>

        <div className="metadata-item" style={{ gridColumn: '1 / -1' }}>
          <span className="metadata-label">PERSONS IDENTIFIED</span>
          <div>
            {doc.persons && doc.persons.length > 0 ? (
              doc.persons.map(p => (
                <span key={p} className="metadata-value--badge">{p}</span>
              ))
            ) : (
              <span className="metadata-value">NONE IDENTIFIED</span>
            )}
          </div>
        </div>

        <div className="metadata-item" style={{ gridColumn: '1 / -1' }}>
          <span className="metadata-label">LOCATIONS</span>
          <div>
            {doc.locations && doc.locations.length > 0 ? (
              doc.locations.map(l => (
                <span key={l} className="metadata-value--badge">{l}</span>
              ))
            ) : (
              <span className="metadata-value">NONE IDENTIFIED</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
