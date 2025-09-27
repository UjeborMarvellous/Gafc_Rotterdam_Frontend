import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Calendar, Image, Users, Phone, Heart } from 'lucide-react';

const PublicHeader: React.FC = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(() => !isHome);

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
      {/* Updated: utility banner reinforces mission and contact touchpoints */}
      {/* <div className="hidden md:block bg-[#e5e5e5] text-slate-700">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2 text-xs tracking-wide">
          <p className="uppercase">Empowering our community in Rotterdam</p>
          <div className="flex items-center gap-5">
            <a href="mailto:info@gafc-rotterdam.nl" className="hover:text-slate-900 transition-colors">info@gafc-rotterdam.nl</a>
            <span className="hidden lg:inline" aria-hidden>|</span>
            <a href="tel:+31612345678" className="hover:text-slate-900 transition-colors">+31 6 1234 5678</a>
          </div>
        </div>
      </div> */}

      <div
        className={`transition-all duration-300 border-b ${
          scrolled
            ? 'bg-white/95 border-slate-200 shadow-lg backdrop-blur'
            : 'bg-transparent border-transparent'
        }`}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-sm">
              <span className="text-xs font-semibold uppercase tracking-widest">Logo</span>
            </div>
            <div className="hidden sm:flex flex-col">
              <span className={`text-lg font-semibold ${scrolled ? 'text-slate-900' : 'text-gray-100'}`}>GAFC Rotterdam</span>
              <span className={`text-xs uppercase tracking-[0.3em] ${scrolled ? 'text-slate-500' : 'text-gray-100'}`}>Community</span>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navigation.map((item) => {
              const Icon = item.icon;
              const activeClasses = scrolled
                ? 'bg-brand-green-100 text-brand-green-700 shadow-sm'
                : 'bg-white/20 text-white';
              const inactiveClasses = scrolled
                ? 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                : 'text-white/80 hover:bg-white/10 hover:text-white';

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    isActive(item.href) ? activeClasses : inactiveClasses
                  }`}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              to="/events"
              className={`rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold transition-colors hover:border-brand-green-500 hover:text-brand-green-600 ${scrolled ? 'text-slate-700' : 'text-gray-100'}`}
            >
              Browse Events
            </Link>
            <a
              href="#donate"
              className="inline-flex items-center gap-2 rounded-full bg-brand-green-600 px-5 py-2 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-brand-green-700"
            >
              <Heart className="h-4 w-4" />
              Support Us
            </a>
          </div>

          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2 text-slate-700 transition-colors md:hidden"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            <span className="sr-only">Toggle navigation</span>
          </button>
        </div>

        {isMenuOpen && (
          <div className="border-t border-slate-200 bg-white md:hidden">
            <nav className="space-y-2 px-4 py-6">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? 'bg-brand-green-100 text-brand-green-700'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    {Icon && <Icon className="h-5 w-5" />}
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              <div className="grid gap-3 pt-4">
                <Link
                  to="/events"
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-700"
                >
                  Browse Events
                </Link>
                <a
                  href="#donate"
                  className="rounded-xl bg-brand-green-600 px-4 py-3 text-center text-sm font-semibold text-white"
                >
                  <span className="inline-flex items-center justify-center gap-2">
                    <Heart className="h-4 w-4" /> Support Us
                  </span>
                </a>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default PublicHeader;