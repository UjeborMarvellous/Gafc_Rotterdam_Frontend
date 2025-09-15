import React from 'react';
import { Organizer } from '../types';
import { useImageLazyLoading } from '../hooks/useLazyLoading';
import { getSocialIcon } from '../utils';
import { ExternalLink } from 'lucide-react';

interface OrganizerCardProps {
  organizer: Organizer;
}

const OrganizerCard: React.FC<OrganizerCardProps> = ({ organizer }) => {
  const { ref, imageSrc, isLoading, hasError } = useImageLazyLoading(organizer.profileImageUrl);

  const socialLinks = organizer.socialLinks ? Object.entries(organizer.socialLinks).filter(([_, url]) => url) : [];

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 group overflow-hidden border border-slate-200 p-8 text-center">
      <div ref={ref} className="relative w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden ring-4 ring-blue-100 group-hover:ring-blue-200 transition-all duration-300">
        {isLoading && (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 animate-pulse flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin" />
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
          {socialLinks.map(([platform, url]) => (
            <a
              key={platform}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg group/link"
              aria-label={`${organizer.name} on ${platform}`}
            >
              <span className="text-lg group-hover/link:scale-110 transition-transform duration-200">
                {getSocialIcon(platform)}
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrganizerCard;
