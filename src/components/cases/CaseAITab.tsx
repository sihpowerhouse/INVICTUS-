import { useState, useEffect, useRef } from 'react';
import { aiService, type CaseAIInfo, type CaseSummary, type ProcessingLog } from '../../services/aiService';
import { intelligenceService } from '../../services/intelligenceService';
import { ApiError } from '../../services/api/ApiError';
import type { AIAnswer as IAIAnswer } from '../../types/intelligence';
import AIAnswer from '../intelligence/AIAnswer';
import './CaseAITab.css';

interface CaseAITabProps {
  caseId: string;
  onOpenDocument: (documentId: string) => void;
}

interface ChatMessage {
  id: string;
  sender: 'USER' | 'AI';
  text?: string;
  answer?: IAIAnswer;
  isLoading?: boolean;
}

export default function CaseAITab({ caseId, onOpenDocument }: CaseAITabProps) {
  const [aiInfo, setAiInfo] = useState<CaseAIInfo | null>(null);
  const [summary, setSummary] = useState<CaseSummary | null>(null);
  const [processingLogs, setProcessingLogs] = useState<ProcessingLog[]>([]);
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCitationId, setSelectedCitationId] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      aiService.getCaseAIStatus(caseId),
      aiService.getCaseSummary(caseId),
      aiService.getProcessingActivity(caseId)
    ]).then(([infoData, summaryData, logsData]) => {
      if (mounted) {
        setAiInfo(infoData);
        setSummary(summaryData);
        setProcessingLogs(logsData);
        setIsInitializing(false);
      }
    });

    return () => { mounted = false; };
  }, [caseId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isSubmitting) return;

    const question = inputValue.trim();
    setInputValue('');
    setIsSubmitting(true);

    const userMessage: ChatMessage = { id: Date.now().toString(), sender: 'USER', text: question };
    const loadingMessage: ChatMessage = { id: (Date.now() + 1).toString(), sender: 'AI', isLoading: true };
    
    setMessages(prev => [...prev, userMessage, loadingMessage]);

    try {
      const answer = await intelligenceService.getCaseAnswer(question, caseId);
      setMessages(prev => 
        prev.map(msg => msg.id === loadingMessage.id ? { ...msg, isLoading: false, answer } : msg)
      );
    } catch (error: any) {
      const errorAnswer: IAIAnswer = {
        id: `err-${Date.now()}`,
        question,
        answer: error instanceof ApiError ? error.message : 'An unexpected error occurred.',
        status: error?.status === 401 || error?.status === 403 ? 'UNAUTHORIZED' : 'INSUFFICIENT_EVIDENCE',
        citations: [],
        basis: { totalSources: 0, documentCount: 0, mediaCount: 0, evidenceCount: 0, relevance: 'LOW' }
      };
      setMessages(prev => 
        prev.map(msg => msg.id === loadingMessage.id ? { ...msg, isLoading: false, answer: errorAnswer } : msg)
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCitationSelect = (citationId: string, documentId: string) => {
    setSelectedCitationId(citationId);
    onOpenDocument(documentId);
  };

  if (isInitializing) {
    return (
      <div className="case-ai-tab" style={{ padding: '24px' }}>
        <div style={{ color: 'var(--text-muted)' }}>LOADING CASE INTELLIGENCE...</div>
      </div>
    );
  }

  return (
    <div className="case-ai-tab">
      <div className="case-ai-tab__left">
        {/* CASE SUMMARY */}
        <div className="case-ai-summary">
          <div className="case-ai-summary__header">
            <h3>CASE SUMMARY</h3>
            <span className="case-ai-summary__badge">AI GENERATED</span>
          </div>
          {summary?.isAvailable ? (
            <ul className="case-ai-summary__list">
              {summary.bullets.map((bullet, idx) => (
                <li key={idx}>{bullet}</li>
              ))}
            </ul>
          ) : (
            <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
              AI SUMMARY UNAVAILABLE
            </div>
          )}
        </div>

        {/* KPI STRIP */}
        <div className="case-ai-kpi-strip">
          <div className="case-ai-kpi">
            <span className="case-ai-kpi-value">{aiInfo?.totalDocuments || 0}</span>
            <span className="case-ai-kpi-label">DOCUMENTS</span>
          </div>
          <div className="case-ai-kpi">
            <span className="case-ai-kpi-value">8</span>
            <span className="case-ai-kpi-label">EVIDENCE</span>
          </div>
          <div className="case-ai-kpi">
            <span className="case-ai-kpi-value">3</span>
            <span className="case-ai-kpi-label">MEDIA</span>
          </div>
          <div className="case-ai-kpi">
            <span className="case-ai-kpi-value">{aiInfo?.documentsProcessed || 0}</span>
            <span className="case-ai-kpi-label">INDEXED</span>
          </div>
        </div>

        {/* PROCESSING ACTIVITY */}
        <div className="case-ai-processing">
          <h4>PROCESSING ACTIVITY</h4>
          <div className="processing-log">
            {processingLogs.map(log => (
              <div key={log.id} className="processing-log-item">
                <div className="log-time">{log.time}</div>
                <div className="log-content">
                  <div className="log-filename">{log.filename}</div>
                  <div className="log-state">
                    <span className={`log-status-dot ${log.status.toLowerCase()}`}></span>
                    {log.state} {log.status === 'COMPLETE' ? 'COMPLETE' : ''}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="case-ai-tab__right">
        {/* HEADER */}
        <div className="case-ai-chat-header">
          <div className="chat-header-item">
            <span className="chat-header-label">STATUS:</span>
            <span className="chat-header-value">{aiInfo?.status || 'DISABLED'}</span>
          </div>
          <div className="chat-header-item">
            <span className="chat-header-label">CASE:</span>
            <span className="chat-header-value">{caseId}</span>
          </div>
          <div className="chat-header-item">
            <span className="chat-header-label">DOCUMENTS INDEXED:</span>
            <span className="chat-header-value">{aiInfo?.documentsProcessed || 0}</span>
          </div>
          <div className="chat-header-item">
            <span className="chat-header-label">LAST PROCESSING:</span>
            <span className="chat-header-value">{aiInfo?.processingState || 'NOT AVAILABLE'}</span>
          </div>
          <div className="chat-header-item">
            <span className="chat-header-label">PROVIDER:</span>
            <span className="chat-header-value">{aiInfo?.provider || 'NOT AVAILABLE'}</span>
          </div>
          <div className="chat-header-item">
            <span className="chat-header-label">MODEL:</span>
            <span className="chat-header-value">{aiInfo?.model || 'NOT AVAILABLE'}</span>
          </div>
        </div>

        {/* CHAT SCROLL AREA */}
        <div className="case-ai-chat-scroll" ref={scrollRef}>
          {messages.length === 0 ? (
            <div style={{ color: 'var(--text-muted)', fontSize: '12px', textAlign: 'center', marginTop: '40px' }}>
              ASK A QUESTION TO INTERROGATE THE CASE EVIDENCE...
            </div>
          ) : (
            messages.map(msg => (
              <div key={msg.id} className={`ai-message-row ${msg.sender.toLowerCase()}`}>
                <div className="message-label">{msg.sender === 'USER' ? 'USER' : 'INVICTUS AI'}</div>
                
                {msg.isLoading ? (
                  <div className="message-content" style={{ width: '100%' }}>
                    <div className="skeleton-block skeleton-text medium"></div>
                    <div className="skeleton-block skeleton-text short"></div>
                    <div style={{ fontSize: '10px', color: 'var(--accent)', marginTop: '8px' }}>RETRIEVING EVIDENCE &amp; ANALYZING SOURCES...</div>
                  </div>
                ) : msg.answer ? (
                  <div style={{ width: '100%' }}>
                    <AIAnswer 
                      answer={msg.answer} 
                      selectedCitationId={selectedCitationId}
                      onCitationSelect={(cit) => handleCitationSelect(cit.id, cit.versionId || cit.documentId)}
                    />
                  </div>
                ) : (
                  <div className="message-content">{msg.text}</div>
                )}
              </div>
            ))
          )}
        </div>

        {/* INPUT */}
        <div className="case-ai-chat-input-container">
          <form className="case-ai-form" onSubmit={handleSubmit}>
            <input 
              type="text" 
              className="case-ai-input" 
              placeholder="ASK ABOUT THIS CASE..."
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              disabled={isSubmitting}
            />
            <button type="submit" className="case-ai-submit" disabled={isSubmitting || !inputValue.trim()}>
              SUBMIT
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
