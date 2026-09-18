import { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import './VersionHistory.css';

interface VersionHistoryProps {
  versions: any[];
  documentStatus: string;
  selectedVersionId: string;
}

export default function VersionHistory({ versions, documentStatus, selectedVersionId }: VersionHistoryProps) {
  const shouldReduceMotion = useReducedMotion();
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    if (!versions || versions.length === 0) {
      setHistory([]);
      return;
    }
    
    // The backend returns them ordered by version_number. Let's reverse them for display (newest first)
    const reversed = [...versions].reverse();
    
    const mapped = reversed.map((item: any, idx: number) => ({
      version: `v${item.version_number || (versions.length - idx)}`,
      date: new Date(item.created_at || item.timestamp).toLocaleDateString(),
      user: item.uploaded_by || item.verified_by || 'SYSTEM AUTO',
      status: item.version_id === selectedVersionId ? documentStatus : 'SUPERSEDED',
      active: item.version_id === selectedVersionId
    }));
    setHistory(mapped);
  }, [versions, documentStatus, selectedVersionId]);

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
        {history.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.9rem' }}>
            VERSION DATA UNAVAILABLE
          </div>
        ) : (
          history.map((item, idx) => (
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
          ))
        )}
      </motion.div>
    </div>
  );
}
