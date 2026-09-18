import { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import './OCRVerification.css';
import { apiClient } from '../../services/api/apiClient';

interface OCRVerificationProps {
  versionId: string;
  documentType: string;
  documentStatus: string;
}

interface AiStatusResponse {
  status: string;
  stage?: string;
  provider?: string;
  model?: string;
  extracted_text?: string;
  confidence?: number;
  pages?: number;
  progress_percent?: number;
  error?: string;
}

export default function OCRVerification({ versionId, documentType, documentStatus }: OCRVerificationProps) {
  const shouldReduceMotion = useReducedMotion();
  const [statusData, setStatusData] = useState<AiStatusResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    setFetchError(null);

    const fetchStatus = async () => {
      if (!versionId) {
        setIsLoading(false);
        return;
      }
      
      try {
        const data = await apiClient.get<AiStatusResponse>(`/documents/ai-status/${encodeURIComponent(versionId)}`);
        if (mounted) {
          setStatusData(data);
          setIsLoading(false);
        }
      } catch (err: any) {
        if (mounted) {
          setFetchError(err.message || 'Failed to fetch AI status');
          setIsLoading(false);
        }
      }
    };

    fetchStatus();

    return () => {
      mounted = false;
    };
  }, [versionId]);

  const confidence = statusData?.confidence ?? 0;
  const isLowConfidence = confidence < 85 && confidence > 0;
  
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

  let displayText = statusData?.extracted_text || '';
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
          <span className="ocr-node-val">{documentType.replace('_', ' ')}</span>
        </div>
        <div className="ocr-flow-arrow">→</div>
        <div className="ocr-flow-node method">
          <span className="ocr-node-label">ENGINE</span>
          <span className="ocr-node-val">{statusData?.provider || 'STANDARD OCR'}</span>
        </div>
        <div className="ocr-flow-arrow">→</div>
        <div className="ocr-flow-node output">
          <span className="ocr-node-label">CONFIDENCE</span>
          <span className={`ocr-node-val ${isLowConfidence ? 'warning' : 'success'}`}>
            {confidence > 0 ? `${confidence.toFixed(1)}%` : 'N/A'}
          </span>
        </div>
      </motion.div>

      {documentStatus === 'VERIFIED' && (
        <button className="ocr-action-btn secondary">EDIT TEXT</button>
      )}

      {statusData?.error && (
        <motion.div className="ocr-warning-box" variants={itemVariants}>
          <h4 className="ocr-warning-title" style={{ color: 'var(--accent)' }}>EXTRACTION FAILED</h4>
          <p className="ocr-warning-text">{statusData.error}</p>
        </motion.div>
      )}

      {isLowConfidence && !statusData?.error && (
        <motion.div className="ocr-warning-box" variants={itemVariants}>
          <h4 className="ocr-warning-title">WARNING: LOW CONFIDENCE</h4>
          <p className="ocr-warning-text">
            Text extraction confidence is below 85%. Manual verification is required before advancing document status.
          </p>
        </motion.div>
      )}

      {fetchError && (
        <motion.div className="ocr-warning-box" variants={itemVariants}>
          <h4 className="ocr-warning-title" style={{ color: 'var(--accent)' }}>API ERROR</h4>
          <p className="ocr-warning-text">{fetchError}</p>
        </motion.div>
      )}

      <motion.div className="ocr-text-view" variants={itemVariants}>
        <div className="ocr-text-view-header">
          {isLoading ? 'LOADING STATUS...' : 
           (statusData?.status === 'processing' || statusData?.status === 'pending') ? 
           `PROCESSING... ${statusData?.progress_percent || 0}%` :
           'EXTRACTED TEXT'}
        </div>
        {isLoading ? (
          <div style={{ padding: '20px', color: 'var(--text-dim)' }}>Fetching AI status...</div>
        ) : (
          <div style={{ whiteSpace: 'pre-wrap', padding: '10px 0' }}>
            {displayText || (statusData?.error ? 'Processing failed.' : 'No text extracted.')}
          </div>
        )}
      </motion.div>

      <motion.div className="ocr-actions" variants={itemVariants}>
        <button className="btn-ocr btn-ocr-accept" disabled={isLoading || statusData?.status !== 'completed'}>ACCEPT EXTRACTION</button>
        <button className="btn-ocr btn-ocr-edit" disabled={isLoading}>EDIT TEXT</button>
        <button className="btn-ocr btn-ocr-reprocess" disabled={isLoading}>REPROCESS</button>
      </motion.div>
    </motion.div>
  );
}
