import { useState } from 'react';
import { motion, useReducedMotion, type Variants, AnimatePresence } from 'framer-motion';
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
  const shouldReduceMotion = useReducedMotion();

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
    console.log('Filters updated:', filters);
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.05
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <motion.div 
      className="intel-search-page"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div className="intel-search-page__header" variants={itemVariants}>
        <p className="page-tag">INVICTUS / INTELLIGENCE</p>
        <h1 className="page-title">CASE INTELLIGENCE</h1>
      </motion.div>

      <motion.div variants={itemVariants}>
        <SearchBar initialQuery={query} onSearch={handleSearch} />
      </motion.div>

      <div className="intel-search-page__layout">
        <motion.aside className="intel-filters-sidebar" variants={itemVariants}>
          <SearchFilters onFilterChange={handleFilterChange} />
        </motion.aside>

        <main className="intel-results-main">
          {!hasSearched ? (
            <motion.div className="intelligence-empty" variants={itemVariants}>
              ENTER A QUERY TO SEARCH THE INTELLIGENCE DATABASE
            </motion.div>
          ) : isLoading ? (
            <motion.div className="intelligence-loading" variants={itemVariants}>
              ANALYZING SOURCES...
            </motion.div>
          ) : results.length === 0 ? (
            <motion.div className="intelligence-empty" variants={itemVariants}>
              NO RESULTS FOUND FOR THE GIVEN QUERY
            </motion.div>
          ) : (
            <motion.div 
              variants={containerVariants} 
              initial="hidden" 
              animate="show"
              className="intel-results-list"
            >
              <motion.div className="intel-results-count" variants={itemVariants}>
                FOUND {results.length} EVIDENCE MATCHES
              </motion.div>
              {results.map(result => (
                <motion.div key={result.id} variants={itemVariants}>
                  <SearchResult 
                    result={result} 
                    isSelected={selectedResult?.id === result.id}
                    onClick={() => setSelectedResult(result)}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </main>

        <AnimatePresence mode="wait">
          {selectedResult && (
            <motion.aside 
              className="intel-preview-sidebar"
              key="source-preview"
              initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 20 }}
              animate={{ opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } }}
              exit={{ opacity: 0, x: shouldReduceMotion ? 0 : 20, transition: { duration: 0.3 } }}
            >
              <SourcePreview result={selectedResult} />
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
