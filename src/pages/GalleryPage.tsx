import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useGalleryStore } from '../stores/galleryStore';
import GalleryImage from '../components/GalleryImage';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { GalleryImage as GalleryImageType } from '../types';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const GalleryPage: React.FC = () => {
  const { images, fetchImages, isLoading, pagination } = useGalleryStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState<GalleryImageType | null>(null);

  const headerAnimation = useScrollAnimation();

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

      <div className="py-20">
        <div className="container-custom">
          {/* Header */}
          <motion.div
            ref={headerAnimation.ref}
            initial={{ opacity: 0, y: 30 }}
            animate={headerAnimation.isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={headerAnimation.isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6"
            >
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                Community Gallery
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={headerAnimation.isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed"
            >
              Capturing the vibrant moments and unforgettable memories of our thriving community
            </motion.p>
          </motion.div>

          {/* Gallery Grid */}
          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : images.length > 0 ? (
            <>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  visible: {
                    transition: {
                      staggerChildren: 0.08
                    }
                  }
                }}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-12"
              >
                {images.map((image, index) => (
                  <motion.div
                    key={image._id}
                    variants={{
                      hidden: { opacity: 0, scale: 0.8, y: 20 },
                      visible: { opacity: 1, scale: 1, y: 0 }
                    }}
                    transition={{
                      duration: 0.5,
                      ease: "easeOut"
                    }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="group cursor-pointer"
                  >
                    <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
                      <GalleryImage
                        image={image}
                        onClick={() => setSelectedImage(image)}
                      />
                    </div>
                  </motion.div>
                ))}
              </motion.div>

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
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-16"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg"
              >
                <span className="text-6xl">📷</span>
              </motion.div>
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-2xl font-bold text-slate-900 mb-3"
              >
                No images in gallery
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-lg text-slate-600 max-w-md mx-auto"
              >
                Check back later for new photos from our vibrant community events.
              </motion.p>
            </motion.div>
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
