/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AdminLayout from './pages/admin/AdminLayout';
import DashboardOverview from './pages/admin/DashboardOverview';
import CreateFlipbook from './pages/admin/CreateFlipbook';
import FlipbooksList from './pages/admin/FlipbooksList';
import PublicViewer from './pages/viewer/PublicViewer';
import SetupRequired from './pages/SetupRequired';
import { hasSupabaseConfig } from './lib/supabase';

export default function App() {
  return (
    <Router>
      {!hasSupabaseConfig && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-800 px-4 py-2 text-sm text-center flex items-center justify-center gap-2">
          <strong>Demo Mode:</strong> Supabase keys are missing. Application is running with local demo data.
        </div>
      )}
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Public Flipbook Viewer */}
        <Route path="/catalogue/:slug" element={<PublicViewer />} />

        {/* Admin Dashboard */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardOverview />} />
          <Route path="flipbooks" element={<FlipbooksList />} />
          <Route path="create" element={<CreateFlipbook />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

