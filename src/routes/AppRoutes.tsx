import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Eager load the main dashboard for fastest initial paint
import DashboardPage from '../pages/DashboardPage';
import LoginPage from '../pages/LoginPage';
import ExternalLoginPage from '../pages/external/ExternalLoginPage';
import ExternalRegisterPage from '../pages/external/ExternalRegisterPage';
import ExternalDashboardPage from '../pages/external/ExternalDashboardPage';
import { useAuth } from '../hooks/useAuth';

// Lazy load feature modules
const CasesPage = lazy(() => import('../pages/CasesPage'));
const NewCasePage = lazy(() => import('../pages/NewCasePage'));
const CaseDetailsPage = lazy(() => import('../pages/CaseDetailsPage'));
const DocumentsPage = lazy(() => import('../pages/DocumentsPage'));
const DocumentDetailsPage = lazy(() => import('../pages/DocumentDetailsPage'));
const EvidencePage = lazy(() => import('../pages/EvidencePage'));
const EvidenceDetailsPage = lazy(() => import('../pages/EvidenceDetailsPage'));
const MediaPage = lazy(() => import('../pages/MediaPage'));
const MediaDetailsPage = lazy(() => import('../pages/MediaDetailsPage'));
const AnalyticsPage = lazy(() => import('../pages/AnalyticsPage'));


const IntegrityPage = lazy(() => import('../pages/IntegrityPage'));
const IntegrityDetailPage = lazy(() => import('../pages/IntegrityDetailPage'));
const AuditPage = lazy(() => import('../pages/AuditPage'));
const AccessRequestsPage = lazy(() => import('../pages/AccessRequestsPage'));

const SettingsPage = lazy(() => import('../pages/SettingsPage'));

// INVICTUS style loading fallback
const RouteFallback = () => (
  <div style={{ 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    height: '100%', 
    width: '100%',
    fontFamily: 'monospace',
    color: 'var(--accent)',
    letterSpacing: '0.2em',
    fontSize: '12px',
    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
  }}>
    [ INITIALIZING SECURE MODULE... ]
  </div>
);

/**
 * Central route definitions for the INVICTUS application.
 * Each route corresponds to a sidebar navigation item.
 */
function AppRoutes() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <RouteFallback />;
  }

  // Determine user type for routing restrictions
  const isExternal = user?.userType === 'EXTERNAL';
  const isInternal = user?.userType === 'INTERNAL';

  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        {/* PUBLIC UN-AUTH ROUTES */}
        <Route path="/login" element={!isAuthenticated ? <LoginPage /> : (isInternal ? <Navigate to="/dashboard" replace /> : <Navigate to="/external/dashboard" replace />)} />
        <Route path="/external/login" element={!isAuthenticated ? <ExternalLoginPage /> : (isExternal ? <Navigate to="/external/dashboard" replace /> : <Navigate to="/dashboard" replace />)} />
        <Route path="/external/register" element={!isAuthenticated ? <ExternalRegisterPage /> : (isExternal ? <Navigate to="/external/dashboard" replace /> : <Navigate to="/dashboard" replace />)} />
        
        {/* PROTECTED ROUTES */}
        {isAuthenticated ? (
          <>
            {isInternal ? (
              // INTERNAL USER ROUTES
              <>
                {/* Default redirect for internal */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/external/*" element={<Navigate to="/dashboard" replace />} />

                {/* Operations */}
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/cases" element={<CasesPage />} />
                <Route path="/cases/new" element={<NewCasePage />} />
                <Route path="/cases/:caseId" element={<CaseDetailsPage />} />
                <Route path="/documents" element={<DocumentsPage />} />
                <Route path="/documents/:documentId" element={<DocumentDetailsPage />} />
                <Route path="/evidence" element={<EvidencePage />} />
                <Route path="/evidence/:evidenceId" element={<EvidenceDetailsPage />} />
                <Route path="/media" element={<MediaPage />} />
                <Route path="/media/:mediaId" element={<MediaDetailsPage />} />


                {/* Security */}
                <Route path="/integrity" element={<IntegrityPage />} />
                <Route path="/integrity/:documentId" element={<IntegrityDetailPage />} />
                <Route path="/audit" element={<AuditPage />} />
                <Route path="/access-requests" element={<AccessRequestsPage />} />

                {/* Settings & Analytics */}
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </>
            ) : (
              // EXTERNAL USER ROUTES
              <>
                <Route path="/external/dashboard" element={<ExternalDashboardPage />} />
                {/* Any access to internal or base route redirects to external dashboard */}
                <Route path="*" element={<Navigate to="/external/dashboard" replace />} />
              </>
            )}
            
            {/* Catch-all */}
            <Route path="*" element={<Navigate to={isInternal ? "/dashboard" : "/external/dashboard"} replace />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to={window.location.pathname.startsWith('/external') ? "/external/login" : "/login"} replace />} />
        )}
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;
