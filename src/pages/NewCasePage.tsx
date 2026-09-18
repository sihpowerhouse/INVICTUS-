import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { firService } from '../services/firService';
import type { FIRPayload, FIRCreationState, FIRCreationResult } from '../services/fir/FirServiceInterface';
import './NewCasePage.css';

export default function NewCasePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState<FIRPayload>({
    complainantName: '',
    incidentType: '',
    incidentDate: '',
    location: '',
    description: '',
    clientRequestId: '' // Will be generated on mount
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [processingState, setProcessingState] = useState<FIRCreationState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<FIRCreationResult | null>(null);

  // Generate deterministic clientRequestId on mount
  useEffect(() => {
    const uuid = typeof crypto !== 'undefined' && crypto.randomUUID 
      ? crypto.randomUUID() 
      : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
          const r = (Math.random() * 16) | 0;
          return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
        });
    setFormData(prev => ({ ...prev, clientRequestId: uuid }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (Object.values(formData).some(v => !v.trim())) {
      setError('ALL FIELDS ARE REQUIRED TO INITIATE FIR.');
      return;
    }
    
    if (new Date(formData.incidentDate) > new Date()) {
      setError('INCIDENT DATE CANNOT BE IN THE FUTURE.');
      return;
    }

    startCreation();
  };

  const startCreation = async () => {
    setIsSubmitting(true);
    setError(null);
    setResult(null);

    try {
      const finalResult = await firService.createFIR(formData, user, (state) => {
        setProcessingState(state);
      });
      
      setResult(finalResult);
      
      // Auto-navigation on successful case creation
      setTimeout(() => {
        navigate(`/cases/${finalResult.case.id}`);
      }, 1500); // Brief pause to show "CASE CREATED" state
      
    } catch (err: any) {
      setError(err.message || 'NETWORK CONSTRAINT VIOLATION. FIR CREATION FAILED.');
      setIsSubmitting(false); // allow retry
    }
  };

  const handleRetry = () => {
    startCreation();
  };

  const getStepStatus = (stepName: FIRCreationState['step']) => {
    if (!processingState) return 'pending';
    const steps: FIRCreationState['step'][] = [
      'VALIDATING', 'GENERATING', 'HASHING', 'SIGNING', 'CREATING_CASE', 'READY'
    ];
    const currentIndex = steps.indexOf(processingState.step);
    const stepIndex = steps.indexOf(stepName);

    if (currentIndex > stepIndex) return 'complete';
    if (currentIndex === stepIndex) return 'active';
    return 'pending';
  };

  return (
    <div className="new-case-page">
      <div className="new-case-page__header">
        <p className="page-tag">INVICTUS / REGISTRY</p>
        <h1 className="new-case-page__title">OFFICIAL CASE CREATION CONSOLE</h1>
        <p className="page-subtitle">FIRST INFORMATION REPORT (FIR) INITIALIZATION</p>
      </div>

      <div className="new-case-page__content">
        <form className={`new-case-form ${isSubmitting ? 'form--locked' : ''}`} onSubmit={handleSubmit}>
          
          <div className="form-grid">
            <div className="form-field">
              <label>COMPLAINANT NAME</label>
              <input 
                type="text"
                value={formData.complainantName}
                onChange={e => setFormData({...formData, complainantName: e.target.value})}
                disabled={isSubmitting}
                placeholder="Full Legal Name"
              />
            </div>

            <div className="form-field">
              <label>INCIDENT TYPE</label>
              <input 
                type="text"
                value={formData.incidentType}
                onChange={e => setFormData({...formData, incidentType: e.target.value})}
                disabled={isSubmitting}
                placeholder="e.g. CYBER THEFT"
              />
            </div>

            <div className="form-field">
              <label>INCIDENT DATE</label>
              <input 
                type="date"
                value={formData.incidentDate}
                onChange={e => setFormData({...formData, incidentDate: e.target.value})}
                disabled={isSubmitting}
              />
            </div>

            <div className="form-field">
              <label>LOCATION</label>
              <input 
                type="text"
                value={formData.location}
                onChange={e => setFormData({...formData, location: e.target.value})}
                disabled={isSubmitting}
                placeholder="Coordinates or Address"
              />
            </div>

            <div className="form-field form-field--full">
              <label>DESCRIPTION</label>
              <textarea 
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                disabled={isSubmitting}
                placeholder="Detailed incident description..."
                rows={5}
              />
            </div>
          </div>

          {!isSubmitting && (
            <div className="form-actions">
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={() => navigate(-1)}
              >
                CANCEL
              </button>
              <button 
                type="submit" 
                className="btn-primary"
              >
                CREATE FIR
              </button>
            </div>
          )}
        </form>

        {isSubmitting && (
          <div className="fir-processing-panel">
            {error ? (
              <div className="fir-processing-error">
                <h3>FIR CREATION FAILED</h3>
                <p>{error}</p>
                <div className="fir-error-actions">
                  <button type="button" className="btn-secondary" onClick={() => setIsSubmitting(false)}>EDIT FORM</button>
                  <button type="button" className="btn-primary" onClick={handleRetry}>RETRY SUBMISSION</button>
                </div>
              </div>
            ) : result ? (
              <div className="fir-processing-success">
                <div className="success-icon">✓</div>
                <h3>CASE CREATED</h3>
                <p>FIR ID: {result.case.firNumber}</p>
                <p className="redirect-msg">INITIALIZING CASE WORKSPACE...</p>
              </div>
            ) : (
              <div className="fir-processing-active">
                <div className="processing-header">
                  <h3>PROCESSING FIR SEQUENCE</h3>
                  <span className="processing-pct">{processingState?.progress || 0}%</span>
                </div>
                
                <div className="processing-progress-bar">
                  <div 
                    className="processing-progress-fill" 
                    style={{ width: `${processingState?.progress || 0}%` }} 
                  />
                </div>

                <div className="processing-layout">
                  <div className="processing-steps">
                    {[
                      { id: 'VALIDATING', label: 'VALIDATING INCIDENT DATA' },
                      { id: 'GENERATING', label: 'GENERATING FIR RECORD' },
                      { id: 'HASHING', label: 'CALCULATING DOCUMENT HASH' },
                      { id: 'SIGNING', label: 'CREATING SIGNATURE RECORD' },
                      { id: 'CREATING_CASE', label: 'INITIALIZING CASE' },
                      { id: 'READY', label: 'CASE READY' }
                    ].map(step => {
                      const status = getStepStatus(step.id as any);
                      return (
                        <div key={step.id} className={`processing-step step--${status}`}>
                          <span className="step-icon">
                            {status === 'complete' ? '✓' : status === 'active' ? '●' : '○'}
                          </span>
                          <span className="step-label">{step.label}</span>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="cryptographic-status">
                    <div className="crypto-block">
                      <div className="crypto-label">HASH ALGORITHM</div>
                      <div className="crypto-value">SHA-256</div>
                    </div>
                    <div className="crypto-block">
                      <div className="crypto-label">HASH</div>
                      <div className={`crypto-value hash-value ${processingState?.hashStatus === 'PENDING' ? 'pulse' : ''}`}>
                        {processingState?.hashValue || processingState?.hashStatus || 'PENDING'}
                      </div>
                    </div>
                    <div className="crypto-block">
                      <div className="crypto-label">DIGITAL SIGNATURE</div>
                      <div className={`crypto-value signature-value ${processingState?.signatureStatus === 'PENDING' ? 'pulse' : ''}`}>
                        {processingState?.signatureStatus || 'PENDING'}
                      </div>
                      {processingState?.signatureIdentity && (
                        <div className="crypto-subtext">SIGNER: {processingState.signatureIdentity}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
