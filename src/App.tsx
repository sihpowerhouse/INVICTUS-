import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import AppShell from './layouts/AppShell';
import ExternalAppShell from './layouts/ExternalAppShell';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { I18nProvider } from './i18n/I18nProvider';
import './App.css';

/**
 * RootShell dynamically selects the layout based on the authenticated user's role.
 */
function RootShell({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();

  // If not authenticated, AppShell handles the full-width render (for login pages)
  if (!isAuthenticated) {
    return <AppShell>{children}</AppShell>;
  }

  // Route strictly to the external layout if user is external
  if (user?.userType === 'EXTERNAL') {
    return <ExternalAppShell>{children}</ExternalAppShell>;
  }

  // Default internal layout
  return <AppShell>{children}</AppShell>;
}

function App() {
  return (
    <BrowserRouter>
      <AccessibilityProvider>
        <I18nProvider>
          <AuthProvider>
            <RootShell>
              <AppRoutes />
            </RootShell>
          </AuthProvider>
        </I18nProvider>
      </AccessibilityProvider>
    </BrowserRouter>
  );
}

export default App;