import { useState } from 'react';
import './Intelligence.css';

interface QuestionInputProps {
  onSubmit: (question: string) => void;
  isLoading: boolean;
}

const SUGGESTIONS = [
  "What evidence connects the accused to the scene?",
  "What did the forensic report conclude?",
  "What did Witness A say?",
  "When did the incident occur?",
  "Which documents mention this person?"
];

export default function QuestionInput({ onSubmit, isLoading }: QuestionInputProps) {
  const [question, setQuestion] = useState('');

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (question.trim() && !isLoading) {
      onSubmit(question);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuestion(suggestion);
    onSubmit(suggestion);
  };

  return (
    <div className="intel-qa-input-container">
      <form onSubmit={handleSubmit} className="intel-qa-form">
        <textarea
          className="intel-qa-textarea"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="ASK THE CASE... (Shift+Enter for new line)"
          disabled={isLoading}
          rows={3}
          aria-label="Ask the case a question"
        />
        
        <div className="intel-qa-actions">
          {question && (
            <button 
              type="button" 
              className="intel-btn-outline intel-btn-sm" 
              onClick={() => setQuestion('')}
              disabled={isLoading}
            >
              CLEAR
            </button>
          )}
          <button 
            type="submit" 
            className="btn-primary" 
            disabled={!question.trim() || isLoading}
          >
            {isLoading ? 'ANALYZING...' : '[ ASK ]'}
          </button>
        </div>
      </form>

      {!question && !isLoading && (
        <div className="intel-qa-suggestions">
          <span className="intel-label">SUGGESTED</span>
          <div className="intel-qa-suggestion-list">
            {SUGGESTIONS.map((sug, i) => (
              <button 
                key={i} 
                className="intel-qa-suggestion-btn" 
                onClick={() => handleSuggestionClick(sug)}
              >
                {sug}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
