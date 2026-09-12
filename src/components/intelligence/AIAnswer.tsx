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
        <p className="intel-answer-block__text">
          The available sources do not provide enough evidence to support a reliable conclusion.
        </p>
        <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(255, 176, 32, 0.05)', border: '1px solid rgba(255, 176, 32, 0.2)', borderRadius: 'var(--radius-sm)' }}>
          <div style={{ marginBottom: '16px' }}>
            <span className="intel-label" style={{ color: '#ffb020' }}>SOURCES REVIEWED</span>
            <div className="intel-value" style={{ marginTop: '4px', fontFamily: 'monospace' }}>14 Documents, 2 Media Files</div>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <span className="intel-label" style={{ color: '#ffb020' }}>RELEVANT EVIDENCE</span>
            <div className="intel-value" style={{ marginTop: '4px', fontFamily: 'monospace' }}>Partial match found in DOC-26190-004 (Page 12), but lacks definitive confirmation.</div>
          </div>
          <div>
            <span className="intel-label" style={{ color: '#ffb020' }}>WHAT IS MISSING</span>
            <div className="intel-value" style={{ marginTop: '4px', fontFamily: 'monospace' }}>Direct confirmation of the timeline of events between 14:00 and 16:00.</div>
          </div>
        </div>
      </div>
    );
  }

  if (answer.status === 'UNAUTHORIZED') {
    return (
      <div className="intel-answer-block intel-answer-block--error">
        <h3 className="intel-answer-block__title" style={{ color: '#ff3232' }}>SOURCE RESTRICTED</h3>
        <p className="intel-answer-block__text">ACCESS REQUIRED</p>
        <p className="intel-helper-text" style={{ marginTop: '16px' }}>
          Authorization level insufficient to interrogate the required evidence basis.
        </p>
      </div>
    );
  }

  return (
    <div className="intel-answer-block">
      <h3 className="intel-answer-block__title">ANALYTICAL CONCLUSION</h3>
      
      <div className="intel-answer-block__text">
        {answer.answer.split('\n').map((paragraph, i) => (
          paragraph ? <p key={i}>{paragraph}</p> : <br key={i} />
        ))}
      </div>

      <div className="intel-answer-block__evidence-section">
        <EvidenceBasis basis={answer.basis} />
        
        {answer.citations.length > 0 && (
          <div className="intel-citations-list">
            <span className="intel-label" style={{ marginBottom: '8px', display: 'block' }}>SUPPORTED BY</span>
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
