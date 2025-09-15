import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useOrganizersStore } from '../../stores/organizersStore';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const organizerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  position: z.string().min(1, 'Position is required').max(100, 'Position is too long'),
  bio: z.string().min(1, 'Bio is required').max(500, 'Bio is too long'),
  profileImageUrl: z.string().url('Please enter a valid URL'),
  socialLinks: z.object({
    whatsapp: z.string().url().optional().or(z.literal('')),
    instagram: z.string().url().optional().or(z.literal('')),
    facebook: z.string().url().optional().or(z.literal('')),
    linkedin: z.string().url().optional().or(z.literal('')),
  }).optional(),
  isActive: z.boolean(),
});

type OrganizerForm = z.infer<typeof organizerSchema>;

const AdminOrganizersPage: React.FC = () => {
  const { organizers, fetchOrganizers, createOrganizer, updateOrganizer, deleteOrganizer, isLoading } = useOrganizersStore();
  const [showModal, setShowModal] = useState(false);
  const [editingOrganizer, setEditingOrganizer] = useState<string | null>(null);
  const [deletingOrganizer, setDeletingOrganizer] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<OrganizerForm>({
    resolver: zodResolver(organizerSchema),
    defaultValues: {
      isActive: true,
      socialLinks: {
        whatsapp: '',
        instagram: '',
        facebook: '',
        linkedin: '',
      },
    },
  });

  useEffect(() => {
    fetchOrganizers();
  }, [fetchOrganizers]);

  const onSubmit = async (data: OrganizerForm) => {
    try {
      // Clean up empty social links
      const cleanedData = {
        ...data,
        socialLinks: data.socialLinks ? Object.fromEntries(
          Object.entries(data.socialLinks).filter(([_, url]) => url && url.trim() !== '')
        ) : {},
      };

      console.log('Submitting organizer data:', cleanedData);

      if (editingOrganizer) {
        await updateOrganizer(editingOrganizer, cleanedData);
        toast.success('Organizer updated successfully');
      } else {
        await createOrganizer(cleanedData);
        toast.success('Organizer created successfully');
      }
      setShowModal(false);
      setEditingOrganizer(null);
      reset();
    } catch (error: any) {
      console.error('Organizer save error:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to save organizer';
      toast.error(errorMessage);
    }
  };

  const handleEdit = (organizerId: string) => {
    const organizer = organizers.find(o => o._id === organizerId);
    if (organizer) {
      setEditingOrganizer(organizerId);
      setValue('name', organizer.name);
      setValue('position', organizer.position);
      setValue('bio', organizer.bio);
      setValue('profileImageUrl', organizer.profileImageUrl);
      setValue('isActive', organizer.isActive);
      
      // Safely handle socialLinks with fallback to empty object
      const socialLinks = organizer.socialLinks || {};
      setValue('socialLinks', {
        whatsapp: socialLinks.whatsapp || '',
        instagram: socialLinks.instagram || '',
        facebook: socialLinks.facebook || '',
        linkedin: socialLinks.linkedin || '',
      });
      setShowModal(true);
    }
  };

  const handleDelete = async (organizerId: string) => {
    try {
      await deleteOrganizer(organizerId);
      toast.success('Organizer deleted successfully');
      setDeletingOrganizer(null);
    } catch (error) {
      toast.error('Failed to delete organizer');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingOrganizer(null);
    reset();
  };

  return (
    <>
      <Helmet>
        <title>Organizers Management - Admin Panel</title>
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Organizers Management</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage community organizers and team members
            </p>
          </div>
          <Button onClick={() => setShowModal(true)}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Organizer
          </Button>
        </div>

        {/* Organizers Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : organizers && organizers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {organizers.map((organizer) => (
              <div key={organizer._id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center space-x-4">
                    <img
                      className="h-16 w-16 rounded-full object-cover"
                      src={organizer.profileImageUrl}
                      alt={organizer.name}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900 truncate">
                        {organizer.name}
                      </h3>
                      <p className="text-sm text-primary-600 truncate">
                        {organizer.position}
                      </p>
                      {!organizer.isActive && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 mt-1">
                          Inactive
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <p className="mt-4 text-sm text-gray-600 line-clamp-3">
                    {organizer.bio}
                  </p>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex space-x-2">
                      {organizer.socialLinks && Object.entries(organizer.socialLinks).map(([platform, url]) => (
                        url && (
                          <a
                            key={platform}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-primary-600"
                          >
                            <span className="sr-only">{platform}</span>
                            <span className="text-sm">
                              {platform === 'whatsapp' && '📱'}
                              {platform === 'instagram' && '📷'}
                              {platform === 'facebook' && '👥'}
                              {platform === 'linkedin' && '💼'}
                            </span>
                          </a>
                        )
                      ))}
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(organizer._id)}
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeletingOrganizer(organizer._id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {(!organizers || organizers.length === 0) && !isLoading && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">👥</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No organizers found
            </h3>
            <p className="text-gray-500 mb-4">
              Add team members to showcase your community organizers.
            </p>
            <Button onClick={() => setShowModal(true)}>
              Add First Organizer
            </Button>
          </div>
        )}
      </div>

      {/* Organizer Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingOrganizer ? 'Edit Organizer' : 'Add Organizer'}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              error={errors.name?.message}
              required
              {...register('name')}
            />
            <Input
              label="Position"
              error={errors.position?.message}
              required
              {...register('position')}
            />
          </div>

          <Input
            label="Profile Image URL"
            type="url"
            error={errors.profileImageUrl?.message}
            required
            placeholder="https://example.com/profile.jpg"
            {...register('profileImageUrl')}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio
              <span className="text-red-500 ml-1">*</span>
            </label>
            <textarea
              {...register('bio')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Tell us about this organizer..."
            />
            {errors.bio && (
              <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Social Media Links (Optional)
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="WhatsApp"
                type="url"
                error={errors.socialLinks?.whatsapp?.message}
                placeholder="https://wa.me/1234567890"
                {...register('socialLinks.whatsapp')}
              />
              <Input
                label="Instagram"
                type="url"
                error={errors.socialLinks?.instagram?.message}
                placeholder="https://instagram.com/username"
                {...register('socialLinks.instagram')}
              />
              <Input
                label="Facebook"
                type="url"
                error={errors.socialLinks?.facebook?.message}
                placeholder="https://facebook.com/username"
                {...register('socialLinks.facebook')}
              />
              <Input
                label="LinkedIn"
                type="url"
                error={errors.socialLinks?.linkedin?.message}
                placeholder="https://linkedin.com/in/username"
                {...register('socialLinks.linkedin')}
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('isActive')}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">
              Organizer is active
            </label>
          </div>

          <div className="flex space-x-4 pt-4">
            <Button
              type="submit"
              className="flex-1"
            >
              {editingOrganizer ? 'Update Organizer' : 'Add Organizer'}
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
        isOpen={!!deletingOrganizer}
        onClose={() => setDeletingOrganizer(null)}
        title="Delete Organizer"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete this organizer? This action cannot be undone.
          </p>
          <div className="flex space-x-4">
            <Button
              onClick={() => deletingOrganizer && handleDelete(deletingOrganizer)}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              Delete
            </Button>
            <Button
              variant="secondary"
              onClick={() => setDeletingOrganizer(null)}
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

export default AdminOrganizersPage;
