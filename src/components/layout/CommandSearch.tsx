import { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './CommandSearch.css';

interface MockSearchResult {
  id: string;
  type: 'CASE' | 'DOCUMENT' | 'EVIDENCE' | 'PERSON' | 'LOCATION' | 'FIR';
  title: string;
  meta: string;
  route: string;
}

const MOCK_RESULTS: MockSearchResult[] = [
  { id: '1', type: 'CASE', title: 'Operation Alpha', meta: 'INV-2026-892', route: '/documents?view=cases' },
  { id: '2', type: 'DOCUMENT', title: 'Financial Audit Report', meta: 'DOC-883-A', route: '/documents' },
  { id: '3', type: 'EVIDENCE', title: 'Seized Hard Drive (WD 2TB)', meta: 'EV-44-12', route: '/documents?view=evidence' },
  { id: '4', type: 'PERSON', title: 'John Doe', meta: 'Suspect / Primary', route: '/documents?view=cases' },
];

export default function CommandSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setQuery('');
  };

  // Keyboard shortcut (Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        handleOpen();
      }
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const filteredResults = MOCK_RESULTS.filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase()) || 
    item.meta.toLowerCase().includes(query.toLowerCase()) ||
    item.type.toLowerCase().includes(query.toLowerCase())
  );

  const handleResultClick = (route: string) => {
    navigate(route);
    handleClose();
  };

  return (
    <>
      <button 
        className="command-search__trigger" 
        onClick={handleOpen}
        aria-label="Search cases, documents, evidence"
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Search size={14} />
          SEARCH...
        </span>
        <span className="command-search__shortcut">
          <span>CTRL</span>
          <span>K</span>
        </span>
      </button>

      {isOpen && (
        <div className="command-search__overlay" onClick={handleClose}>
          <div 
            className="command-search__modal" 
            role="dialog" 
            aria-modal="true" 
            aria-label="Command Search"
            onClick={e => e.stopPropagation()}
          >
            <div className="command-search__header">
              <Search size={18} className="command-search__icon" />
              <input
                ref={inputRef}
                type="text"
                className="command-search__input"
                placeholder="SEARCH CASES / DOCUMENTS / EVIDENCE..."
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
              <button 
                className="command-search__close" 
                onClick={handleClose}
                aria-label="Close search"
              >
                ESC
              </button>
            </div>

            <div className="command-search__content">
              {filteredResults.length === 0 ? (
                <div className="command-search__empty">NO RESULTS FOUND</div>
              ) : (
                <>
                  <div className="command-search__category">Mock Results</div>
                  {filteredResults.map(result => (
                    <button 
                      key={result.id} 
                      className="command-search__item"
                      onClick={() => handleResultClick(result.route)}
                    >
                      <div className="command-search__item-main">
                        <span className="command-search__item-title">{result.title}</span>
                        <span className="command-search__item-meta">{result.meta}</span>
                      </div>
                      <span className="command-search__item-badge">{result.type}</span>
                    </button>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
