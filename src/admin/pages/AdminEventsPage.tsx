import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useEventsStore } from '../../stores/eventsStore';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { formatDate, formatTime } from '../../utils';
import toast from 'react-hot-toast';

const eventSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
  description: z.string().min(1, 'Description is required').max(1000, 'Description is too long'),
  date: z.string().min(1, 'Date is required'),
  location: z.string().min(1, 'Location is required').max(200, 'Location is too long'),
  imageUrl: z.string().url('Please enter a valid URL'),
  maxParticipants: z.number().min(1, 'Must be at least 1').max(1000, 'Cannot exceed 1000'),
  isActive: z.boolean(),
});

type EventForm = z.infer<typeof eventSchema>;

const AdminEventsPage: React.FC = () => {
  const { events, fetchEvents, createEvent, updateEvent, deleteEvent, isLoading } = useEventsStore();
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<string | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<EventForm>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      isActive: true,
      maxParticipants: 50,
    },
  });

  useEffect(() => {
    fetchEvents({ limit: 20 });
  }, [fetchEvents]);

  const onSubmit = async (data: EventForm) => {
    try {
      if (editingEvent) {
        await updateEvent(editingEvent, data);
        toast.success('Event updated successfully');
      } else {
        await createEvent(data);
        toast.success('Event created successfully');
      }
      setShowModal(false);
      setEditingEvent(null);
      reset();
    } catch (error) {
      toast.error('Failed to save event');
    }
  };

  const handleEdit = (eventId: string) => {
    const event = events.find(e => e._id === eventId);
    if (event) {
      setEditingEvent(eventId);
      setValue('title', event.title);
      setValue('description', event.description);
      setValue('date', new Date(event.date).toISOString().slice(0, 16));
      setValue('location', event.location);
      setValue('imageUrl', event.imageUrl);
      setValue('maxParticipants', event.maxParticipants);
      setValue('isActive', event.isActive);
      setShowModal(true);
    }
  };

  const handleDelete = async (eventId: string) => {
    try {
      await deleteEvent(eventId);
      toast.success('Event deleted successfully');
      setDeletingEvent(null);
    } catch (error) {
      toast.error('Failed to delete event');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingEvent(null);
    reset();
  };

  return (
    <>
      <Helmet>
        <title>Events Management - Admin Panel</title>
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Events Management</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage community events and registrations
            </p>
          </div>
          <Button onClick={() => setShowModal(true)}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Event
          </Button>
        </div>

        {/* Events Table */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {events.map((event) => (
                <li key={event._id}>
                  <div className="px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-16 w-16">
                        <img
                          className="h-16 w-16 rounded-lg object-cover"
                          src={event.imageUrl}
                          alt={event.title}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center">
                          <h3 className="text-lg font-medium text-gray-900">
                            {event.title}
                          </h3>
                          {!event.isActive && (
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Inactive
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 line-clamp-2">
                          {event.description}
                        </p>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <span>{formatDate(event.date)} at {formatTime(event.date)}</span>
                          <span className="mx-2">•</span>
                          <span>{event.location}</span>
                          <span className="mx-2">•</span>
                          <span>{event.currentParticipants}/{event.maxParticipants} participants</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(event._id)}
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeletingEvent(event._id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            {events.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No events found. Create your first event!</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Event Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingEvent ? 'Edit Event' : 'Create Event'}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Event Title"
              error={errors.title?.message}
              required
              {...register('title')}
            />
            <Input
              label="Location"
              error={errors.location?.message}
              required
              {...register('location')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
              <span className="text-red-500 ml-1">*</span>
            </label>
            <textarea
              {...register('description')}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Describe your event..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Date & Time"
              type="datetime-local"
              error={errors.date?.message}
              required
              {...register('date')}
            />
            <Input
              label="Max Participants"
              type="number"
              error={errors.maxParticipants?.message}
              required
              {...register('maxParticipants', { valueAsNumber: true })}
            />
          </div>

          <Input
            label="Image URL"
            type="url"
            error={errors.imageUrl?.message}
            required
            {...register('imageUrl')}
          />

          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('isActive')}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">
              Event is active
            </label>
          </div>

          <div className="flex space-x-4 pt-4">
            <Button
              type="submit"
              className="flex-1"
            >
              {editingEvent ? 'Update Event' : 'Create Event'}
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
        isOpen={!!deletingEvent}
        onClose={() => setDeletingEvent(null)}
        title="Delete Event"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete this event? This action cannot be undone.
          </p>
          <div className="flex space-x-4">
            <Button
              onClick={() => deletingEvent && handleDelete(deletingEvent)}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              Delete
            </Button>
            <Button
              variant="secondary"
              onClick={() => setDeletingEvent(null)}
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

export default AdminEventsPage;
