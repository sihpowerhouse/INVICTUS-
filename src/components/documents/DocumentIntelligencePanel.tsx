import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { intelligenceService } from '../../services/intelligenceService';
import type { AIAnswer } from '../../types/intelligence';
import { apiClient } from '../../services/api/apiClient';
import './DocumentIntelligencePanel.css';

interface DocumentIntelligencePanelProps {
  documentId: string;
  versionId: string;
  documentType?: string;
  aiEnabled?: boolean;
  onToggleAi?: (enabled: boolean) => void;
  onCitationClick?: (versionId: string, page?: number) => void;
}

export default function DocumentIntelligencePanel({ documentId, versionId, aiEnabled = true, onToggleAi, onCitationClick }: DocumentIntelligencePanelProps) {
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [answer, setAnswer] = useState<AIAnswer | null>(null);
  
  // States to track AI system readiness
  const [aiState, setAiState] = useState<'READY' | 'PROCESSING' | 'DISABLED' | 'FAILED'>('PROCESSING');
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let active = true;
    let pollTimer: any = null;
    let attempts = 0;
    const MAX_ATTEMPTS = 100; // 5 minutes at 3s intervals

    // Reset interaction state
    setAnswer(null);
    setQuestion('');

    if (!aiEnabled) {
      setAiState('DISABLED');
      return;
    }

    setAiState('PROCESSING'); // Reset to processing while we check

    const checkStatus = async () => {
      if (!active) return;
      try {
        const res = await apiClient.get<{status: string}>(`/documents/ai-status/${encodeURIComponent(versionId)}`);
        if (!active) return;

        const status = (res.status || '').toLowerCase();
        if (['completed', 'ready'].includes(status)) {
          setAiState('READY');
          if (pollTimer) clearInterval(pollTimer);
        } else if (['failed', 'error'].includes(status)) {
          setAiState('FAILED');
          if (pollTimer) clearInterval(pollTimer);
        } else if (status === 'disabled') {
          setAiState('DISABLED');
          if (pollTimer) clearInterval(pollTimer);
        } else {
          // pending, processing, queued, not_started, etc
          setAiState('PROCESSING');
          attempts++;
          if (attempts >= MAX_ATTEMPTS) {
             setAiState('FAILED');
             if (pollTimer) clearInterval(pollTimer);
          }
        }
      } catch (err) {
        if (active) {
          setAiState('FAILED');
          if (pollTimer) clearInterval(pollTimer);
        }
      }
    };

    if (versionId) {
      checkStatus();
      pollTimer = setInterval(checkStatus, 3000);
    }

    return () => { 
      active = false; 
      if (pollTimer) clearInterval(pollTimer);
    };
  }, [versionId, aiEnabled, retryCount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !versionId) return;

    setIsLoading(true);
    setAnswer(null);

    try {
      // Send the versionId and documentId exactly as the backend expects
      const res = await intelligenceService.getDocumentAnswer(question, versionId, documentId);
      setAnswer(res);
    } catch (err: any) {
      console.error("ASK AI ERROR:", err);
      
      const status = err.status || err.response?.status || 'UNKNOWN_STATUS';
      const endpoint = err.config?.url || err.url || 'UNKNOWN_ENDPOINT';
      const msg = err.message || err.response?.data?.detail || err.response?.data?.message || String(err);
      
      setAnswer({
        id: `err-${Date.now()}`,
        question,
        answer: `AI REQUEST FAILED\nSTATUS: ${status}\nENDPOINT: ${endpoint}\nERROR: ${msg}`,
        status: 'UNAUTHORIZED', // reuse to show error
        citations: [],
        provider: 'System',
        contextChunks: 0,
        latencyMs: 0,
        basis: { totalSources: 0, documentCount: 0, mediaCount: 0, evidenceCount: 0, relevance: 'LOW' }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetryAi = async () => {
    try {
      setAiState('PROCESSING');
      await apiClient.post(`/case/ai/retry?version_id=${encodeURIComponent(versionId)}`, {});
      setRetryCount(c => c + 1); // Trigger re-poll
    } catch (err) {
      setAiState('FAILED');
    }
  };

  // Helper to determine subtitle text
  const getSubtitle = () => {
    if (aiState === 'PROCESSING') return 'AI PROCESSING';
    if (aiState === 'FAILED') return 'AI CURRENTLY UNAVAILABLE';
    if (aiState === 'DISABLED') return 'AI DISABLED FOR THIS DOCUMENT';
    return 'ASK QUESTIONS ABOUT THIS VERSION';
  };

  // Helper to determine response placeholder text
  const getPlaceholderText = () => {
    if (aiState === 'PROCESSING') return 'This version is currently being analyzed.';
    if (aiState === 'FAILED') return 'The AI service is not available right now.';
    if (aiState === 'DISABLED') return 'Enable AI Intelligence to ask questions about this document.';
    return 'No question asked yet.';
  };

  return (
    <div className="doc-intelligence-panel">
      <div className="panel-header">
        <h4>ASK AI</h4>
        <h5>
          {getSubtitle()}
        </h5>
      </div>
      
      <div className="panel-content">
        <form onSubmit={handleSubmit} className="di-form">
          <input 
            type="text" 
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={getPlaceholderText()}
            className="di-input"
            disabled={aiState !== 'READY' || isLoading || !versionId}
          />
          <div className="di-actions" style={{ display: 'flex', gap: '8px' }}>
            
            {aiState === 'DISABLED' && onToggleAi && (
              <button type="button" className="btn-secondary" onClick={() => onToggleAi(true)}>
                ENABLE AI
              </button>
            )}

            {aiState === 'FAILED' && (
              <button type="button" className="btn-secondary" onClick={handleRetryAi}>
                RETRY AI
              </button>
            )}

            <button type="submit" className="btn-primary di-submit" disabled={aiState !== 'READY' || isLoading || !versionId || !question.trim()}>
              {isLoading ? <span className="spinner-small" /> : 'ASK AI'}
            </button>
          </div>
        </form>

        <div className="di-result">
          <div className="di-answer-section">
            <h5>AI RESPONSE</h5>
            
            {!answer && (
              <p className="di-placeholder">
                {getPlaceholderText()}
              </p>
            )}

            {answer && answer.status === 'INSUFFICIENT_EVIDENCE' && (
              <div className="di-warning">
                <AlertCircle size={16} />
                <span>INSUFFICIENT EVIDENCE IN DOCUMENT</span>
              </div>
            )}

            {answer && answer.status !== 'INSUFFICIENT_EVIDENCE' && (
              <p>
                {answer.answer}
              </p>
            )}
          </div>
          
          {answer && answer.citations && answer.citations.length > 0 && answer.status !== 'INSUFFICIENT_EVIDENCE' && (
            <div className="di-sources-section">
              <h5>SOURCE</h5>
              <div className="di-sources-list">
                {answer.citations.map((cit, idx) => (
                  <button 
                    key={idx} 
                    className="di-source-tag"
                    onClick={() => {
                      if (cit.versionId && onCitationClick) {
                        onCitationClick(cit.versionId, cit.page);
                      }
                    }}
                    style={{ cursor: cit.versionId && onCitationClick ? 'pointer' : 'default' }}
                  >
                    <span style={{ marginBottom: '2px' }}>Version {cit.versionId?.substring(0,8) || 'v?'}</span>
                    {cit.page && <span style={{ opacity: 0.8 }}>Page {cit.page}</span>}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
