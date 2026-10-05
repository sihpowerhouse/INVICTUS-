import { useState, useRef, useEffect } from 'react';
import './Intelligence.css';
import type { SearchMode } from '../../types/intelligence';

interface SearchBarProps {
  initialQuery?: string;
  onSearch: (query: string, mode: SearchMode) => void;
}

export default function SearchBar({ initialQuery = '', onSearch }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const [mode, setMode] = useState<SearchMode>('SEMANTIC');
  const inputRef = useRef<HTMLInputElement>(null);

  // Ctrl+K to focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query, mode);
    }
  };

  const clearSearch = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  return (
    <div className="intel-search-bar-container">
      <form onSubmit={handleSubmit} className="intel-search-bar" role="search">
        <span className="intel-search-icon">🔍</span>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="SEARCH CASES / DOCUMENTS / EVIDENCE... (Ctrl+K)"
          className="intel-search-input"
          aria-label="Intelligence Search"
        />
        {query && (
          <button type="button" onClick={clearSearch} className="intel-search-clear" aria-label="Clear search">
            ✕
          </button>
        )}
        <div className="intel-search-divider"></div>
        <div className="intel-search-mode" role="radiogroup" aria-label="Search Mode">
          <label className={`intel-mode-label ${mode === 'KEYWORD' ? 'intel-mode-label--active' : ''}`}>
            <input type="radio" name="mode" value="KEYWORD" checked={mode === 'KEYWORD'} onChange={() => setMode('KEYWORD')} />
            KEYWORD
          </label>
          <label className={`intel-mode-label ${mode === 'SEMANTIC' ? 'intel-mode-label--active' : ''}`}>
            <input type="radio" name="mode" value="SEMANTIC" checked={mode === 'SEMANTIC'} onChange={() => setMode('SEMANTIC')} />
            SEMANTIC
          </label>
          <label className={`intel-mode-label ${mode === 'HYBRID' ? 'intel-mode-label--active' : ''}`}>
            <input type="radio" name="mode" value="HYBRID" checked={mode === 'HYBRID'} onChange={() => setMode('HYBRID')} />
            HYBRID
          </label>
        </div>
      </form>
    </div>
  );
}
