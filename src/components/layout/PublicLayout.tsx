import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PublicHeader from './PublicHeader';
import PublicFooter from './PublicFooter';

// Public Pages
import HomePage from '../../pages/HomePage';
import EventsPage from '../../pages/EventsPage';
import EventDetailsPage from '../../pages/EventDetailsPage';
import GalleryPage from '../../pages/GalleryPage';
import OrganizersPage from '../../pages/OrganizersPage';
import ContactPage from '../../pages/ContactPage';

const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50">
      <PublicHeader />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:id" element={<EventDetailsPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/organizers" element={<OrganizersPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </main>
      <PublicFooter />
    </div>
  );
};

export default PublicLayout;
