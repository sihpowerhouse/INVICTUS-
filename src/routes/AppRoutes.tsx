import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from '../pages/DashboardPage';
import CasesPage from '../pages/CasesPage';
import CaseDetailsPage from '../pages/CaseDetailsPage';
import DocumentsPage from '../pages/DocumentsPage';
import DocumentDetailsPage from '../pages/DocumentDetailsPage';
import EvidencePage from '../pages/EvidencePage';
import EvidenceDetailsPage from '../pages/EvidenceDetailsPage';
import MediaPage from '../pages/MediaPage';
import MediaDetailsPage from '../pages/MediaDetailsPage';
import AnalyticsPage from '../pages/AnalyticsPage';

import IntelligenceSearchPage from '../pages/IntelligenceSearchPage';
import IntelligenceQAPage from '../pages/IntelligenceQAPage';
import IntelligenceTimelinePage from '../pages/IntelligenceTimelinePage';
import IntelligenceInconsistenciesPage from '../pages/IntelligenceInconsistenciesPage';

import IntegrityPage from '../pages/IntegrityPage';
import IntegrityDetailPage from '../pages/IntegrityDetailPage';
import AuditPage from '../pages/AuditPage';
import AccessRequestsPage from '../pages/AccessRequestsPage';

import SettingsPage from '../pages/SettingsPage';

/**
 * Central route definitions for the INVICTUS application.
 * Each route corresponds to a sidebar navigation item.
 */
function AppRoutes() {
  return (
    <Routes>
      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Operations */}
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/cases" element={<CasesPage />} />
      <Route path="/cases/:caseId" element={<CaseDetailsPage />} />
      <Route path="/documents" element={<DocumentsPage />} />
      <Route path="/documents/:documentId" element={<DocumentDetailsPage />} />
      <Route path="/evidence" element={<EvidencePage />} />
      <Route path="/evidence/:evidenceId" element={<EvidenceDetailsPage />} />
      <Route path="/media" element={<MediaPage />} />
      <Route path="/media/:mediaId" element={<MediaDetailsPage />} />

      {/* Intelligence */}
      <Route path="/intelligence/search" element={<IntelligenceSearchPage />} />
      <Route path="/intelligence/qa" element={<IntelligenceQAPage />} />
      <Route path="/intelligence/timeline" element={<IntelligenceTimelinePage />} />
      <Route path="/intelligence/inconsistencies" element={<IntelligenceInconsistenciesPage />} />

      {/* Security */}
      <Route path="/integrity" element={<IntegrityPage />} />
      <Route path="/integrity/:documentId" element={<IntegrityDetailPage />} />
      <Route path="/audit" element={<AuditPage />} />
      <Route path="/access-requests" element={<AccessRequestsPage />} />

      {/* Settings & Analytics */}
      <Route path="/analytics" element={<AnalyticsPage />} />
      <Route path="/settings" element={<SettingsPage />} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default AppRoutes;
