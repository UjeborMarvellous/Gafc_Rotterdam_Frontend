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
    linkedin: <Linkedin className="h-5 w-5" />,
    instagram: <Instagram className="h-5 w-5" />,
    facebook: <Facebook className="h-5 w-5" />,
    twitter: <Twitter className="h-5 w-5" />,
    x: <Twitter className="h-5 w-5" />,
  };

  return (
    <GlassCard className="p-8 text-center">
      <div ref={ref} className="relative w-40 h-40 mx-auto mb-6 overflow-hidden ring-4 ring-blue-100 group-hover:ring-blue-200 transition-all duration-300">
        {isLoading && (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 animate-pulse flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-slate-300 border-t-blue-600 animate-spin" />
          </div>
        )}
        {hasError ? (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
            <span className="text-slate-500 text-xs font-medium">No image</span>
          </div>
        ) : imageSrc ? (
          <img
            src={imageSrc}
            alt={organizer.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : null}
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
        {organizer.name}
      </h3>
      
      <p className="text-blue-600 font-semibold mb-4 text-lg">
        {organizer.position}
      </p>
      
      <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3">
        {organizer.bio}
      </p>

      {socialLinks.length > 0 && (
        <div className="flex justify-center space-x-3">
          {socialLinks.map(([platform, url]) => {
            const key = platform.toLowerCase();
            const icon = iconMap[key] ?? <ExternalLink className="h-5 w-5" />;

            return (
              <a
                key={platform}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/40 border border-white/30 backdrop-blur-md rounded-xl flex items-center justify-center hover:bg-brand-green-600 hover:text-white transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg group/link"
                aria-label={`${organizer.name} on ${platform}`}
              >
                <span className="transition-transform duration-200 group-hover/link:scale-110">
                  {icon}
                </span>
              </a>
            );
          })}
        </div>
      )}
    </GlassCard>
  );
};

export default OrganizerCard;
