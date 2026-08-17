/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './lib/auth';
import LandingPage from './pages/LandingPage';
import AdminLayout from './pages/admin/AdminLayout';
import DashboardOverview from './pages/admin/DashboardOverview';
import CreateFlipbook from './pages/admin/CreateFlipbook';
import LeadQualification from './pages/admin/LeadQualification';
import FlipbooksList from './pages/admin/FlipbooksList';
import AnalyticsDashboard from './pages/admin/AnalyticsDashboard';
import HistoryLogs from './pages/admin/HistoryLogs';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import PublicViewer from './pages/viewer/PublicViewer';
import SetupRequired from './pages/SetupRequired';

export default function App() {
  return (
    <AuthProvider>
      <Router>


        <Routes>
          {/* Public Landing Page */}
          <Route path="/" element={<Navigate to="/admin" replace />} />
          
          {/* Public Flipbook Viewer */}
          <Route path="/catalogue/:slug" element={<PublicViewer />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin Dashboard */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardOverview />} />
            <Route path="flipbooks" element={<FlipbooksList />} />
            <Route path="create" element={<CreateFlipbook />} />
            <Route path="analytics" element={<AnalyticsDashboard />} />
            <Route path="lead-qualification" element={<LeadQualification />} />
            <Route path="history" element={<HistoryLogs />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

