import './OCRVerification.css';
import type { Document } from '../../types/document';

interface OCRVerificationProps {
  document: Document;
}

export default function OCRVerification({ document: doc }: OCRVerificationProps) {
  const confidence = doc.ocrConfidence || 0;
  const isLowConfidence = confidence < 85;

  return (
    <div className="ocr-verification">
      <div className="ocr-header">
        <h3 className="ocr-title">OCR VERIFICATION</h3>
      </div>

      <div className="ocr-metrics">
        <div className="ocr-metric">
          <span className="ocr-metric-label">CONFIDENCE</span>
          <span className={`ocr-metric-value ${isLowConfidence ? 'warning' : ''}`}>
            {confidence.toFixed(1)}%
          </span>
        </div>
        <div className="ocr-metric">
          <span className="ocr-metric-label">METHOD</span>
          <span className="ocr-metric-value">{doc.extractionMethod || 'UNKNOWN'}</span>
        </div>
      </div>

      {isLowConfidence && (
        <div className="ocr-warning-box">
          <h4 className="ocr-warning-title">WARNING: LOW CONFIDENCE</h4>
          <p className="ocr-warning-text">
            Text extraction confidence is below 85%. Manual verification is required before advancing document status.
          </p>
        </div>
      )}

      <div className="ocr-text-view">
        [MOCK EXTRACTED TEXT]<br/><br/>
        This document represents a <span className="ocr-text-highlight">FORENSIC REPORT</span> concerning Case {doc.caseId}. 
        The items processed include several critical pieces of evidence collected on scene.<br/><br/>
        According to the initial analysis, there are notable inconsistencies in the provided timestamps.
        Manual review of section 4 is advised.
      </div>

      <div className="ocr-actions">
        <button className="btn-ocr btn-ocr-accept">ACCEPT EXTRACTION</button>
        <button className="btn-ocr btn-ocr-edit">EDIT TEXT</button>
        <button className="btn-ocr btn-ocr-edit">REPROCESS</button>
      </div>
    </div>
  );
}
