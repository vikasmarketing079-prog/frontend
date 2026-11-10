import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import { MainLayout } from './layouts/MainLayout.js';
import { HomePage } from './pages/HomePage.js';
import { ReportPage } from './pages/ReportPage.js';
import { ComparePage } from './pages/ComparePage.js';
import { ToolsPage } from './pages/tools/ToolsPage.js';
import { PricingPage } from './pages/PricingPage.js';
import { AboutPage, ContactPage } from './pages/AboutPage.js';
import { BlogPage } from './pages/BlogPage.js';
import { PrivacyPage, TermsPage, CookiePage } from './pages/LegalPages.js';
import { LoginPage, RegisterPage } from './pages/AuthPages.js';
import { DashboardPage } from './pages/DashboardPage.js';
import { WebsitesPage } from './pages/WebsitesPage.js';
import { SettingsPage } from './pages/SettingsPage.js';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            {/* Public Pages */}
            <Route path="/" element={<HomePage />} />
            <Route path="/report/:id" element={<ReportPage />} />
            <Route path="/demo" element={<ReportPage />} />
            <Route path="/compare/:id/:previousId" element={<ComparePage />} />

            {/* Individual Diagnostic Tools */}
            <Route path="/tools/seo" element={<ToolsPage />} />
            <Route path="/tools/speed" element={<ToolsPage />} />
            <Route path="/tools/broken-links" element={<ToolsPage />} />
            <Route path="/tools/ssl" element={<ToolsPage />} />
            <Route path="/tools/mobile" element={<ToolsPage />} />
            <Route path="/tools/security-headers" element={<ToolsPage />} />

            {/* Company & Legal */}
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/cookies" element={<CookiePage />} />

            {/* Auth */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* User Dashboard */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/websites"
              element={
                <ProtectedRoute>
                  <WebsitesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/settings"
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
