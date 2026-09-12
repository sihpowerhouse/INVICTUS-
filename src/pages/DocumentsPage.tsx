import { useState, useEffect, useMemo } from 'react';
import { motion, useReducedMotion, AnimatePresence, type Variants } from 'framer-motion';
import './DocumentsPage.css';
import type { Document } from '../types/document';
import { documentService } from '../services/documentService';
import DocumentCommandBar, { type DocumentFiltersState } from '../components/documents/DocumentCommandBar';
import DocumentList from '../components/documents/DocumentList';
import DocumentUpload from '../components/documents/DocumentUpload';

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const initialFilters: DocumentFiltersState = {
    searchQuery: '',
    type: 'ALL',
    status: 'ALL',
    language: 'ALL'
  };

  const [filters, setFilters] = useState<DocumentFiltersState>(initialFilters);

  useEffect(() => {
    let mounted = true;
    documentService.getDocuments().then(data => {
      if (mounted) {
        setDocuments(data);
        setIsLoading(false);
      }
    });
    return () => { mounted = false; };
  }, []);

  const handleUploadComplete = () => {
    setShowUpload(false);
    setIsLoading(true);
    documentService.getDocuments().then(data => {
      setDocuments(data);
      setIsLoading(false);
    });
  };

  const processedDocuments = useMemo(() => {
    return documents.filter(d => {
      if (filters.type !== 'ALL' && d.type !== filters.type) return false;
      if (filters.status !== 'ALL' && d.status !== filters.status) return false;
      if (filters.language !== 'ALL' && d.language !== filters.language) return false;
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        return (
          d.name.toLowerCase().includes(q) ||
          d.caseId.toLowerCase().includes(q) ||
          d.uploadedBy.toLowerCase().includes(q)
        );
      }
      return true;
    }).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [documents, filters]);

  // Grouping Logic
  const groupedDocuments = useMemo(() => {
    const groups: Record<string, Document[]> = {
      TODAY: [],
      YESTERDAY: [],
      'THIS WEEK': [],
      OLDER: []
    };

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    processedDocuments.forEach(d => {
      const date = new Date(d.updatedAt);
      if (date >= today) {
        groups.TODAY.push(d);
      } else if (date >= yesterday && date < today) {
        groups.YESTERDAY.push(d);
      } else if (date >= lastWeek && date < yesterday) {
        groups['THIS WEEK'].push(d);
      } else {
        groups.OLDER.push(d);
      }
    });

    return groups;
  }, [processedDocuments]);

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
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as any } }
  };

  return (
    <motion.div 
      className="documents-page"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div className="documents-page__header" variants={itemVariants}>
        <div className="documents-page__title-group">
          <p className="page-tag">INVICTUS / DOCUMENT INTELLIGENCE</p>
          <h1 className="documents-page__title">DOCUMENT REGISTRY</h1>
        </div>
        <div className="documents-page__actions">
          <button 
            className="btn-primary" 
            onClick={() => setShowUpload(!showUpload)}
          >
            {showUpload ? 'CANCEL UPLOAD' : '+ UPLOAD DOCUMENT'}
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {showUpload && (
          <DocumentUpload 
            onClose={() => setShowUpload(false)} 
            onComplete={handleUploadComplete} 
          />
        )}
      </AnimatePresence>

      <motion.div variants={itemVariants}>
        <DocumentCommandBar 
          filters={filters}
          onChange={setFilters}
          onReset={() => setFilters(initialFilters)}
        />
      </motion.div>

      {isLoading ? (
        <motion.div className="documents-page__loading" variants={itemVariants}>
          LOADING SECURE REGISTRY...
        </motion.div>
      ) : (
        <DocumentList groupedDocuments={groupedDocuments} itemVariants={itemVariants} />
      )}
    </motion.div>
  );
}
