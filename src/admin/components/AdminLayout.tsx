import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
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
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-7 bg-slate-50">
      <div className="lg:col-span-1 w-full h-screen bg-white">
        {/* Sidebar */}
        <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>
      {/* Main Content */}
      <div className="lg:col-span-6 h-screen overflow-y-auto">
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