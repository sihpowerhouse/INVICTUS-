import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './IntegrityDetailPage.css';
import { securityService } from '../services/securityService';
import { documentService } from '../services/documentService';
import type { DocumentIntegrity, CaseMerkleVerification, MerkleNode } from '../types/security';

import HashViewer from '../components/security/HashViewer';
import VersionChain from '../components/security/VersionChain';
import SignatureStatus from '../components/security/SignatureStatus';
import MerkleTree from '../components/security/MerkleTree';
import VerificationResult from '../components/security/VerificationResult';

export default function IntegrityDetailPage() {
  const { documentId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<DocumentIntegrity | null>(null);
  const [caseMerkle, setCaseMerkle] = useState<CaseMerkleVerification | null>(null);
  const [syntheticMerkleNodes, setSyntheticMerkleNodes] = useState<MerkleNode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBuilding, setIsBuilding] = useState(false);

  useEffect(() => {
    if (!documentId) return;
    
    let mounted = true;
    
    const fetchData = async () => {
      try {
        const integrityData = await securityService.getDocumentIntegrity(documentId);
        let merkleData: CaseMerkleVerification | null = null;
        
        // Retrieve real case_id via document versions endpoint since verify does not return it
        const docInfo = await documentService.getDocumentById(documentId);
        const caseId = docInfo?.caseId;
        
        if (caseId && integrityData) {
          integrityData.caseId = caseId;
          try {
            merkleData = await securityService.verifyMerkle(caseId);
          } catch (err) {
            console.warn("Could not fetch case merkle integrity", err);
          }
        }
        
        if (mounted) {
          setData(integrityData);
          setCaseMerkle(merkleData);
          
          if (merkleData?.root_hash) {
            setSyntheticMerkleNodes([{
              id: 'case_root',
              hash: merkleData.root_hash,
              label: 'CASE MERKLE ROOT',
              type: 'ROOT',
              children: [],
              parentId: null
            }]);
          }
          
          setIsLoading(false);
        }
      } catch (err) {
        console.error(err);
        if (mounted) setIsLoading(false);
      }
    };

    fetchData();
    return () => { mounted = false; };
  }, [documentId]);

  const handleBuildMerkle = async () => {
    if (!data?.caseId || data.caseId === 'N/A' || isBuilding) return;
    setIsBuilding(true);
    try {
      await securityService.buildMerkle(data.caseId);
      const newMerkleData = await securityService.verifyMerkle(data.caseId);
      setCaseMerkle(newMerkleData);
      if (newMerkleData?.root_hash) {
        setSyntheticMerkleNodes([{
          id: 'case_root',
          hash: newMerkleData.root_hash,
          label: 'CASE MERKLE ROOT',
          type: 'ROOT',
          children: [],
          parentId: null
        }]);
      }
    } catch (err) {
      console.error("Failed to build merkle tree", err);
    } finally {
      setIsBuilding(false);
    }
  };

  return (
    <div className="integrity-detail-page">
      <div className="integrity-detail-page__header">
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
          <Link to="/integrity" className="intel-btn-text">INTEGRITY CENTER</Link>
          <span style={{ color: 'var(--text-muted)', fontFamily: 'monospace', fontSize: '11px' }}>/</span>
          <span style={{ color: 'var(--text-secondary)', fontFamily: 'monospace', fontSize: '11px' }}>{documentId}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <h1 className="page-title">DOCUMENT INTEGRITY</h1>
          <button className="intel-btn-outline" onClick={() => navigate(`/audit?targetId=${documentId}`)} style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>
            [ VIEW AUDIT TRAIL ]
          </button>
        </div>
      </div>

      {isLoading || !data ? (
        <div className="intelligence-loading">VERIFYING CRYPTOGRAPHIC PROOFS...</div>
      ) : (
        <div className="integrity-detail-page__layout">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <VerificationResult 
              documentStatus={data.status} 
              caseMerkleValid={caseMerkle?.valid} 
            />
            
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
            
            <div style={{ position: 'relative' }}>
              <MerkleTree nodes={syntheticMerkleNodes} />
              {data.caseId && data.caseId !== 'N/A' && (
                <button 
                  onClick={handleBuildMerkle}
                  disabled={isBuilding}
                  style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    background: 'rgba(0, 230, 118, 0.1)',
                    border: '1px solid rgba(0, 230, 118, 0.4)',
                    color: '#00e676',
                    padding: '4px 12px',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                    cursor: isBuilding ? 'not-allowed' : 'pointer',
                    borderRadius: '4px',
                    opacity: isBuilding ? 0.6 : 1
                  }}
                >
                  {isBuilding ? '[ BUILDING... ]' : (caseMerkle?.root_hash ? '[ REBUILD CASE MERKLE ROOT ]' : '[ BUILD CASE MERKLE ROOT ]')}
                </button>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <VersionChain versions={data.versions} />
          </div>
        </div>
      )}
    </div>
  );
}
