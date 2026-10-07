import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { type ProcessingState, type ProcessingJobHandle } from '../../services/processingService';
import { documentUploadService } from '../../services/documentUploadService';
import { securityService } from '../../services/securityService';
import { caseService } from '../../services/caseService';
import type { Document } from '../../types/document';
import type { Case } from '../../types/case';
import InvictusSelect from '../ui/InvictusSelect';
import './DocumentUpload.css';

interface DocumentUploadProps {
  caseId?: string;
  onClose: () => void;
  onComplete: (newDoc?: Document) => void;
  onUploadSuccess?: (doc: Document) => void;
  documentId?: string;  // If set: UPLOAD NEW VERSION of this document
  documentType?: string; // Pre-select document type for new version
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

type UploadPhase = 'select' | 'auth_required' | 'otp' | 'processing';

export default function DocumentUpload({ caseId, onClose, onComplete, onUploadSuccess, documentId, documentType: initialDocType }: DocumentUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploadPhase, setUploadPhase] = useState<UploadPhase>('select');
  const [processingState, setProcessingState] = useState<ProcessingState | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [newDocument, setNewDocument] = useState<Document | null>(null);

  const [selectedCaseId, setSelectedCaseId] = useState<string>(caseId || '');
  const [selectedType, setSelectedType] = useState<string>(initialDocType || 'EVIDENCE');
  const [availableCases, setAvailableCases] = useState<Case[]>([]);

  // Inlined OTP state
  const [otpCode, setOtpCode] = useState('');
  const [otpStatus, setOtpStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [otpErrorMessage, setOtpErrorMessage] = useState('');

  const [isPollingDone, setIsPollingDone] = useState(false);
  const jobHandleRef = useRef<ProcessingJobHandle | null>(null);

  useEffect(() => {
    if (!caseId) {
      caseService.getCases().then(setAvailableCases);
    }
  }, [caseId]);

  useEffect(() => {
    mountedRef.current = true;
    return () => { 
      mountedRef.current = false;
      if (jobHandleRef.current) {
        jobHandleRef.current.cancel();
      }
    };
  }, []);

  // When processing finishes, wait a moment then complete IF READY or DISABLED
  useEffect(() => {
    if (uploadPhase === 'processing' && isPollingDone && newDocument) {
      if (processingState?.stage === 'READY' || newDocument.aiEnabled === false) {
        const timer = setTimeout(() => {
          onComplete(newDocument);
        }, 800);
        return () => clearTimeout(timer);
      }
    }
  }, [uploadPhase, processingState, isPollingDone, onComplete, newDocument]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setUploadPhase('auth_required');
    }
  };

  const handleRequestAuthorization = async () => {
    try {
      const activeCaseId = caseId || selectedCaseId;
      if (!activeCaseId) throw new Error("Please select a case before proceeding.");
      await securityService.requestOtp('UPLOAD_FILE', activeCaseId);
      setUploadPhase('otp');
      setOtpCode('');
      setOtpStatus('idle');
      setOtpErrorMessage('');
    } catch (err: any) {
      alert(err.message || 'Unable to send verification code.');
    }
  };

  const mountedRef = useRef(true);

  const [processingError, setProcessingError] = useState<string | null>(null);

  const handleOTPVerify = async () => {
    if (otpCode.length !== 6) {
      setOtpStatus('error');
      setOtpErrorMessage('PLEASE ENTER A 6-DIGIT CODE');
      return;
    }

    setOtpStatus('loading');
    try {
      const activeCaseId = caseId || selectedCaseId;
      await securityService.verifyOtp('UPLOAD_FILE', otpCode, activeCaseId);
      setOtpStatus('success');
      
      // Give the user a moment to see AUTHORIZATION VERIFIED
      setTimeout(() => {
        setUploadPhase('processing');
        setProcessingError(null);
        setIsPollingDone(false);
        
        const { uploadPromise, getJobHandle } = documentUploadService.startUpload(
          file!, 
          activeCaseId, 
          (state) => {
            if (mountedRef.current) setProcessingState(state);
          }, 
          documentId, 
          selectedType
        );

        uploadPromise.then(doc => {
          if (mountedRef.current) {
            setNewDocument(doc);
            if (onUploadSuccess) {
              onUploadSuccess(doc);
            }
            const handle = getJobHandle();
            if (handle) {
              if (jobHandleRef.current) {
                jobHandleRef.current.cancel();
              }
              jobHandleRef.current = handle;
              handle.promise.then(() => {
                if (mountedRef.current) setIsPollingDone(true);
              }).catch((err: any) => {
                if (mountedRef.current) {
                  setProcessingError(err?.message || 'Document processing failed.');
                  setUploadPhase('select');
                }
              });
            } else {
              setIsPollingDone(true);
            }
          }
        }).catch((err: any) => {
          if (mountedRef.current) {
            setProcessingError(err?.message || 'Document processing failed.');
            setUploadPhase('select');
          }
        });
      }, 1000);

    } catch (e: any) {
      setOtpStatus('error');
      setOtpErrorMessage(e.message || 'Invalid verification code.');
    }
  };

  const handleOTPResend = async () => {
    try {
      const activeCaseId = caseId || selectedCaseId;
      await securityService.requestOtp('UPLOAD_FILE', activeCaseId);
      setOtpStatus('idle');
      setOtpCode('');
      setOtpErrorMessage('');
    } catch (e: any) {
      setOtpStatus('error');
      setOtpErrorMessage(e.message || 'Unable to send verification code.');
    }
  };

  const handleOTPCancel = () => {
    setFile(null);
    setUploadPhase('select');
    setOtpCode('');
    setOtpStatus('idle');
    setOtpErrorMessage('');
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
          <button className="btn-close" onClick={onClose} aria-label="Close upload" disabled={uploadPhase === 'auth_required'}>&times;</button>
        </div>

        <AnimatePresence mode="wait">
          {uploadPhase === 'select' && (
            <motion.div 
              key="dropzone"
              className="doc-dropzone" 
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

              <div style={{ width: '100%', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {!caseId && (
                  <div>
                    <label style={{ fontSize: '10px', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block', letterSpacing: '0.1em' }}>SELECT CASE</label>
                    <InvictusSelect
                      value={selectedCaseId} 
                      onChange={val => setSelectedCaseId(val)}
                      options={[
                        { value: '', label: 'Choose a case...', disabled: true },
                        ...availableCases.map(c => ({ value: c.id, label: c.title }))
                      ]}
                      placeholder="Choose a case..."
                    />
                  </div>
                )}
                
                <div>
                  <label style={{ fontSize: '10px', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block', letterSpacing: '0.1em' }}>DOCUMENT TYPE</label>
                  <InvictusSelect
                    value={selectedType} 
                    onChange={val => setSelectedType(val)}
                    disabled={!!documentId}
                    options={[
                      { value: 'EVIDENCE', label: 'EVIDENCE' },
                      { value: 'LEGAL_DOCUMENT', label: 'LEGAL DOCUMENT' },
                      { value: 'MEDIA', label: 'MEDIA' },
                      { value: 'REPORT', label: 'REPORT' }
                    ]}
                  />
                </div>
              </div>

              <div 
                onClick={() => {
                  if (!caseId && !selectedCaseId) {
                    alert("Please select a case first.");
                    return;
                  }
                  fileInputRef.current?.click();
                }}
                style={{ cursor: 'pointer', padding: '24px', border: '1px dashed var(--border)', borderRadius: '4px', textAlign: 'center' }}
              >
                <div className="doc-dropzone-text">CLICK OR DRAG DOCUMENT HERE</div>
                <div className="doc-dropzone-subtext">SUPPORTED: PDF, JPG, PNG, DOCX, AUDIO, VIDEO</div>
              </div>

              <input 
                type="file" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                onChange={handleFileChange} 
                accept=".pdf,.jpg,.jpeg,.png,.docx,.mp3,.mp4,.avi"
              />
            </motion.div>
          )}


          {uploadPhase === 'auth_required' && (
            <motion.div 
              key="auth_required"
              className="doc-upload-progress"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="upload-file-card">
                <div className="upload-file-info">
                  <span className="upload-file-name">{file?.name}</span>
                  <span className="upload-file-size">
                    {file ? (file.size / 1024 / 1024).toFixed(2) : 0} MB
                  </span>
                </div>
              </div>
              <div style={{ padding: '24px 20px', textAlign: 'center' }}>
                <div style={{ color: 'var(--accent)', fontSize: '13px', letterSpacing: '0.1em', marginBottom: '12px', fontWeight: 600 }}>
                  AUTHORIZATION REQUIRED
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                  A verification code will be sent to your registered email.
                </div>
                <button className="btn-primary" onClick={handleRequestAuthorization}>
                  AUTHORIZE UPLOAD
                </button>
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
                    {file ? (file.size / 1024 / 1024).toFixed(2) : 0} MB
                  </span>
                </div>
              </div>
              <div style={{ padding: '24px 20px', textAlign: 'center' }}>
                <div style={{ color: 'var(--accent)', fontSize: '13px', letterSpacing: '0.1em', marginBottom: '12px', fontWeight: 600 }}>
                  {otpStatus === 'success' ? 'AUTHORIZATION VERIFIED' : 'VERIFICATION REQUIRED'}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                  {otpStatus === 'success' ? 'Uploading securely...' : 'Enter the 6-digit code sent to your registered email.'}
                </div>
                
                {otpStatus !== 'success' && (
                  <>
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="000000"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      disabled={otpStatus === 'loading'}
                      style={{
                        background: 'rgba(0, 0, 0, 0.3)',
                        border: `1px solid ${otpStatus === 'error' ? '#ff5555' : 'var(--border)'}`,
                        color: otpStatus === 'error' ? '#ff5555' : 'var(--text-primary)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '24px',
                        letterSpacing: '0.5em',
                        textAlign: 'center',
                        padding: '12px',
                        width: '200px',
                        outline: 'none',
                        marginBottom: '8px'
                      }}
                    />
                    {otpStatus === 'error' && (
                      <div style={{ color: '#ff5555', fontSize: '11px', marginBottom: '16px' }}>
                        {otpErrorMessage}
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: otpStatus === 'error' ? '0' : '16px' }}>
                      <button 
                        className="btn-secondary" 
                        onClick={handleOTPCancel}
                        disabled={otpStatus === 'loading'}
                      >
                        CANCEL
                      </button>
                      <button 
                        className="btn-primary" 
                        onClick={handleOTPVerify}
                        disabled={otpStatus === 'loading' || otpCode.length !== 6}
                      >
                        {otpStatus === 'loading' ? 'VERIFYING...' : 'VERIFY OTP'}
                      </button>
                    </div>
                    {otpStatus === 'error' && (
                      <div style={{ marginTop: '16px' }}>
                        <button 
                          className="btn-secondary" 
                          onClick={handleOTPResend}
                          style={{ fontSize: '10px', padding: '4px 8px' }}
                        >
                          RESEND CODE
                        </button>
                      </div>
                    )}
                  </>
                )}
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
                    {file ? (file.size / 1024 / 1024).toFixed(2) : 0} MB • 
                    {newDocument && newDocument.aiEnabled === false && isPollingDone ? ' AI PROCESSING DISABLED' : 
                     isPollingDone && processingState?.stage !== 'READY' ? ' AI PROCESSING STILL PENDING' : ' PROCESSING...'}
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
              
              {isPollingDone && processingState?.stage !== 'READY' && newDocument?.aiEnabled !== false && (
                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                  <button className="btn-secondary" onClick={onClose}>
                    CONTINUE IN BACKGROUND
                  </button>
                </div>
              )}
              {isPollingDone && newDocument?.aiEnabled === false && (
                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                  <div style={{ color: 'var(--success)', fontSize: '13px', fontWeight: 600, marginBottom: '12px' }}>DOCUMENT SECURED</div>
                  <button className="btn-primary" onClick={() => onComplete(newDocument)}>
                    CLOSE
                  </button>
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </motion.div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
