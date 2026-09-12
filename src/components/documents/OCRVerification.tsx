import { motion, useReducedMotion } from 'framer-motion';
import './OCRVerification.css';
import type { Document } from '../../types/document';

interface OCRVerificationProps {
  document: Document;
}

export default function OCRVerification({ document: doc }: OCRVerificationProps) {
  const confidence = doc.ocrConfidence || 0;
  const isLowConfidence = confidence < 85;
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: shouldReduceMotion ? 0 : 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 5 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <motion.div 
      className="ocr-verification"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div className="ocr-header" variants={itemVariants}>
        <h3 className="ocr-title">OCR EXTRACTION PIPELINE</h3>
      </motion.div>

      <motion.div className="ocr-flow" variants={itemVariants}>
        <div className="ocr-flow-node source">
          <span className="ocr-node-label">SOURCE</span>
          <span className="ocr-node-val">{doc.type.replace('_', ' ')}</span>
        </div>
        <div className="ocr-flow-arrow">→</div>
        <div className="ocr-flow-node method">
          <span className="ocr-node-label">ENGINE</span>
          <span className="ocr-node-val">{doc.extractionMethod || 'STANDARD OCR'}</span>
        </div>
        <div className="ocr-flow-arrow">→</div>
        <div className="ocr-flow-node output">
          <span className="ocr-node-label">CONFIDENCE</span>
          <span className={`ocr-node-val ${isLowConfidence ? 'warning' : 'success'}`}>
            {confidence.toFixed(1)}%
          </span>
        </div>
      </motion.div>

      {isLowConfidence && (
        <motion.div className="ocr-warning-box" variants={itemVariants}>
          <h4 className="ocr-warning-title">WARNING: LOW CONFIDENCE</h4>
          <p className="ocr-warning-text">
            Text extraction confidence is below 85%. Manual verification is required before advancing document status.
          </p>
        </motion.div>
      )}

      <motion.div className="ocr-text-view" variants={itemVariants}>
        <div className="ocr-text-view-header">MOCK EXTRACTED TEXT</div>
        This document represents a <span className="ocr-text-highlight">FORENSIC REPORT</span> concerning Case {doc.caseId}. 
        The items processed include several critical pieces of evidence collected on scene.<br/><br/>
        According to the initial analysis, there are notable inconsistencies in the provided timestamps.
        Manual review of section 4 is advised.
      </motion.div>

      <motion.div className="ocr-actions" variants={itemVariants}>
        <button className="btn-ocr btn-ocr-accept">ACCEPT EXTRACTION</button>
        <button className="btn-ocr btn-ocr-edit">EDIT TEXT</button>
        <button className="btn-ocr btn-ocr-reprocess">REPROCESS</button>
      </motion.div>
    </motion.div>
  );
}
