import { useState, useMemo } from 'react';
import { Search, Copy } from 'lucide-react';
import type { DocumentEntity } from '../../types/extraction';
import './ExtractedTextPanel.css';

interface ExtractedTextPanelProps {
  text: string;
  entities: DocumentEntity[];
}

export default function ExtractedTextPanel({ text, entities }: ExtractedTextPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Simple string replacement approach to inject highlights for entities.
  // In a real system, you'd use exact positional start/end indexes.
  const renderedContent = useMemo(() => {
    if (!text) return null;
    
    // 1. Sort entities by length descending to replace longest first (avoiding partial overlaps in simple string replace)
    const sortedEntities = [...entities].sort((a, b) => b.text.length - a.text.length);
    
    // We will split the text into chunks, then map over them. A robust approach is to build an AST or use a regex with replacer.
    // For demo purposes, we will construct a regex that matches any entity text.
    
    if (sortedEntities.length === 0 && !searchQuery) {
      return <span>{text}</span>;
    }

    const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    let regexParts = sortedEntities.map(e => escapeRegExp(e.text));
    if (searchQuery) {
      regexParts.push(escapeRegExp(searchQuery));
    }

    const regex = new RegExp(`(${regexParts.join('|')})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, i) => {
      // Check if it's a search match
      if (searchQuery && part.toLowerCase() === searchQuery.toLowerCase()) {
        return <span key={i} className="text-highlight search-highlight">{part}</span>;
      }
      
      // Check if it's an entity match
      const entity = sortedEntities.find(e => e.text.toLowerCase() === part.toLowerCase());
      if (entity) {
        return <span key={i} className={`text-highlight ${entity.type}`} title={`${entity.type}: ${entity.confidence}%`}>{part}</span>;
      }
      
      return <span key={i}>{part}</span>;
    });
  }, [text, entities, searchQuery]);

  const matchCount = useMemo(() => {
    if (!searchQuery) return 0;
    const regex = new RegExp(searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    const matches = text.match(regex);
    return matches ? matches.length : 0;
  }, [text, searchQuery]);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="data-panel" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <div className="data-panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 className="data-panel-title">EXTRACTED INTELLIGENCE</h3>
        <div className="extracted-text-actions" style={{ padding: 0, border: 'none', background: 'transparent' }}>
          <div className="extracted-search">
            <Search size={12} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder="SEARCH DOCUMENT..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && <span className="search-matches">{matchCount} MATCHES</span>}
          </div>
          <button className="btn-secondary" onClick={handleCopy} style={{ padding: '4px 8px', marginLeft: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Copy size={12} />
            <span style={{ fontSize: '10px' }}>COPY</span>
          </button>
        </div>
      </div>
      <div className="extracted-text-content">
        {renderedContent}
      </div>
    </div>
  );
}
