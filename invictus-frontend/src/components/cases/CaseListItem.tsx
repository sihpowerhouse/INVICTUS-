import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import './CaseListItem.css';
import type { Case } from '../../types/case';
import CaseStatusBadge from './CaseStatusBadge';

interface CaseListItemProps {
  caseData: Case;
  isExpanded: boolean;
  onToggle: () => void;
}

export default function CaseListItem({ caseData, isExpanded, onToggle }: CaseListItemProps) {
  const shouldReduceMotion = useReducedMotion();

  const previewVariants: import('framer-motion').Variants = {
    hidden: { 
      opacity: 0, 
      height: 0, 
      marginTop: 0 
    },
    visible: { 
      opacity: 1, 
      height: 'auto',
      marginTop: 16,
      transition: {
        height: { duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] },
        opacity: { duration: 0.2, delay: 0.1 }
      }
    },
    exit: { 
      opacity: 0, 
      height: 0, 
      marginTop: 0,
      transition: {
        height: { duration: 0.2, ease: [0.04, 0.62, 0.23, 0.98] },
        opacity: { duration: 0.1 }
      }
    }
  };

  return (
    <motion.div 
      layout={!shouldReduceMotion}
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`case-list-row ${isExpanded ? 'case-list-row--expanded' : ''}`}
    >
      <div 
        className="case-list-row__grid" 
        onClick={onToggle}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onToggle()}
      >
        <div className="case-col-id">
          {caseData.isNew && <span className="case-col-id__new">NEW</span>}
          {caseData.id}
        </div>
        <div className="case-col-title">
          {caseData.title}
        </div>
        <div className="case-col-status">
          <CaseStatusBadge type="status" value={caseData.status} />
        </div>
        <div className="case-col-priority">
          <CaseStatusBadge type="priority" value={caseData.priority} />
        </div>
        <div className="case-col-owner">
          <div className="case-owner-name">{caseData.officer}</div>
          <div className="case-owner-dept">{caseData.department}</div>
        </div>
        <div className="case-col-activity">
          {caseData.lastActivity}
        </div>
        <div className="case-col-action">
          {isExpanded ? '↓' : '→'}
        </div>
      </div>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div 
            className="case-list-row__preview-wrapper"
            variants={shouldReduceMotion ? undefined : previewVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ overflow: 'hidden' }}
          >
            <div className="case-list-row__preview">
              <div className="case-preview-content">
                <div className="case-preview-desc">
                  <span className="case-preview-label">SUMMARY</span>
                  <p>{caseData.description}</p>
                  
                  {caseData.attention && caseData.attention !== 'NONE' && (
                    <div style={{ marginTop: '12px' }}>
                      <CaseStatusBadge type="attention" value={caseData.attention} label={caseData.attentionDetails} />
                    </div>
                  )}
                </div>
                
                <div className="case-preview-stats">
                  <div className="case-preview-stat">
                    <span className="case-preview-label">DOCS</span>
                    <span className="case-preview-value">{caseData.documentsCount}</span>
                  </div>
                  <div className="case-preview-stat">
                    <span className="case-preview-label">EVIDENCE</span>
                    <span className="case-preview-value">{caseData.evidenceCount}</span>
                  </div>
                  <div className="case-preview-stat">
                    <span className="case-preview-label">PERSONS</span>
                    <span className="case-preview-value">{caseData.personsCount}</span>
                  </div>
                </div>
              </div>
              
              <div className="case-preview-actions">
                <Link to={`/cases/${caseData.id}`} className="btn-open-case">
                  <span className="btn-text">OPEN CASE</span>
                  <span className="btn-arrow">&rarr;</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
