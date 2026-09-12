import { motion, useReducedMotion } from 'framer-motion';
import './VersionHistory.css';
import type { Document } from '../../types/document';

interface VersionHistoryProps {
  document: Document;
}

export default function VersionHistory({ document: doc }: VersionHistoryProps) {
  const currentVersionNum = parseInt(doc.version.replace('v', '')) || 1;
  const shouldReduceMotion = useReducedMotion();
  
  const history = [];
  for (let i = currentVersionNum; i >= 1; i--) {
    history.push({
      version: `v${i}`,
      date: new Date(new Date(doc.updatedAt).getTime() - (currentVersionNum - i) * 86400000).toLocaleDateString(),
      user: i === currentVersionNum ? doc.uploadedBy : 'SYSTEM AUTO',
      status: i === currentVersionNum ? doc.status : 'SUPERSEDED',
      active: i === currentVersionNum
    });
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: shouldReduceMotion ? 0 : 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: shouldReduceMotion ? 0 : -10 },
    show: { opacity: 1, x: 0, transition: { duration: 0.3 } }
  };

  return (
    <div className="version-history">
      <div className="vh-header">
        <h3 className="vh-title">VERSION HISTORY</h3>
      </div>
      
      <motion.div 
        className="vh-timeline"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {history.map((item, idx) => (
          <motion.div 
            key={item.version} 
            className={`vh-item ${item.active ? 'active' : ''}`}
            variants={itemVariants}
          >
            <div className="vh-marker-container">
              <div className="vh-marker" />
              {idx < history.length - 1 && <div className="vh-line" />}
            </div>
            
            <div className="vh-content">
              <div className="vh-version-row">
                <span className="vh-version">{item.version}</span>
                <span className={`vh-status vh-status--${item.status.toLowerCase()}`}>
                  {item.status.replace('_', ' ')}
                </span>
              </div>
              <div className="vh-meta">
                <span className="vh-meta-date">{item.date}</span>
                <span className="vh-meta-sep">•</span>
                <span className="vh-meta-user">{item.user}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
