import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Calendar, Image, Users, Phone, Heart } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import heroImage from '../../Images/CountryImages.png';

const PublicHeader: React.FC = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(() => !isHome);
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Events', href: '/events', icon: Calendar },
    { name: 'Gallery', href: '/gallery', icon: Image },
    { name: 'Organizers', href: '/organizers', icon: Users },
    { name: 'Contact', href: '/contact', icon: Phone },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }

    return location.pathname.startsWith(path);
  };

  useEffect(() => {
    if (!isHome) {
      setScrolled(true);
      return;
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHome]);

  useEffect(() => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-50">
      <div className="transition-all duration-300 border-b bg-white border-slate-200 shadow-lg">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <img
                src="/favicon.ico"
                alt="GAFC Rotterdam Logo"
                className="h-10 w-10 object-contain"
              />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-lg font-semibold text-black">GAFC Rotterdam</span>
              <span className="text-xs uppercase tracking-[0.3em] text-gray-600">Community</span>
            </div>
          </Link>

          {/* Desktop Navigation - Hidden on mobile and tablet */}
          <nav className="hidden items-center gap-1 lg:flex">
            {navigation.map((item) => {
              const activeClasses = 'bg-brand-green-100 text-brand-green-700 shadow-sm';
              const inactiveClasses = 'text-black hover:bg-gray-100 hover:text-gray-800';

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    isActive(item.href) ? activeClasses : inactiveClasses
                  }`}
                >
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Desktop Action Buttons - Hidden on mobile and tablet */}
          <div className="hidden items-center gap-3 lg:flex">
            <Link
              to="/events"
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-black transition-colors hover:border-brand-green-500 hover:text-brand-green-600"
            >
              Browse Events
            </Link>
            <button
              type="button"
              onClick={() => setShowComingSoonModal(true)}
              className="inline-flex items-center gap-2 rounded-full bg-brand-green-600 px-5 py-2 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-brand-green-700"
            >
              {/* <Heart className="h-4 w-4" /> */}
              Support Us
            </button>
          </div>

          {/* Mobile/Tablet Menu Button - Visible on mobile and tablet */}
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2 text-black transition-colors lg:hidden"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            <span className="sr-only">Toggle navigation</span>
          </button>
        </div>

        {/* Mobile/Tablet Menu Overlay */}
        {isMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Blurred Background Overlay */}
            <div 
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsMenuOpen(false)}
            />
            
            {/* Slide-in Menu Panel */}
            <div className="absolute right-0 top-0 h-full w-4/5 max-w-sm bg-white shadow-2xl transform transition-transform duration-300 ease-in-out">
              {/* Menu Content */}
              <div className="flex h-full flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white shadow-sm">
                      <img
                        src="/favicon.ico"
                        alt="GAFC Rotterdam Logo"
                        className="h-8 w-8 object-contain"
                      />
                    </div>
                    <div className="text-black">
                      <div className="text-lg font-semibold">GAFC Rotterdam</div>
                      <div className="text-xs uppercase tracking-wider text-gray-600">Community</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsMenuOpen(false)}
                    className="rounded-xl border border-gray-200 bg-white p-2 text-black transition-colors hover:bg-gray-100"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                {/* Navigation */}
                <nav className="flex-1 space-y-2 p-6">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                        className={`flex items-center gap-4 rounded-xl px-4 py-4 text-base font-medium transition-all duration-200 ${
                      isActive(item.href)
                            ? 'bg-brand-green-100 text-brand-green-700 shadow-sm'
                            : 'text-black hover:bg-gray-100 hover:text-gray-800'
                    }`}
                        onClick={() => setIsMenuOpen(false)}
                  >
                        {Icon && <Icon className="h-6 w-6" />}
                    <span>{item.name}</span>
                  </Link>
                );
              })}
                </nav>
                
                {/* Action Buttons */}
                <div className="space-y-3 p-6 border-t border-gray-200">
                <Link
                  to="/events"
                    className="block rounded-xl border border-gray-200 bg-white px-4 py-4 text-center text-base font-semibold text-black transition-colors hover:bg-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                >
                  Browse Events
                </Link>
                <button
                  type="button"
                    onClick={() => {
                      setShowComingSoonModal(true);
                      setIsMenuOpen(false);
                    }}
                    className="w-full rounded-xl bg-brand-green-600 px-4 py-4 text-center text-base font-semibold text-white transition-colors hover:bg-brand-green-700"
                >
                  <span className="inline-flex items-center justify-center gap-2">
                      <Heart className="h-5 w-5" /> Support Us
                  </span>
                </button>
              </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Coming Soon Modal */}
      <Modal
        isOpen={showComingSoonModal}
        onClose={() => setShowComingSoonModal(false)}
        title="Coming Soon!"
        size="md"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-center">
            <div className="rounded-full bg-brand-green-100 p-6">
              <Heart className="h-12 w-12 text-brand-green-600" />
            </div>
          </div>
          <div className="text-center space-y-3">
            <h3 className="text-xl font-semibold text-gray-900">
              Donation Center Coming Soon!
            </h3>
            <p className="text-gray-600">
              We're building a secure donation system to make it easier for you to support GAFC Rotterdam.
            </p>
            <p className="text-gray-600">
              Thank you for your interest in supporting our community! We'll notify you as soon as our donation platform is ready.
            </p>
          </div>
          <div className="pt-4">
            <Button
              onClick={() => setShowComingSoonModal(false)}
              className="w-full"
            >
              Got it, thanks!
            </Button>
          </div>
        </div>
      </Modal>
    </header>
  );
};

export default PublicHeader;