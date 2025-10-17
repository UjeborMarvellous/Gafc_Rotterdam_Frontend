import React from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Image as GalleryIcon,
  Users,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Heart,
} from 'lucide-react';

const PublicFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Events', href: '/events', icon: Calendar },
    { name: 'Gallery', href: '/gallery', icon: GalleryIcon },
    { name: 'Organizers', href: '/organizers', icon: Users },
    { name: 'Contact', href: '/contact', icon: Phone },
  ];

  const socialLinks = [
    { name: 'Facebook', href: '#', icon: Facebook },
    { name: 'Instagram', href: '#', icon: Instagram },
    { name: 'Twitter', href: '#', icon: Twitter },
    { name: 'LinkedIn', href: '#', icon: Linkedin },
  ];

  return (
    <footer className="relative bg-[#e5e5e5] text-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Updated: spotlight band drives users toward the donation anchor */}
        <div className="-mt-12 mb-8 sm:mb-12 overflow-hidden rounded-3xl border border-slate-200 bg-white px-4 sm:px-6 py-6 sm:py-10 shadow-lg">
          <div className="flex flex-col gap-4 sm:gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Support the community</p>
              <h3 className="mt-2 md:text-2xl text-lg font-semibold">Invest in programmes that uplift the Rotterdam community.</h3>
            </div>
            <a
              href="#donate"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-green-600 px-5 py-3 text-sm font-semibold text-white shadow-soft transition-transform duration-200 hover:-translate-y-1 hover:bg-brand-green-700"
            >
              <Heart className="h-4 w-4" />
              Donate Now
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:gap-10 pb-8 sm:pb-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Updated: brand block includes clear logo placeholder */}
          <div className="space-y-4 sm:space-y-6 lg:col-span-2">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-sm">
                <span className="text-xs font-semibold uppercase tracking-[0.3em]">Logo</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold">GAFC Rotterdam</h3>
                <p className="text-sm text-slate-600">Community football & cultural initiatives</p>
              </div>
            </div>
            <p className="max-w-lg text-sm text-slate-600">
              We celebrate excellence on and off the pitch. Discover events, connect with organisers, and champion programmes that strengthen every generation of the community in Rotterdam.
            </p>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className="group inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-transform duration-200 hover:-translate-y-1 hover:border-brand-green-400 hover:text-brand-green-600"
                    aria-label={social.name}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-600">Quick Links</h4>
            <ul className="mt-3 sm:mt-4 space-y-2 sm:space-y-3 text-sm">
              {quickLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="group inline-flex items-center gap-2 rounded-xl px-2 py-2 text-slate-600 transition-colors duration-200 hover:text-brand-green-600"
                    >
                      {Icon && <Icon className="h-4 w-4 text-brand-green-500" />}
                      <span>{link.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-600">Visit or Contact</h4>
            <div className="space-y-2 sm:space-y-3 text-sm text-slate-600">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-brand-green-600" />
                <span>Rotterdam, Netherlands</span>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-brand-green-600" />
                <a href="mailto:info@gafc-rotterdam.nl" className="hover:text-brand-green-700 transition-colors">info@gafc-rotterdam.nl</a>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-brand-green-600" />
                <a href="tel:+31612345678" className="hover:text-brand-green-700 transition-colors">+31 6 1234 5678</a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 py-4 sm:py-6 text-sm text-slate-600">
          <div className="flex flex-col items-center justify-between gap-3 sm:gap-4 md:flex-row">
            <p>© {currentYear} GAFC Rotterdam. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link to="/privacy" className="hover:text-brand-green-600 transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-brand-green-600 transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;