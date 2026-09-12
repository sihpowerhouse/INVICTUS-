import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import './DocumentUpload.css';

interface DocumentUploadProps {
  onClose: () => void;
  onComplete: () => void;
}

const STAGES = ['UPLOAD', 'EXTRACTION', 'OCR', 'METADATA', 'INDEXED'];

export default function DocumentUpload({ onClose, onComplete }: DocumentUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [currentStage, setCurrentStage] = useState(-1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!file) return;

    let stage = 0;

    const interval = setInterval(() => {
      stage++;
      if (stage >= STAGES.length) {
        clearInterval(interval);
        setTimeout(() => {
          onComplete();
        }, 800);
      } else {
        setCurrentStage(stage);
      }
    }, 1200);

    return () => clearInterval(interval);
  }, [file, onComplete]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setCurrentStage(0);
    }
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
          <h3 className="doc-upload-title">SECURE UPLOAD & PROCESSING</h3>
          <button className="btn-close" onClick={onClose} aria-label="Close upload">&times;</button>
        </div>

        <AnimatePresence mode="wait">
          {!file ? (
            <motion.div 
              key="dropzone"
              className="doc-dropzone" 
              onClick={() => fileInputRef.current?.click()}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
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
          ) : (
            <motion.div 
              key="progress"
              className="doc-upload-progress"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <div className="upload-file-card">
                <div className="upload-file-info">
                  <span className="upload-file-name">{file.name}</span>
                  <span className="upload-file-size">{(file.size / 1024 / 1024).toFixed(2)} MB • MOCK PROCESSING</span>
                </div>
              </div>

              <div className="progress-stages">
                {STAGES.map((stageName, index) => {
                  const isComplete = currentStage > index;
                  const isActive = currentStage === index;
                  
                  return (
                    <motion.div 
                      key={stageName} 
                      className={`progress-stage ${isActive ? 'active' : ''} ${isComplete ? 'complete' : ''}`}
                      variants={stageVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className={`stage-dot ${isActive ? 'active' : ''} ${isComplete ? 'complete' : ''}`}>
                        {isComplete ? '✓' : index + 1}
                      </div>
                      <span className="stage-label">{stageName}</span>
                      
                      {isActive && !shouldReduceMotion && (
                        <motion.div 
                          className="stage-processing-bar"
                          layoutId="processing-bar"
                          transition={{ type: "tween", ease: "linear", duration: 1.2 }}
                        />
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
