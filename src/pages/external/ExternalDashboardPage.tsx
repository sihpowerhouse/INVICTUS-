import { useState, useEffect } from 'react';
import { FileText, Eye, Shield } from 'lucide-react';
import { accessService } from '../../services/accessService';
import type { Document } from '../../types/document';
import DocumentViewerOverlay from '../../components/documents/DocumentViewerOverlay';
import { AnimatePresence } from 'framer-motion';

export default function ExternalDashboardPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeDocumentId, setActiveDocumentId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    accessService.getAuthorizedDocuments().then(data => {
      if (mounted) {
        setDocuments(data);
        setIsLoading(false);
      }
    });
    return () => { mounted = false; };
  }, []);

  return (
    <div style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <h1 style={{ color: 'var(--accent)', margin: 0 }}>EXTERNAL DASHBOARD</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--status-success)', border: '1px solid var(--status-success)', padding: '4px 8px', fontSize: '11px' }}>
          <Shield size={14} />
          SECURE SESSION
        </div>
      </div>
      
      <p style={{ color: 'var(--text-secondary)' }}>
        Authorized documents for your account. Internal cases and unrestricted search are disabled.
      </p>
      
      <div style={{ marginTop: '2rem' }}>
        {isLoading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            LOADING AUTHORIZED RESOURCES...
          </div>
        ) : documents.length === 0 ? (
          <div style={{ 
            border: '1px solid var(--border)', 
            padding: '2rem',
            background: 'var(--bg-panel)',
            textAlign: 'center'
          }}>
            <div style={{ color: 'var(--text-muted)' }}>
              [ NO DOCUMENTS CURRENTLY SHARED WITH THIS ACCOUNT ]
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {documents.map(doc => (
              <div key={doc.id} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem',
                border: '1px solid var(--border)',
                background: 'var(--bg-panel)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    background: 'var(--bg-base)', 
                    border: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-muted)'
                  }}>
                    <FileText size={20} />
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>{doc.name}</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '11px', marginTop: '4px' }}>
                      {doc.id} &bull; {doc.type.replace('_', ' ')} &bull; {doc.caseId}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ color: 'var(--accent)', fontSize: '11px', border: '1px solid var(--accent)', padding: '2px 6px' }}>
                    READ ONLY
                  </span>
                  <button 
                    onClick={() => setActiveDocumentId(doc.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: 'var(--accent)',
                      color: '#000',
                      border: 'none',
                      padding: '8px 16px',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 'bold',
                      fontSize: '12px'
                    }}
                  >
                    <Eye size={14} />
                    VIEW
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {activeDocumentId && (
          <DocumentViewerOverlay 
            documentId={activeDocumentId} 
            onClose={() => setActiveDocumentId(null)} 
            permission="READ ONLY"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
