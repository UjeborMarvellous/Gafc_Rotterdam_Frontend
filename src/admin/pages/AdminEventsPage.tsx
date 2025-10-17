import React, { useEffect, useRef, useState } from 'react';
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
import { useSettingsStore } from '../../stores/settingsStore';

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
  const { defaultEventSettings } = useSettingsStore();
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<string | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<string | null>(null);

  const [formBanner, setFormBanner] = useState<{ type: 'error' | 'success'; message: string } | null>(null);
  const bannerTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const clearFormBanner = () => {
    if (bannerTimeoutRef.current) {
      clearTimeout(bannerTimeoutRef.current);
      bannerTimeoutRef.current = null;
    }
    setFormBanner(null);
  };

  const showFormBanner = (type: 'error' | 'success', message: string) => {
    if (bannerTimeoutRef.current) {
      clearTimeout(bannerTimeoutRef.current);
    }

    setFormBanner({ type, message });
    bannerTimeoutRef.current = setTimeout(() => {
      setFormBanner(null);
      bannerTimeoutRef.current = null;
    }, 5000);
  };

  const resetToDefaultValues = () => {
    reset({
      title: '',
      description: '',
      date: '',
      location: defaultEventSettings.location || '',
      imageUrl: '',
      maxParticipants: defaultEventSettings.maxParticipants,
      isActive: true,
    });
  };

  useEffect(() => {
    return () => {
      if (bannerTimeoutRef.current) {
        clearTimeout(bannerTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    fetchEvents({ limit: 20 });
  }, [fetchEvents]);

  const onSubmit = async (data: EventForm) => {
    const selectedDate = new Date(data.date);
    const now = Date.now();

    if (Number.isNaN(selectedDate.getTime())) {
      showFormBanner('error', 'Please provide a valid date and time for this event.');
      return;
    }

    if (selectedDate.getTime() <= now) {
      showFormBanner('error', 'Event date must be in the future. Update the date before saving.');
      return;
    }

    try {
      if (editingEvent) {
        await updateEvent(editingEvent, data);
        toast.success('Event updated successfully');
      } else {
        await createEvent(data);
        toast.success('Event created successfully');
      }
      clearFormBanner();
      setShowModal(false);
      setEditingEvent(null);
      resetToDefaultValues();
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
      clearFormBanner();
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
    clearFormBanner();
    setShowModal(false);
    setEditingEvent(null);
    resetToDefaultValues();
  };

  return (
    <>
      <Helmet>
        <title>Events Management - Admin Panel</title>
      </Helmet>

      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Events Management</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage community events and registrations
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingEvent(null);
              resetToDefaultValues();
              clearFormBanner();
              setShowModal(true);
            }}
            className="w-full sm:w-auto"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Event
          </Button>
        </div>

        {/* Events Cards - Horizontal Scroll */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : events.length > 0 ? (
          <div className="relative">
            {/* Scrollable Container */}
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pb-4">
              <div className="flex space-x-4 min-w-max">
              {events.map((event) => (
                  <div
                    key={event._id}
                    className="flex-shrink-0 w-80 sm:w-96 bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300"
                  >
                    {/* Event Image */}
                    <div className="relative h-48 w-full">
                      <img
                        className="h-48 w-full rounded-t-xl object-cover"
                          src={event.imageUrl}
                          alt={event.title}
                        />
                          {!event.isActive && (
                        <div className="absolute top-3 right-3">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Inactive
                            </span>
                        </div>
                          )}
                        </div>
                    
                    {/* Event Content */}
                    <div className="p-4 sm:p-6">
                      <div className="mb-3">
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                          {event.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {event.description}
                        </p>
                      </div>
                      
                      {/* Event Details */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{formatDate(event.date)} at {formatTime(event.date)}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="truncate">{event.location}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <span>{event.currentParticipants || 0}/{event.maxParticipants} participants</span>
                      </div>
                    </div>
                      
                      {/* Action Buttons */}
                      <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(event._id)}
                          className="flex-1"
                      >
                          <PencilIcon className="h-4 w-4 mr-1" />
                          Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeletingEvent(event._id)}
                          className="flex-1 text-red-600 hover:text-red-700 hover:border-red-300"
                      >
                          <TrashIcon className="h-4 w-4 mr-1" />
                          Delete
                      </Button>
                    </div>
                  </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Scroll Indicator */}
            <div className="absolute top-1/2 -translate-y-1/2 right-0 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-400 pointer-events-none">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-500 mb-4">Create your first event to get started!</p>
            <Button
              onClick={() => {
                setEditingEvent(null);
                resetToDefaultValues();
                clearFormBanner();
                setShowModal(true);
              }}
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Create Event
            </Button>
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
          {formBanner && (
            <div
              role="alert"
              className={`rounded-xl border px-4 py-3 text-sm ${formBanner.type === 'error' ? 'border-red-200 bg-red-50 text-red-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`}
            >
              {formBanner.message}
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

