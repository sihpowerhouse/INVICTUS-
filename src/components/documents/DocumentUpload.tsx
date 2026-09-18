import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { type ProcessingState } from '../../services/processingService';
import { documentUploadService } from '../../services/documentUploadService';
import { securityService } from '../../services/securityService';
import type { Document } from '../../types/document';
import OTPModal from '../common/OTPModal';
import './DocumentUpload.css';

interface DocumentUploadProps {
  caseId: string;
  onClose: () => void;
  onComplete: (newDoc?: Document) => void;
}

const STAGES = [
  'UPLOADED', 
  'SECURED', 
  'INTEGRITY_VERIFIED', 
  'PROCESSING_JOB_CREATED', 
  'DOCUMENT_LOADED', 
  'TEXT_EXTRACTION', 
  'OCR', 
  'CHUNKING', 
  'INDEXING', 
  'READY'
];

type UploadPhase = 'select' | 'integrity_check' | 'otp' | 'processing';

export default function DocumentUpload({ caseId, onClose, onComplete }: DocumentUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploadPhase, setUploadPhase] = useState<UploadPhase>('select');
  const [processingState, setProcessingState] = useState<ProcessingState | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [newDocument, setNewDocument] = useState<Document | null>(null);

  // When processing finishes, wait a moment then complete
  useEffect(() => {
    if (uploadPhase === 'processing' && processingState?.stage === 'READY' && newDocument) {
      const timer = setTimeout(() => {
        onComplete(newDocument);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [uploadPhase, processingState, onComplete, newDocument]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setUploadPhase('integrity_check');
      
      try {
        await securityService.requestOtp('UPLOAD_FILE', caseId);
        setUploadPhase('otp');
      } catch (err: any) {
        alert(err.message || 'Failed to request OTP');
        setFile(null);
        setUploadPhase('select');
      }
    }
  };

  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const [processingError, setProcessingError] = useState<string | null>(null);

  const handleOTPVerify = async (code: string) => {
    try {
      await securityService.verifyOtp('UPLOAD_FILE', code, caseId);
      // Start the upload processing
      setUploadPhase('processing');
      setProcessingError(null);
      
      documentUploadService.processUpload(file!, caseId, (state) => {
        if (mountedRef.current) setProcessingState(state);
      }).then(doc => {
        if (mountedRef.current) setNewDocument(doc);
      }).catch((err: any) => {
        if (mountedRef.current) {
          setProcessingError(err?.message || 'Document processing failed.');
          setUploadPhase('select');
        }
      });
      return true;
    } catch (e: any) {
      // Don't swallow the error here, so OTPModal handles displaying the error
      throw e; 
    }
  };


  const handleOTPResend = async () => {
    await securityService.requestOtp('UPLOAD_FILE', caseId);
  };

  const handleOTPCancel = () => {
    setFile(null);
    setUploadPhase('select');
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: shouldReduceMotion ? 1 : 0.98 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.2, ease: "easeOut" as any }
    },
    exit: { 
      opacity: 0, 
      scale: shouldReduceMotion ? 1 : 0.98,
      transition: { duration: 0.15, ease: "easeIn" as any }
    }
  };

  const stageVariants = {
    hidden: { opacity: 0, x: shouldReduceMotion ? 0 : -5 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } }
  };

  const currentStageIndex = processingState ? STAGES.indexOf(processingState.stage) : -1;

  return (
    <div className="doc-upload-overlay">
      <motion.div 
        className="doc-upload-container"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="doc-upload-header">
          <h3 className="doc-upload-title">SECURE DOCUMENT INGESTION</h3>
          <button className="btn-close" onClick={onClose} aria-label="Close upload" disabled={uploadPhase !== 'select' && uploadPhase !== 'otp'}>&times;</button>
        </div>

        <AnimatePresence mode="wait">
          {uploadPhase === 'select' && (
            <motion.div 
              key="dropzone"
              className="doc-dropzone" 
              onClick={() => fileInputRef.current?.click()}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {processingError && (
                <div style={{ color: 'var(--error, #ff4d4f)', fontSize: '11px', marginBottom: '8px', textAlign: 'center', padding: '4px' }}>
                  ⚠ {processingError}
                </div>
              )}
              <div className="doc-dropzone-text">CLICK OR DRAG DOCUMENT HERE</div>
              <div className="doc-dropzone-subtext">SUPPORTED: PDF, JPG, PNG, DOCX, AUDIO, VIDEO</div>
              <input 
                type="file" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                onChange={handleFileChange} 
                accept=".pdf,.jpg,.jpeg,.png,.docx,.mp3,.mp4,.avi"
              />
            </motion.div>
          )}


          {uploadPhase === 'integrity_check' && (
            <motion.div 
              key="integrity"
              className="doc-upload-progress"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="upload-file-card">
                <div className="upload-file-info">
                  <span className="upload-file-name">{file?.name}</span>
                  <span className="upload-file-size">PERFORMING INTEGRITY CHECK...</span>
                </div>
              </div>
              <div className="progress-stages" style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                <div className="loading-spinner" style={{ width: '24px', height: '24px', border: '2px solid var(--accent)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              </div>
            </motion.div>
          )}

          {uploadPhase === 'otp' && (
            <motion.div 
              key="otp-wait"
              className="doc-upload-progress"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <div className="upload-file-card">
                <div className="upload-file-info">
                  <span className="upload-file-name">{file?.name}</span>
                  <span className="upload-file-size">
                    {file ? (file.size / 1024 / 1024).toFixed(2) : 0} MB • AWAITING AUTHORIZATION
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {uploadPhase === 'processing' && (
            <motion.div 
              key="progress"
              className="doc-upload-progress"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <div className="upload-file-card">
                <div className="upload-file-info">
                  <span className="upload-file-name">{file?.name}</span>
                  <span className="upload-file-size">
                    {file ? (file.size / 1024 / 1024).toFixed(2) : 0} MB • PROCESSING...
                  </span>
                </div>
              </div>

              <div className="progress-stages" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {STAGES.map((stageName, index) => {
                  const isComplete = currentStageIndex > index;
                  const isActive = currentStageIndex === index;
                  
                  return (
                    <motion.div 
                      key={stageName} 
                      className={`progress-stage ${isActive ? 'active' : ''} ${isComplete ? 'complete' : ''}`}
                      variants={stageVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: index * 0.05 }}
                      style={{ padding: '8px', border: '1px solid var(--border)', background: isActive ? 'rgba(0, 240, 255, 0.05)' : 'transparent' }}
                    >
                      <div className={`stage-dot ${isActive ? 'active' : ''} ${isComplete ? 'complete' : ''}`}>
                        {isComplete ? '✓' : index + 1}
                      </div>
                      <span className="stage-label" style={{ fontSize: '10px' }}>{stageName.replace(/_/g, ' ')}</span>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </motion.div>
      
      <OTPModal 
        isOpen={uploadPhase === 'otp'}
        onVerify={handleOTPVerify}
        onCancel={handleOTPCancel}
        onResend={handleOTPResend}
        title="UPLOAD AUTHORIZATION"
        message="A 6-digit authorization code was sent to your official device to verify this document ingestion."
      />
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
