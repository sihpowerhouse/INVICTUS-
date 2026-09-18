import { useState, useEffect, useMemo } from 'react';
import { motion, useReducedMotion, AnimatePresence, type Variants } from 'framer-motion';
import './DocumentsPage.css';
import type { Document } from '../types/document';
import { documentService } from '../services/documentService';
import { ElevationRequiredError } from '../services/document/apiDocumentAdapter';
import { securityService } from '../services/securityService';
import OTPModal from '../components/common/OTPModal';
import DocumentCommandBar, { type DocumentFiltersState } from '../components/documents/DocumentCommandBar';
import DocumentList from '../components/documents/DocumentList';
import DocumentUpload from '../components/documents/DocumentUpload';
import DocumentsWorkspaceNav, { type WorkspaceView } from '../components/documents/DocumentsWorkspaceNav';
import { useSearchParams } from 'react-router-dom';

import CasesPage from './CasesPage';
import EvidencePage from './EvidencePage';
import MediaPage from './MediaPage';
import IntelligenceTimelinePage from './IntelligenceTimelinePage';

// VIEW_FILES OTP purpose — must match backend purposes set exactly.
const VIEW_FILES_PURPOSE = 'VIEW_FILES';

export default function DocumentsPage() {
  const [documents, setDocuments]     = useState<Document[]>([]);
  const [isLoading, setIsLoading]     = useState(true);
  const [loadError, setLoadError]     = useState<string | null>(null);
  const [showUpload, setShowUpload]   = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const [searchParams] = useSearchParams();

  // ── OTP elevation state ──────────────────────────────────────────────────
  // 'none'     → not needed or already granted
  // 'required' → 403 received, OTP modal should be shown
  // 'elevated' → elevation granted this session
  const [elevationState, setElevationState] = useState<'none' | 'required' | 'elevated'>('none');
  const [showOTPModal, setShowOTPModal]     = useState(false);

  const currentView = (searchParams.get('view') as WorkspaceView) || 'all';

  const initialFilters: DocumentFiltersState = {
    searchQuery: '',
    type: 'ALL',
    status: 'ALL',
    language: 'ALL'
  };

  const [filters, setFilters] = useState<DocumentFiltersState>(initialFilters);

  // ── Load documents ───────────────────────────────────────────────────────
  const loadDocuments = (mounted: { current: boolean }) => {
    setIsLoading(true);
    setLoadError(null);

    documentService.getDocuments()
      .then(data => {
        if (!mounted.current) return;
        setDocuments(data);
        setIsLoading(false);
        // Successfully got data → elevation is active (or no docs exist)
        setElevationState('elevated');
      })
      .catch(err => {
        if (!mounted.current) return;

        if (err instanceof ElevationRequiredError) {
          // Backend requires VIEW_FILES OTP. Trigger the flow.
          setIsLoading(false);
          setDocuments([]);
          setElevationState('required');
          // Immediately request OTP and show modal.
          securityService.requestOtp(VIEW_FILES_PURPOSE)
            .then(() => {
              if (mounted.current) setShowOTPModal(true);
            })
            .catch(otpErr => {
              if (mounted.current) {
                setLoadError(`Could not send verification code: ${otpErr?.message ?? 'Unknown error'}`);
              }
            });
        } else {
          console.error('[DocumentRegistry] Failed to load documents:', err);
          setLoadError(err?.message || 'Failed to load documents.');
          setDocuments([]);
          setIsLoading(false);
        }
      });
  };

  useEffect(() => {
    const mounted = { current: true };
    loadDocuments(mounted);
    return () => { mounted.current = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── After upload, refresh registry ──────────────────────────────────────
  const refreshDocuments = () => {
    const mounted = { current: true };
    loadDocuments(mounted);
  };

  const handleUploadComplete = () => {
    setShowUpload(false);
    // UPLOAD_FILE elevation also satisfies VIEW_FILES (backend line 259),
    // so documents should load without another OTP after upload.
    refreshDocuments();
  };

  // ── OTP verification handler ─────────────────────────────────────────────
  const handleOTPVerify = async (code: string): Promise<boolean> => {
    try {
      await securityService.verifyOtp(VIEW_FILES_PURPOSE, code);
      // Elevation granted. Close modal and load documents.
      setShowOTPModal(false);
      setElevationState('elevated');
      const mounted = { current: true };
      loadDocuments(mounted);
      return true;
    } catch (e: any) {
      throw e; // Let OTPModal display the error
    }
  };

  const handleOTPResend = async (): Promise<void> => {
    await securityService.requestOtp(VIEW_FILES_PURPOSE);
  };

  const handleOTPCancel = () => {
    setShowOTPModal(false);
    setLoadError('Document access requires identity verification. Click reload to try again.');
  };

  // ── Filters ──────────────────────────────────────────────────────────────
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

  // ── Grouping ─────────────────────────────────────────────────────────────
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
      transition: { staggerChildren: shouldReduceMotion ? 0 : 0.05 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as any } }
  };

  // ── Render body for the 'all' view ────────────────────────────────────────
  const renderContent = () => {
    if (isLoading) {
      return (
        <motion.div className="documents-page__loading" variants={itemVariants}>
          LOADING SECURE REGISTRY...
        </motion.div>
      );
    }

    if (elevationState === 'required' && !showOTPModal) {
      // OTP was cancelled or failed — show actionable message
      return (
        <motion.div
          className="documents-page__loading"
          variants={itemVariants}
          style={{ color: 'var(--text-muted)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}
        >
          <div>🔒 IDENTITY VERIFICATION REQUIRED TO VIEW DOCUMENTS</div>
          <button
            className="btn-primary"
            onClick={() => {
              securityService.requestOtp(VIEW_FILES_PURPOSE)
                .then(() => setShowOTPModal(true))
                .catch(err => setLoadError(`Could not send code: ${err?.message ?? 'error'}`));
            }}
          >
            VERIFY IDENTITY
          </button>
        </motion.div>
      );
    }

    if (loadError) {
      return (
        <motion.div
          className="documents-page__loading"
          variants={itemVariants}
          style={{ color: 'var(--error, #ff4d4f)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}
        >
          <div>⚠ {loadError}</div>
          <button className="btn-secondary" onClick={refreshDocuments}>RELOAD</button>
        </motion.div>
      );
    }

    if (processedDocuments.length === 0) {
      return (
        <motion.div className="documents-page__loading" variants={itemVariants} style={{ color: 'var(--text-muted)' }}>
          NO DOCUMENTS FOUND
        </motion.div>
      );
    }

    return <DocumentList groupedDocuments={groupedDocuments} itemVariants={itemVariants} />;
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

      {/* OTP elevation modal for VIEW_FILES */}
      <OTPModal
        isOpen={showOTPModal}
        title="DOCUMENT REGISTRY ACCESS"
        message="Your identity must be verified to access the Document Registry. A 6-digit code was sent to your official email."
        onVerify={handleOTPVerify}
        onResend={handleOTPResend}
        onCancel={handleOTPCancel}
      />

      <AnimatePresence>
        {showUpload && (
          <DocumentUpload
            caseId="GENERAL"
            onClose={() => setShowUpload(false)}
            onComplete={handleUploadComplete}
          />
        )}
      </AnimatePresence>

      <motion.div variants={itemVariants}>
        <DocumentsWorkspaceNav currentView={currentView} />
      </motion.div>

      {currentView === 'all' && (
        <motion.div variants={itemVariants}>
          <DocumentCommandBar
            filters={filters}
            onChange={setFilters}
            onReset={() => setFilters(initialFilters)}
          />
        </motion.div>
      )}

      {currentView === 'all' && renderContent()}

      {currentView === 'cases' && <CasesPage isEmbedded={true} />}
      {currentView === 'evidence' && <EvidencePage isEmbedded={true} />}
      {currentView === 'media' && <MediaPage isEmbedded={true} />}
      {currentView === 'timeline' && <IntelligenceTimelinePage isEmbedded={true} />}
    </motion.div>
  );
}
