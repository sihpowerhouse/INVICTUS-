import { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import './OCRVerification.css';
import { apiClient } from '../../services/api/apiClient';
import { documentService } from '../../services/documentService';

interface OCRVerificationProps {
  versionId: string;
  documentType: string;
  documentStatus: string;
  hideHeader?: boolean;
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
  is_verified?: boolean;
}

export default function OCRVerification({ versionId, documentType, hideHeader }: OCRVerificationProps) {
  const shouldReduceMotion = useReducedMotion();
  const [statusData, setStatusData] = useState<AiStatusResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  const fetchStatus = async () => {
    if (!versionId) {
      setIsLoading(false);
      return;
    }
    
    try {
      const data = await apiClient.get<AiStatusResponse>(`/documents/ai-status/${encodeURIComponent(versionId)}`);
      setStatusData(data);
      setFetchError(null);
    } catch (err: any) {
      setFetchError(err.message || 'Failed to fetch AI status');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    
    setIsLoading(true);
    fetchStatus();
    return () => {
      
    };
  }, [versionId]);

  useEffect(() => {
    if (statusData?.is_verified) {
      setIsVerified(true);
    }
  }, [statusData]);

  const handleAccept = async () => {
    try {
      setIsLoading(true);
      await documentService.acceptExtraction(versionId);
      setIsVerified(true);
      await fetchStatus();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReprocess = async () => {
    try {
      setIsLoading(true);
      await documentService.reprocessDocument(versionId);
      setIsVerified(false);
      await fetchStatus();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditSave = async () => {
    try {
      setIsLoading(true);
      await documentService.editExtraction(versionId, editText);
      setIsEditing(false);
      setIsVerified(true);
      await fetchStatus();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

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
      {!hideHeader && (
        <motion.div className="ocr-header" variants={itemVariants}>
          <h3 className="ocr-title">OCR EXTRACTION PIPELINE</h3>
        </motion.div>
      )}

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

      {statusData?.error && (
        <motion.div className="ocr-warning-box" variants={itemVariants}>
          <h4 className="ocr-warning-title" style={{ color: 'var(--accent)' }}>EXTRACTION FAILED</h4>
          <p className="ocr-warning-text">{statusData.error}</p>
        </motion.div>
      )}

      {isLowConfidence && !statusData?.error && (
        <motion.div className="ocr-warning-box" variants={itemVariants}>
          <h4 className="ocr-warning-title">LOW CONFIDENCE: MANUAL VERIFICATION REQUIRED</h4>
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
        {isLoading && !isEditing ? (
          <div style={{ padding: '20px', color: 'var(--text-dim)' }}>Fetching AI status...</div>
        ) : isEditing ? (
          <textarea
             className="ocr-edit-textarea"
             value={editText}
             onChange={(e) => setEditText(e.target.value)}
             style={{ width: '100%', minHeight: '150px', background: 'transparent', color: 'var(--text-color)', border: '1px solid var(--border)', padding: '10px' }}
          />
        ) : (
          <div style={{ whiteSpace: 'pre-wrap', padding: '10px 0' }}>
            {displayText || (statusData?.error ? 'Processing failed.' : 'No text extracted.')}
          </div>
        )}
      </motion.div>

      <motion.div className="ocr-actions" variants={itemVariants}>
        {!isEditing ? (
          <>
            {(isLowConfidence && !isVerified) ? (
              <button 
                className="btn-ocr btn-ocr-accept" 
                onClick={() => setIsVerified(true)} 
                disabled={isLoading || statusData?.status !== 'completed'}
              >
                I HAVE VERIFIED THIS TEXT
              </button>
            ) : (
              <button 
                className="btn-ocr btn-ocr-accept" 
                onClick={handleAccept} 
                disabled={isLoading || statusData?.status !== 'completed' || isVerified}
              >
                {isVerified ? 'VERIFIED' : 'ACCEPT EXTRACTION'}
              </button>
            )}
            
            <button 
              className="btn-ocr btn-ocr-edit" 
              onClick={() => { setEditText(displayText); setIsEditing(true); }} 
              disabled={isLoading || statusData?.status !== 'completed'}
            >
              EDIT TEXT
            </button>
            <button 
              className="btn-ocr btn-ocr-reprocess" 
              onClick={handleReprocess} 
              disabled={isLoading}
            >
              REPROCESS
            </button>
          </>
        ) : (
          <>
            <button className="btn-ocr btn-ocr-accept" onClick={handleEditSave} disabled={isLoading}>SAVE EDITS</button>
            <button className="btn-ocr btn-ocr-reprocess" onClick={() => setIsEditing(false)} disabled={isLoading}>CANCEL</button>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
