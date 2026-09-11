import { useState } from 'react';
import './IntelligenceSearchPage.css';
import { intelligenceService } from '../services/intelligenceService';
import type { SearchResult as ISearchResult, SearchMode } from '../types/intelligence';

import SearchBar from '../components/intelligence/SearchBar';
import SearchFilters from '../components/intelligence/SearchFilters';
import SearchResult from '../components/intelligence/SearchResult';
import SourcePreview from '../components/intelligence/SourcePreview';

export default function IntelligenceSearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ISearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedResult, setSelectedResult] = useState<ISearchResult | null>(null);

  const handleSearch = async (newQuery: string, newMode: SearchMode) => {
    setQuery(newQuery);
    setIsLoading(true);
    setHasSearched(true);
    setSelectedResult(null);

    const data = await intelligenceService.search(newQuery, {}, newMode);
    setResults(data);
    setIsLoading(false);
  };

  const handleFilterChange = (filters: any) => {
    // In a real app, this would trigger a new search with filters
    console.log('Filters updated:', filters);
  };

  return (
    <div className="intel-search-page">
      <div className="intel-search-page__header">
        <p className="page-tag">INVICTUS / INTELLIGENCE</p>
        <h1 className="page-title">CASE INTELLIGENCE</h1>
      </div>

      <SearchBar initialQuery={query} onSearch={handleSearch} />

      <div className="intel-search-page__layout">
        <aside className="intel-filters-sidebar">
          <SearchFilters onFilterChange={handleFilterChange} />
        </aside>

        <main className="intel-results-main">
          {!hasSearched ? (
            <div className="intelligence-empty">
              ENTER A QUERY TO SEARCH THE INTELLIGENCE DATABASE
            </div>
          ) : isLoading ? (
            <div className="intelligence-loading">
              ANALYZING SOURCES...
            </div>
          ) : results.length === 0 ? (
            <div className="intelligence-empty">
              NO RESULTS FOUND FOR THE GIVEN QUERY
            </div>
          ) : (
            <>
              <div className="intel-results-count">
                FOUND {results.length} EVIDENCE MATCHES
              </div>
              {results.map(result => (
                <SearchResult 
                  key={result.id} 
                  result={result} 
                  isSelected={selectedResult?.id === result.id}
                  onClick={() => setSelectedResult(result)}
                />
              ))}
            </>
          )}
        </main>

        <aside className="intel-preview-sidebar">
          <SourcePreview result={selectedResult} />
        </aside>
      </div>
    </div>
  );
}
