import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminTopBar from './AdminTopBar';

// Admin Pages
import AdminDashboardPage from '../pages/AdminDashboardPage';
import AdminEventsPage from '../pages/AdminEventsPage';
import AdminGalleryPage from '../pages/AdminGalleryPage';
import AdminOrganizersPage from '../pages/AdminOrganizersPage';
import AdminCommentsPage from '../pages/AdminCommentsPage';

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Bar */}
        <AdminTopBar onMenuClick={() => setSidebarOpen(true)} />
        
        {/* Page Content */}
        <main className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<AdminDashboardPage />} />
              <Route path="/events" element={<AdminEventsPage />} />
              <Route path="/gallery" element={<AdminGalleryPage />} />
              <Route path="/organizers" element={<AdminOrganizersPage />} />
              <Route path="/comments" element={<AdminCommentsPage />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;