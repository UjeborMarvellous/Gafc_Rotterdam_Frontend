import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useGalleryStore } from '../stores/galleryStore';
import GalleryImage from '../components/GalleryImage';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { GalleryImage as GalleryImageType } from '../types';

const GalleryPage: React.FC = () => {
  const { images, fetchImages, isLoading, pagination } = useGalleryStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState<GalleryImageType | null>(null);

  useEffect(() => {
    fetchImages({ page: currentPage, limit: 12 });
  }, [fetchImages, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Helmet>
        <title>Gallery - GAFC Rotterdam</title>
        <meta name="description" content="Explore our community gallery and see the amazing moments we've shared together." />
      </Helmet>

      <div className="py-16">
        <div className="container-custom">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Community Gallery
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See the amazing moments we've shared together
            </p>
          </div>

          {/* Gallery Grid */}
          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : images.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
                {images.map((image) => (
                  <GalleryImage
                    key={image._id}
                    image={image}
                    onClick={() => setSelectedImage(image)}
                  />
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.pages > 1 && (
                <div className="flex justify-center items-center space-x-2">
                  <Button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    variant="outline"
                    size="sm"
                  >
                    Previous
                  </Button>
                  
                  <div className="flex space-x-1">
                    {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        variant={page === currentPage ? 'primary' : 'outline'}
                        size="sm"
                        className="w-10"
                      >
                        {page}
                      </Button>
                    ))}
                  </div>

                  <Button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === pagination.pages}
                    variant="outline"
                    size="sm"
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">📷</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No images in gallery
              </h3>
              <p className="text-gray-500">
                Check back later for new photos from our community events.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Image Modal */}
      <Modal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        title={selectedImage?.title || ''}
        size="xl"
      >
        {selectedImage && (
          <div className="space-y-4">
            <div className="relative">
              <img
                src={selectedImage.imageUrl}
                alt={selectedImage.title}
                className="w-full h-auto rounded-lg"
              />
            </div>
            {selectedImage.description && (
              <p className="text-gray-700 leading-relaxed">
                {selectedImage.description}
              </p>
            )}
            <div className="text-sm text-gray-500">
              Added on {new Date(selectedImage.createdAt).toLocaleDateString()}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default GalleryPage;
