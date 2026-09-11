import './DocumentPreview.css';
import type { Document } from '../../types/document';

interface DocumentPreviewProps {
  document: Document;
}

export default function DocumentPreview({ document: doc }: DocumentPreviewProps) {
  return (
    <div className="doc-preview-container">
      <div className="doc-preview-header">
        <span className="doc-preview-title">{doc.name} • PAGE 1 OF {doc.pages}</span>
        <div className="doc-preview-actions">
          <button className="btn-icon">ZOOM IN</button>
          <button className="btn-icon">ZOOM OUT</button>
          <button className="btn-icon">DOWNLOAD</button>
        </div>
      </div>
      <div className="doc-preview-content">
        <div className="doc-placeholder-page">
          <div className="placeholder-line short" />
          <div className="placeholder-line long" />
          <div className="placeholder-line long" />
          <div className="placeholder-line medium" />
          
          <div style={{ height: '32px' }} />
          
          <div className="placeholder-line long" />
          <div className="placeholder-line long" />
          <div className="placeholder-line short" />
        </div>
        <div className="doc-watermark">INVICTUS SECURE VIEW</div>
      </div>
    </div>
  );
}
