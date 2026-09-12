import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import type { Evidence } from '../../types/evidence';
import './EvidenceList.css';

interface EvidenceListItemProps {
  evidence: Evidence;
  isExpanded: boolean;
  onToggle: () => void;
  shouldReduceMotion: boolean | null;
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 2) return 'JUST NOW';
  if (mins < 60) return `${mins}M AGO`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}H AGO`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}D AGO`;
  return new Date(iso).toLocaleDateString();
}

const itemVariants = {
  hidden: { opacity: 0, y: 5 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

export function EvidenceListItem({ evidence, isExpanded, onToggle, shouldReduceMotion }: EvidenceListItemProps) {
  const navigate = useNavigate();
  const statusClass = `evd-badge--status-${evidence.status.toLowerCase()}`;
  const custodyClass = `evd-badge--custody-${evidence.custodyState.toLowerCase()}`;

  const lastEvent = evidence.custodyEvents.length > 0
    ? [...evidence.custodyEvents].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0]
    : null;

  return (
    <motion.div
      variants={shouldReduceMotion ? {} : itemVariants}
      className={`evd-item-wrapper ${isExpanded ? 'is-expanded' : ''}`}
    >
      <div
        className="evd-item"
        role="button"
        tabIndex={0}
        onClick={onToggle}
        onKeyDown={e => e.key === 'Enter' && onToggle()}
      >
        <span className="evd-item__id">{evidence.id}</span>

        <div className="evd-item__title-group">
          <span className="evd-item__title">{evidence.title}</span>
          <span className="evd-item__case">{evidence.caseId}</span>
        </div>

        <span className="evd-item__type">{evidence.type.replace(/_/g, ' ')}</span>

        <span className={`evd-badge ${statusClass}`}>
          {evidence.status.replace(/_/g, ' ')}
        </span>

        <span className={`evd-badge evd-item__custody-col ${custodyClass}`}>
          {evidence.custodyState.replace(/_/g, ' ')}
        </span>

        <div className="evd-item__activity">
          <span className="evd-item__activity-time">{relativeTime(evidence.lastActivityAt)}</span>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
            className="evd-item-expanded"
          >
            <div className="evd-expanded-grid">
              <div className="evd-exp-section">
                <span className="evd-exp-label">CURRENT CUSTODIAN</span>
                <span className="evd-exp-value">{evidence.currentHolder}</span>
                <span className="evd-exp-label" style={{ marginTop: '8px' }}>LOCATION</span>
                <span className="evd-exp-value">{evidence.location}</span>
              </div>
              <div className="evd-exp-section">
                <span className="evd-exp-label">LAST CUSTODY ACTION</span>
                {lastEvent ? (
                  <>
                    <span className="evd-exp-value">{lastEvent.action.replace(/_/g, ' ')} by {lastEvent.actor}</span>
                    <span className="evd-exp-subvalue">{new Date(lastEvent.timestamp).toLocaleString()}</span>
                  </>
                ) : (
                  <span className="evd-exp-value">No records</span>
                )}
              </div>
              <div className="evd-exp-section">
                <span className="evd-exp-label">INTEGRITY STATE</span>
                <span className={`evd-exp-value integrity-${evidence.integrity.state.toLowerCase()}`}>
                  {evidence.integrity.state}
                </span>
                <span className="evd-exp-label" style={{ marginTop: '8px' }}>LINKED ITEMS</span>
                <span className="evd-exp-value">
                  {evidence.relatedDocumentIds.length} Docs, {evidence.relatedMediaIds.length} Media
                </span>
              </div>
              <div className="evd-exp-action">
                <button
                  className="btn-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/evidence/${evidence.id}`);
                  }}
                >
                  OPEN EVIDENCE
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

interface EvidenceListProps {
  evidence: Evidence[];
}

export default function EvidenceList({ evidence }: EvidenceListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const shouldReduceMotion = useReducedMotion();

  if (evidence.length === 0) {
    return (
      <div className="evd-list">
        <div className="evd-list__empty">NO EVIDENCE RECORDS MATCH CURRENT FILTERS</div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: shouldReduceMotion ? 0 : 0.05 }
    }
  };

  return (
    <div className="evd-list">
      <div className="evd-list__header">
        <span className="evd-list__col-label">EVIDENCE ID</span>
        <span className="evd-list__col-label">TITLE / CASE</span>
        <span className="evd-list__col-label">TYPE</span>
        <span className="evd-list__col-label">STATUS</span>
        <span className="evd-list__col-label">CUSTODY</span>
        <span className="evd-list__col-label">LAST ACTIVITY</span>
      </div>
      
      <motion.div
        className="evd-list__body"
        variants={shouldReduceMotion ? {} : containerVariants}
        initial="hidden"
        animate="show"
      >
        {evidence.map(e => (
          <EvidenceListItem 
            key={e.id} 
            evidence={e} 
            isExpanded={expandedId === e.id}
            onToggle={() => setExpandedId(expandedId === e.id ? null : e.id)}
            shouldReduceMotion={shouldReduceMotion}
          />
        ))}
      </motion.div>
    </div>
  );
}
