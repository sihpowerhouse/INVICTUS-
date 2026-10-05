import { useState } from 'react';
import './Security.css';

interface HashViewerProps {
  algorithm: string;
  hash: string;
  label: string;
}

export default function HashViewer({ algorithm, hash, label }: HashViewerProps) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const displayHash = expanded ? hash : `${hash.substring(0, 10)}...${hash.substring(hash.length - 10)}`;

  return (
    <div className="security-value-group" style={{ marginBottom: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="security-label">{label} ({algorithm})</span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            className="security-btn" 
            style={{ padding: '2px 6px', fontSize: '9px', border: 'none' }}
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'COLLAPSE' : 'EXPAND'}
          </button>
          <button 
            className="security-btn" 
            style={{ padding: '2px 6px', fontSize: '9px', border: 'none' }}
            onClick={handleCopy}
            aria-label="Copy hash"
          >
            {copied ? 'COPIED' : 'COPY'}
          </button>
        </div>
      </div>
      <div 
        className="security-value security-value--highlight" 
        style={{ 
          wordBreak: 'break-all', 
          background: 'rgba(0,0,0,0.3)', 
          padding: '8px', 
          borderRadius: '4px',
          border: '1px solid rgba(255,255,255,0.05)'
        }}
      >
        {displayHash}
      </div>
    </div>
  );
}
