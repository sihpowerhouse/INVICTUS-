import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import AppShell from './layouts/AppShell';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <AppRoutes />
      </AppShell>
    </BrowserRouter>
  );
}

export default App;