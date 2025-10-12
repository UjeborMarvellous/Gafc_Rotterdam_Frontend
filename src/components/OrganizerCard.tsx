import React from 'react';
import { Organizer } from '../types';
import { useImageLazyLoading } from '../hooks/useLazyLoading';
import { ExternalLink, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import GlassCard from './ui/GlassCard';

interface OrganizerCardProps {
  organizer: Organizer;
}

const OrganizerCard: React.FC<OrganizerCardProps> = ({ organizer }) => {
  const { ref, imageSrc, isLoading, hasError } = useImageLazyLoading(organizer.profileImageUrl);

  const socialLinks = organizer.socialLinks ? Object.entries(organizer.socialLinks).filter(([_, url]) => url) : [];

  const iconMap: Record<string, JSX.Element> = {
    linkedin: <Linkedin className="h-4 w-4" />,
    instagram: <Instagram className="h-4 w-4" />,
    facebook: <Facebook className="h-4 w-4" />,
    twitter: <Twitter className="h-4 w-4" />,
    x: <Twitter className="h-4 w-4" />,
  };

  return (
    <div className="group h-full">
      <div className="relative h-full rounded-3xl overflow-hidden shadow-[0_10px_40px_-20px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_60px_-30px_rgba(0,0,0,0.25)] transition-all duration-500 hover:-translate-y-2">
        {/* Full Background Image */}
        <div ref={ref} className="absolute inset-0">
          {isLoading && (
            <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 animate-pulse flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-slate-300 border-t-blue-600 animate-spin" />
            </div>
          )}
          {hasError ? (
            <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
              <span className="text-slate-500 text-sm font-medium">No image</span>
            </div>
          ) : imageSrc ? (
            <img
              src={imageSrc}
              alt={organizer.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center">
              <span className="text-6xl font-bold text-white">
                {organizer.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Black Overlay with Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/30 to-black/10 group-hover:from-black/50 group-hover:via-black/20 group-hover:to-black/5 transition-all duration-500"></div>

        {/* Content Overlay - Bottom Positioning */}
        <div className="relative h-full flex flex-col justify-end p-6 text-white">
          {/* Social Links - Top Right */}
          {socialLinks.length > 0 && (
            <div className="absolute top-4 right-4 flex space-x-2">
              {socialLinks.map(([platform, url]) => {
                const key = platform.toLowerCase();
                const icon = iconMap[key] ?? <ExternalLink className="h-4 w-4" />;

                return (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl flex items-center justify-center hover:bg-white/30 hover:border-white/50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg group/link"
                    aria-label={`${organizer.name} on ${platform}`}
                  >
                    <span className="transition-transform duration-200 group-hover/link:scale-110 text-white">
                      {icon}
                    </span>
                  </a>
                );
              })}
            </div>
          )}

          {/* Main Content - Top Left */}
          <div className="space-y-2 mt-4">
            <h3 className="text-2xl font-bold text-white group-hover:text-blue-300 transition-colors duration-300">
              {organizer.name}
            </h3>
            
            <p className="text-blue-300 font-semibold text-sm uppercase tracking-wide">
              {organizer.position}
            </p>
            
            <p className="text-white/90 text-xs leading-relaxed line-clamp-2">
              {organizer.bio || 'Passionate community member dedicated to making a difference.'}
            </p>
          </div>
        </div>

        {/* Subtle Border */}
        <div className="absolute inset-0 rounded-3xl border border-white/20 group-hover:border-white/30 transition-all duration-500"></div>
      </div>
    </div>
  );
};

export default OrganizerCard;
