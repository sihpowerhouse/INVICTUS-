import { useState, useRef, useEffect } from 'react';
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

  useEffect(() => {
    if (!file) return;

    // Simulate progress through stages
    let stage = 0;

    const interval = setInterval(() => {
      stage++;
      if (stage >= STAGES.length) {
        clearInterval(interval);
        setTimeout(() => {
          onComplete(); // Done
        }, 800);
      } else {
        setCurrentStage(stage);
      }
    }, 1200); // 1.2s per mock stage

    return () => clearInterval(interval);
  }, [file, onComplete]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setCurrentStage(0);
    }
  };

  return (
    <div className="doc-upload-container">
      <div className="doc-upload-header">
        <h3 className="doc-upload-title">SECURE UPLOAD & PROCESSING</h3>
        <button className="btn-close" onClick={onClose} aria-label="Close upload">&times;</button>
      </div>

      {!file ? (
        <div 
          className="doc-dropzone" 
          onClick={() => fileInputRef.current?.click()}
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
        </div>
      ) : (
        <div className="doc-upload-progress">
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
                <div key={stageName} className={`progress-stage ${isActive ? 'active' : ''}`}>
                  <div className={`stage-dot ${isActive ? 'active' : ''} ${isComplete ? 'complete' : ''}`}>
                    {isComplete ? '✓' : index + 1}
                  </div>
                  <span className="stage-label">{stageName}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
