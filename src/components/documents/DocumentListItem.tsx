import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import type { Document } from '../../types/document';
import './DocumentListItem.css';

interface DocumentListItemProps {
  document: Document;
  itemVariants?: any;
}

export default function DocumentListItem({ document: doc, itemVariants }: DocumentListItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  
  const statusClass = `doc-badge--status-${doc.status.toLowerCase()}`;
  
  const formattedDate = new Date(doc.updatedAt).toLocaleDateString(undefined, {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

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

  const handleRowClick = (e: React.MouseEvent) => {
    // If clicking a link/button, don't toggle
    if ((e.target as HTMLElement).closest('a, button')) return;
    setIsExpanded(!isExpanded);
  };

  return (
    <motion.div 
      className={`doc-list-item ${isExpanded ? 'is-expanded' : ''}`}
      variants={itemVariants}
      layout={!shouldReduceMotion}
      onClick={handleRowClick}
    >
      <div className="doc-list-item__grid">
        <div className="doc-col-document">
          <span className="doc-id-mono">{doc.id.substring(0, 8)}</span>
          <span className="doc-title-text">{doc.name}</span>
        </div>
        
        <div className="doc-col-type">
          <span className="doc-type-text">{doc.type.replace('_', ' ')}</span>
        </div>

        <div className="doc-col-case">
          <Link to={`/cases/${doc.caseId}`} className="doc-case-link" onClick={e => e.stopPropagation()}>
            {doc.caseId}
          </Link>
        </div>

        <div className="doc-col-version">
          <span className="doc-version-text">{doc.version}</span>
        </div>

        <div className="doc-col-status">
          <span className={`doc-status-indicator ${statusClass}`}>
            <span className="doc-status-dot"></span>
            {doc.status.replace('_', ' ')}
          </span>
        </div>

        <div className="doc-col-confidence">
          <span className="doc-confidence-text">
            {doc.ocrConfidence ? `${(doc.ocrConfidence * 100).toFixed(0)}%` : '--'}
          </span>
        </div>

        <div className="doc-col-date">
          <span className="doc-date-text">{formattedDate}</span>
        </div>

        <div className="doc-col-action">
          <button 
            className="btn-doc-inspect"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/documents/${doc.id}`);
            }}
          >
            INSPECT &rarr;
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            className="doc-list-item__preview"
            variants={previewVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="doc-preview-grid">
              <div className="doc-preview-section">
                <span className="doc-preview-label">CONFIDENTIALITY</span>
                <span className="doc-preview-value">{doc.confidentiality || 'RESTRICTED'}</span>
              </div>
              <div className="doc-preview-section">
                <span className="doc-preview-label">FILE SIZE</span>
                <span className="doc-preview-value">{doc.size}</span>
              </div>
              <div className="doc-preview-section">
                <span className="doc-preview-label">PAGES</span>
                <span className="doc-preview-value">{doc.pages}</span>
              </div>
              <div className="doc-preview-section">
                <span className="doc-preview-label">UPLOADED BY</span>
                <span className="doc-preview-value">{doc.uploadedBy}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
