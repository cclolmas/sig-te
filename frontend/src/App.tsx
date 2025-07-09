import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RoutesPage from './pages/RoutesPage';
import ProtectedRoute from './components/ProtectedRoute';
import { ThemeProvider } from './context/ThemeContext';
import { AppThemeProvider } from './AppThemeProvider';
import AdministrativeGuidelinesPage from './pages/AdministrativeGuidelinesPage';
import ReplacementPage from './pages/ReplacementPage';
import ExtracurricularRequestPage from './pages/ExtracurricularRequestPage';
import GcoteApprovalQueuePage from './components/dashboard/GcoteApprovalQueuePage';
import StudentsPage from './pages/StudentsPage';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  return (
    <AppThemeProvider>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter basename="/">
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/unauthorized" element={<div>Unauthorized - Página não encontrada</div>} />
                <Route path="/orientacoes" element={<AdministrativeGuidelinesPage />} />
                <Route path="/estudantes" element={<StudentsPage />} />
                <Route path="/rotas" element={<RoutesPage />} />
                <Route path="/reposicoes" element={<ReplacementPage />} />
                <Route path="/extracurriculares" element={<ExtracurricularRequestPage />} />
                <Route element={<ProtectedRoute allowedRoles={["super_admin", "fiscal_gcote", "gestor_uniae"]} />}>
                  <Route path="/dashboard" element={<div>Dashboard not available</div>} />
                  <Route path="/dashboard/approval-queue" element={<GcoteApprovalQueuePage />} />
                </Route>
                <Route path="*" element={<div>404 - Página não encontrada</div>} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </AppThemeProvider>
  );
}
