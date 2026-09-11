import { useState } from 'react';
import './IntelligenceQAPage.css';
import { intelligenceService } from '../services/intelligenceService';
import type { AIAnswer as IAIAnswer, Citation as ICitation } from '../types/intelligence';

import QuestionInput from '../components/intelligence/QuestionInput';
import AIAnswer from '../components/intelligence/AIAnswer';
import CitationPanel from '../components/intelligence/CitationPanel';

export default function IntelligenceQAPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [answer, setAnswer] = useState<IAIAnswer | null>(null);
  const [selectedCitation, setSelectedCitation] = useState<ICitation | null>(null);

  const handleAsk = async (question: string) => {
    setIsLoading(true);
    setAnswer(null);
    setSelectedCitation(null);

    const result = await intelligenceService.getCaseAnswer(question, 'CAS-26190');
    
    setAnswer(result);
    setIsLoading(false);
  };

  return (
    <div className="intel-qa-page">
      <div className="intel-qa-page__header">
        <p className="page-tag">INVICTUS / INTELLIGENCE / CAS-26190: OPERATION ORION</p>
        <h1 className="page-title">CASE Q&A</h1>
      </div>

      <div className="intel-qa-page__layout">
        <main className="intel-qa-main">
          <QuestionInput onSubmit={handleAsk} isLoading={isLoading} />
          
          {isLoading && (
            <div className="intelligence-loading">
              INTERROGATING EVIDENCE DATABASE...
            </div>
          )}
          
          <AIAnswer 
            answer={answer} 
            selectedCitationId={selectedCitation?.id || null}
            onCitationSelect={setSelectedCitation}
          />
        </main>
        
        <aside className="intel-qa-sidebar">
          <CitationPanel citation={selectedCitation} />
        </aside>
      </div>
    </div>
  );
}
