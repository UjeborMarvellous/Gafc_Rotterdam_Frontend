import React, { useState } from 'react';
import { GalleryImage as GalleryImageType } from '../types';
import { useImageLazyLoading } from '../hooks/useLazyLoading';
import { Eye, Calendar } from 'lucide-react';

interface GalleryImageProps {
  image: GalleryImageType;
  onClick?: () => void;
}

const GalleryImage: React.FC<GalleryImageProps> = ({ image, onClick }) => {
  const { ref, imageSrc, isLoading, hasError } = useImageLazyLoading(image.imageUrl);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      ref={ref}
      className="relative aspect-square rounded-3xl overflow-hidden cursor-pointer group bg-white/10 backdrop-blur-xl border border-white/15 shadow-glass hover:-translate-y-1 hover:shadow-xl transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin" />
        </div>
      )}
      
      {hasError ? (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
          <span className="text-slate-500 text-sm font-medium">Image not available</span>
        </div>
      ) : imageSrc ? (
        <>
          <img
            src={imageSrc}
            alt={image.caption || 'Gallery image'}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div
            className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-all duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm mb-1">{image.caption || 'Gallery Image'}</h3>
                  <div className="flex items-center text-xs text-white/80">
                    <Calendar className="w-3 h-3 mr-1" />
                    <span>{new Date(image.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="w-8 h-8 bg-white/25 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
                  <Eye className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default GalleryImage;
