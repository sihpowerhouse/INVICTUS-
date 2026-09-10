import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from '../pages/DashboardPage';
import PlaceholderPage from '../pages/PlaceholderPage';

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
      <Route path="/cases" element={<PlaceholderPage title="Cases" section="OPERATIONS" />} />
      <Route path="/documents" element={<PlaceholderPage title="Documents" section="OPERATIONS" />} />
      <Route path="/evidence" element={<PlaceholderPage title="Evidence Vault" section="OPERATIONS" />} />

      {/* Intelligence */}
      <Route path="/intelligence/search" element={<PlaceholderPage title="AI Search" section="INTELLIGENCE" />} />
      <Route path="/intelligence/qa" element={<PlaceholderPage title="Case Q&A" section="INTELLIGENCE" />} />
      <Route path="/intelligence/timeline" element={<PlaceholderPage title="Timeline" section="INTELLIGENCE" />} />
      <Route path="/intelligence/inconsistencies" element={<PlaceholderPage title="Inconsistencies" section="INTELLIGENCE" />} />

      {/* Security */}
      <Route path="/integrity" element={<PlaceholderPage title="Integrity" section="SECURITY" />} />
      <Route path="/audit" element={<PlaceholderPage title="Audit Logs" section="SECURITY" />} />

      {/* Settings */}
      <Route path="/settings" element={<PlaceholderPage title="Settings" section="SYSTEM" />} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default AppRoutes;
