import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import './OTPModal.css';

interface OTPModalProps {
  isOpen: boolean;
  onVerify: (code: string) => Promise<boolean>;
  onCancel: () => void;
  onResend?: () => Promise<void>;
  title?: string;
  message?: string;
}

export default function OTPModal({ 
  isOpen, 
  onVerify, 
  onCancel,
  onResend,
  title = "EMAIL VERIFICATION",
  message = "A 6-digit verification code was sent to your official email."
}: OTPModalProps) {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setCode('');
      setStatus('idle');
    }
  }

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleVerify = async () => {
    if (code.length !== 6) {
      setStatus('error');
      setErrorMessage('PLEASE ENTER A 6-DIGIT CODE');
      return;
    }

    setStatus('loading');
    try {
      const isValid = await onVerify(code);
      if (isValid) {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMessage('INVALID OR EXPIRED VERIFICATION CODE');
      }
    } catch (e: any) {
      setStatus('error');
      setErrorMessage(e.message || 'VERIFICATION FAILED');
    }
  };

  const handleResend = async () => {
    if (onResend) {
      try {
        await onResend();
      } catch (e: any) {
        setErrorMessage(e.message || 'RESEND FAILED');
        return;
      }
    }
    setStatus('idle');
    setCode('');
    setErrorMessage('');
    inputRef.current?.focus();
  };

  return createPortal(
    <div className="otp-modal-overlay">
      <div className="otp-modal">
        <div className="otp-modal__header">
          <h2 className="otp-modal__title">{title}</h2>
          <button className="otp-modal__close" onClick={onCancel} disabled={status === 'loading'}>&times;</button>
        </div>

        <div className="otp-modal__content">
          <p className="otp-modal__message">{message}</p>
          
          <div className="otp-modal__input-group">
            <input 
              ref={inputRef}
              type="text" 
              maxLength={6}
              className={`otp-modal__input ${status === 'error' ? 'error' : ''} ${status === 'success' ? 'success' : ''}`}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              placeholder="000000"
              disabled={status === 'loading' || status === 'success'}
            />
            {status === 'error' && (
              <div className="otp-modal__error-message">{errorMessage}</div>
            )}
          </div>
        </div>

        <div className="otp-modal__actions">
          {status === 'error' && (
            <button className="btn-secondary" onClick={handleResend} style={{ marginRight: 'auto' }}>
              RESEND CODE
            </button>
          )}
          
          <button 
            className="btn-secondary" 
            onClick={onCancel}
            disabled={status === 'loading'}
          >
            CANCEL
          </button>
          
          <button 
            className={`btn-primary ${status === 'loading' ? 'loading' : ''} ${status === 'success' ? 'success' : ''}`}
            onClick={handleVerify}
            disabled={status === 'loading' || status === 'success' || code.length !== 6}
          >
            {status === 'loading' ? 'VERIFYING...' : status === 'success' ? 'VERIFIED' : 'VERIFY'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
