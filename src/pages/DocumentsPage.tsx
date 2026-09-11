import { useState, useEffect, useMemo } from 'react';
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

  return (
    <div className="documents-page">
      <div className="documents-page__header">
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
      </div>

      {showUpload && (
        <DocumentUpload 
          onClose={() => setShowUpload(false)} 
          onComplete={handleUploadComplete} 
        />
      )}

      <DocumentCommandBar 
        filters={filters}
        onChange={setFilters}
        onReset={() => setFilters(initialFilters)}
      />

      {isLoading ? (
        <div className="documents-page__loading">LOADING SECURE REGISTRY...</div>
      ) : (
        <DocumentList documents={processedDocuments} />
      )}
    </div>
  );
}
