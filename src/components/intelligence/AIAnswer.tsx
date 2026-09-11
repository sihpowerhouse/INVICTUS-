import './Intelligence.css';
import type { AIAnswer as IAIAnswer, Citation as ICitation } from '../../types/intelligence';
import EvidenceBasis from './EvidenceBasis';
import Citation from './Citation';

interface AIAnswerProps {
  answer: IAIAnswer | null;
  selectedCitationId: string | null;
  onCitationSelect: (citation: ICitation) => void;
}

export default function AIAnswer({ answer, selectedCitationId, onCitationSelect }: AIAnswerProps) {
  if (!answer) return null;

  if (answer.status === 'INSUFFICIENT_EVIDENCE') {
    return (
      <div className="intel-answer-block intel-answer-block--warning">
        <h3 className="intel-answer-block__title" style={{ color: '#ffb020' }}>INSUFFICIENT EVIDENCE</h3>
        <p className="intel-answer-block__text">{answer.answer}</p>
        <p className="intel-helper-text" style={{ marginTop: '16px' }}>
          Suggested action: Refine the question or review the available source documents.
        </p>
      </div>
    );
  }

  if (answer.status === 'UNAUTHORIZED') {
    return (
      <div className="intel-answer-block intel-answer-block--error">
        <h3 className="intel-answer-block__title" style={{ color: '#ff3232' }}>SOURCE NOT AVAILABLE</h3>
        <p className="intel-answer-block__text">{answer.answer}</p>
      </div>
    );
  }

  return (
    <div className="intel-answer-block">
      <h3 className="intel-answer-block__title">ANSWER</h3>
      
      {/* Format newlines as paragraphs */}
      <div className="intel-answer-block__text">
        {answer.answer.split('\n').map((paragraph, i) => (
          paragraph ? <p key={i}>{paragraph}</p> : <br key={i} />
        ))}
      </div>

      <div className="intel-answer-block__evidence-section">
        <EvidenceBasis basis={answer.basis} />
        
        {answer.citations.length > 0 && (
          <div className="intel-citations-list">
            {answer.citations.map((cit, i) => (
              <Citation 
                key={cit.id}
                citation={cit}
                index={i}
                isSelected={selectedCitationId === cit.id}
                onClick={() => onCitationSelect(cit)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
