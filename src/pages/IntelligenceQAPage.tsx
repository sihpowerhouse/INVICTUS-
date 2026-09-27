import { useState } from 'react';
import { motion, useReducedMotion, type Variants, AnimatePresence } from 'framer-motion';
import './IntelligenceQAPage.css';
import { intelligenceService } from '../services/intelligenceService';
import type { AIAnswer as IAIAnswer, Citation as ICitation } from '../types/intelligence';

import QuestionInput from '../components/intelligence/QuestionInput';
import AIAnswer from '../components/intelligence/AIAnswer';
import CitationPanel from '../components/intelligence/CitationPanel';
import DocumentViewerOverlay from '../components/documents/DocumentViewerOverlay';
import { ApiError } from '../services/api/ApiError';

export default function IntelligenceQAPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [answer, setAnswer] = useState<IAIAnswer | null>(null);
  const [selectedCitation, setSelectedCitation] = useState<ICitation | null>(null);
  const [activeDocumentId, setActiveDocumentId] = useState<string | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const handleAsk = async (question: string) => {
    setIsLoading(true);
    setAnswer(null);
    setSelectedCitation(null);

    try {
      const result = await intelligenceService.getCaseAnswer(question, 'CAS-26190');
      setAnswer(result);
    } catch (error: any) {
      setAnswer({
        id: `err-${Date.now()}`,
        question,
        answer: error instanceof ApiError ? error.message : 'An unexpected error occurred.',
        status: error?.status === 401 || error?.status === 403 ? 'UNAUTHORIZED' : 'INSUFFICIENT_EVIDENCE',
        citations: [],
        basis: { totalSources: 0, documentCount: 0, mediaCount: 0, evidenceCount: 0, relevance: 'LOW' }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: shouldReduceMotion ? 0 : 0.05 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <motion.div 
      className="intel-qa-page"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div className="intel-qa-page__header" variants={itemVariants}>
        <p className="page-tag">INVICTUS / INTELLIGENCE / CAS-26190: OPERATION ORION</p>
        <h1 className="page-title">CASE Q&A</h1>
      </motion.div>

      <div className="intel-qa-page__layout">
        <main className="intel-qa-main">
          <motion.div variants={itemVariants}>
            <QuestionInput onSubmit={handleAsk} isLoading={isLoading} />
          </motion.div>
          
          <AnimatePresence mode="wait">
            {isLoading && (
              <motion.div 
                key="loading"
                className="intelligence-loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                INTERROGATING EVIDENCE DATABASE...
              </motion.div>
            )}
            
            {answer && !isLoading && (
              <motion.div 
                key="answer"
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }}
              >
                <AIAnswer 
                  answer={answer} 
                  selectedCitationId={selectedCitation?.id || null}
                  onCitationSelect={setSelectedCitation}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
        
        <AnimatePresence mode="wait">
          {selectedCitation && (
            <motion.aside 
              className="intel-qa-sidebar"
              key="citation-panel"
              initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 20 }}
              animate={{ opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } }}
              exit={{ opacity: 0, x: shouldReduceMotion ? 0 : 20, transition: { duration: 0.3 } }}
            >
              <CitationPanel 
                citation={selectedCitation} 
                onViewSource={(versionId) => setActiveDocumentId(versionId)} 
              />
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {activeDocumentId && (
          <DocumentViewerOverlay 
            documentId={activeDocumentId} 
            onClose={() => setActiveDocumentId(null)} 
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
