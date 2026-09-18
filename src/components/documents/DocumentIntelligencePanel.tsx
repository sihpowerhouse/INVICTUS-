import React, { useState } from 'react';
import { Bot, AlertCircle, FileText } from 'lucide-react';
import { intelligenceService } from '../../services/intelligenceService';
import type { AIAnswer } from '../../types/intelligence';
import './DocumentIntelligencePanel.css';

interface DocumentIntelligencePanelProps {
  versionId: string;
  documentType?: string;
  onCitationClick?: (versionId: string) => void;
}

export default function DocumentIntelligencePanel({ versionId, onCitationClick }: DocumentIntelligencePanelProps) {
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [answer, setAnswer] = useState<AIAnswer | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !versionId) return;

    setIsLoading(true);
    setError(null);
    setAnswer(null);

    try {
      const res = await intelligenceService.getDocumentAnswer(question, versionId);
      if (res.status === 'UNAUTHORIZED') {
         setError(res.answer || 'access denied');
         setIsLoading(false);
         return;
      }
      setAnswer(res);
    } catch (err: any) {
      if (err.status === 401) {
        setError('session expired');
      } else if (err.status === 403) {
        setError('document access denied');
      } else if (err.status === 404) {
        setError('document/version unavailable');
      } else {
        setError('intelligence service temporarily unavailable');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="doc-intelligence-panel">
      <div className="panel-header">
        <Bot size={16} />
        <h4>DOCUMENT INTELLIGENCE</h4>
      </div>
      
      <div className="panel-content">
        <p className="panel-description">Ask anything about this document.</p>
        
        <form onSubmit={handleSubmit} className="di-form">
          <input 
            type="text" 
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g. What does this document say about the incident date?"
            className="di-input"
            disabled={isLoading || !versionId}
          />
          <button type="submit" className="btn-primary di-submit" disabled={isLoading || !versionId || !question.trim()}>
            {isLoading ? <span className="spinner-small" /> : 'ASK'}
          </button>
        </form>

        {isLoading && (
          <div className="di-loading">
            <Bot size={20} className="pulse" />
            <span>ANALYZING DOCUMENT...</span>
          </div>
        )}

        {error && (
          <div className="di-error">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {answer && answer.status === 'INSUFFICIENT_EVIDENCE' && (
          <div className="di-warning">
            <AlertCircle size={16} />
            <span>INSUFFICIENT EVIDENCE IN DOCUMENT</span>
          </div>
        )}

        {answer && answer.status === 'SUCCESS' && (
          <div className="di-result">
            <div className="di-answer-section">
              <h5>ANSWER</h5>
              <p>{answer.answer}</p>
            </div>
            
            {answer.citations && answer.citations.length > 0 && (
              <div className="di-sources-section">
                <h5>SOURCES</h5>
                <div className="di-sources-list">
                  {answer.citations.map((cit, idx) => (
                    <button 
                      key={idx} 
                      className="di-source-tag"
                      onClick={() => {
                        if (cit.versionId && onCitationClick) {
                          onCitationClick(cit.versionId);
                        }
                      }}
                      style={{ cursor: cit.versionId && onCitationClick ? 'pointer' : 'default' }}
                    >
                      <FileText size={12} />
                      {cit.page ? `PAGE ${cit.page}` : `VERSION ${cit.versionId?.substring(0,6) || 'v?'}`}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="di-meta">
              <span>Model: {answer.provider}</span>
              <span>{answer.latencyMs}ms</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
