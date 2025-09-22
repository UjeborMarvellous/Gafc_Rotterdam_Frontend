import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PublicHeader from './PublicHeader';
import PublicFooter from './PublicFooter';

import HomePage from '../../pages/HomePage';
import EventsPage from '../../pages/EventsPage';
import EventDetailsPage from '../../pages/EventDetailsPage';
import GalleryPage from '../../pages/GalleryPage';
import OrganizersPage from '../../pages/OrganizersPage';
import ContactPage from '../../pages/ContactPage';

const PublicLayout: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-[#e5e5e5] text-slate-900">
      <div className="relative z-10 flex min-h-screen flex-col">
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
    </div>
  );
};

export default PublicLayout;