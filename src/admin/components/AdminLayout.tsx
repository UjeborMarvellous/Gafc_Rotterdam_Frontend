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
import AdminRegistrationsPage from '../pages/AdminRegistrationsPage';
import AdminSettingsPage from '../pages/AdminSettingsPage';
import AdminContactMessagesPage from '../pages/AdminContactMessagesPage';

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="min-h-screen flex lg:grid lg:grid-cols-7 bg-slate-50">
      {/* Sidebar - Hidden on mobile, fixed sidebar on desktop */}
      <div className="hidden lg:block lg:col-span-1 bg-white border-r border-slate-200">
        <div className="sticky top-0 h-screen overflow-y-auto">
          <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <div className="lg:hidden">
        <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:col-span-6 w-full min-h-screen flex flex-col">
        {/* Top Bar */}
        <AdminTopBar onMenuClick={() => setSidebarOpen(true)} />

        {/* Page Content - Mobile optimized */}
        <main className="flex-1 w-full">
          <div className="w-full max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-6 sm:py-8">
            <Routes>
              <Route index element={<AdminDashboardPage />} />
              <Route path="events" element={<AdminEventsPage />} />
              <Route path="registrations" element={<AdminRegistrationsPage />} />
              <Route path="messages" element={<AdminContactMessagesPage />} />
              <Route path="gallery" element={<AdminGalleryPage />} />
              <Route path="organizers" element={<AdminOrganizersPage />} />
              <Route path="comments" element={<AdminCommentsPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
