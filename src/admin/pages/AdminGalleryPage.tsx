import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useGalleryStore } from '../../stores/galleryStore';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { formatDate } from '../../utils';
import toast from 'react-hot-toast';

const imageSchema = z.object({
  imageUrl: z.string().url('Please enter a valid URL'),
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
  description: z.string().max(500, 'Description is too long').optional(),
});

type ImageForm = z.infer<typeof imageSchema>;

const AdminGalleryPage: React.FC = () => {
  const { images, fetchImages, createImage, deleteImage, isLoading } = useGalleryStore();
  const [showModal, setShowModal] = useState(false);
  const [deletingImage, setDeletingImage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ImageForm>({
    resolver: zodResolver(imageSchema),
  });

  useEffect(() => {
    fetchImages({ limit: 50 });
  }, [fetchImages]);

  const onSubmit = async (data: ImageForm) => {
    try {
      await createImage(data);
      toast.success('Image added successfully');
      setShowModal(false);
      reset();
    } catch (error) {
      toast.error('Failed to add image');
    }
  };

  const handleDelete = async (imageId: string) => {
    try {
      await deleteImage(imageId);
      toast.success('Image deleted successfully');
      setDeletingImage(null);
    } catch (error) {
      toast.error('Failed to delete image');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    reset();
  };

  return (
    <>
      <Helmet>
        <title>Gallery Management - Admin Panel</title>
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gallery Management</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage community gallery images
            </p>
          </div>
          <Button onClick={() => setShowModal(true)}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Image
          </Button>
        </div>

        {/* Gallery Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {images.map((image) => (
              <div key={image._id} className="bg-white rounded-lg shadow overflow-hidden group">
                <div className="relative">
                  <img
                    src={image.imageUrl}
                    alt={image.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeletingImage(image._id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white text-red-600 hover:text-red-700"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {image.title}
                  </h3>
                  {image.description && (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {image.description}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">
                    Added {formatDate(image.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {images.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">📷</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No images in gallery
            </h3>
            <p className="text-gray-500 mb-4">
              Start building your community gallery by adding some images.
            </p>
            <Button onClick={() => setShowModal(true)}>
              Add First Image
            </Button>
          </div>
        )}
      </div>

      {/* Add Image Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title="Add Gallery Image"
        size="md"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Image URL"
            type="url"
            error={errors.imageUrl?.message}
            required
            placeholder="https://example.com/image.jpg"
            {...register('imageUrl')}
          />

          <Input
            label="Image Title"
            error={errors.title?.message}
            required
            placeholder="Enter a descriptive title"
            {...register('title')}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              {...register('description')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Describe the image..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div className="flex space-x-4 pt-4">
            <Button
              type="submit"
              className="flex-1"
            >
              Add Image
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleCloseModal}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingImage}
        onClose={() => setDeletingImage(null)}
        title="Delete Image"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete this image? This action cannot be undone.
          </p>
          <div className="flex space-x-4">
            <Button
              onClick={() => deletingImage && handleDelete(deletingImage)}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              Delete
            </Button>
            <Button
              variant="secondary"
              onClick={() => setDeletingImage(null)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AdminGalleryPage;
