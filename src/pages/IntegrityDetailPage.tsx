import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './IntegrityDetailPage.css';
import { securityService } from '../services/securityService';
import type { DocumentIntegrity } from '../types/security';

import HashViewer from '../components/security/HashViewer';
import VersionChain from '../components/security/VersionChain';
import SignatureStatus from '../components/security/SignatureStatus';
import MerkleTree from '../components/security/MerkleTree';
import VerificationResult from '../components/security/VerificationResult';

export default function IntegrityDetailPage() {
  const { documentId } = useParams();
  const [data, setData] = useState<DocumentIntegrity | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!documentId) return;
    
    let mounted = true;
    securityService.getDocumentIntegrity(documentId).then(res => {
      if (mounted) {
        setData(res);
        setIsLoading(false);
      }
    });
    return () => { mounted = false; };
  }, [documentId]);

  return (
    <div className="integrity-detail-page">
      <div className="integrity-detail-page__header">
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
          <Link to="/integrity" className="intel-btn-text">INTEGRITY CENTER</Link>
          <span style={{ color: 'var(--text-muted)', fontFamily: 'monospace', fontSize: '11px' }}>/</span>
          <span style={{ color: 'var(--text-secondary)', fontFamily: 'monospace', fontSize: '11px' }}>{documentId}</span>
        </div>
        <h1 className="page-title">DOCUMENT INTEGRITY</h1>
      </div>

      {isLoading || !data ? (
        <div className="intelligence-loading">VERIFYING CRYPTOGRAPHIC PROOFS...</div>
      ) : (
        <div className="integrity-detail-page__layout">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <VerificationResult />
            
            <div className="security-panel">
              <div className="security-panel__header">
                <h3 className="security-panel__title">CRYPTOGRAPHIC HASH</h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div className="security-value-group">
                  <span className="security-label">DOCUMENT</span>
                  <span className="security-value">{data.documentName}</span>
                </div>
                <div className="security-value-group">
                  <span className="security-label">CASE</span>
                  <span className="security-value">{data.caseId}</span>
                </div>
              </div>
              <HashViewer algorithm={data.hash.algorithm} hash={data.hash.currentHash} label="CURRENT HASH" />
              {data.hash.previousHash && (
                <HashViewer algorithm={data.hash.algorithm} hash={data.hash.previousHash} label="PREVIOUS HASH" />
              )}
            </div>

            <SignatureStatus signature={data.signature} />
            <MerkleTree nodes={data.merkleNodes} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <VersionChain versions={data.versions} />
          </div>
        </div>
      )}
    </div>
  );
}
