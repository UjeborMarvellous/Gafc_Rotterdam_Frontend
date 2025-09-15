import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useEventsStore } from '../stores/eventsStore';
import { useCommentsStore } from '../stores/commentsStore';
import { registrationsApi } from '../api/registrations';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { formatDate, formatTime } from '../utils';
import { useImageLazyLoading } from '../hooks/useLazyLoading';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import CommentSection from '../components/CommentSection';
import toast from 'react-hot-toast';

const registrationSchema = z.object({
  userEmail: z.string().email('Please enter a valid email'),
  userName: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  phoneNumber: z.string().min(1, 'Phone number is required').regex(/^[+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number'),
});

type RegistrationForm = z.infer<typeof registrationSchema>;

const EventDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentEvent, fetchEventById, isLoading } = useEventsStore();
  const { comments, fetchComments, isLoading: commentsLoading } = useCommentsStore();
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegistrationForm>({
    resolver: zodResolver(registrationSchema),
  });

  useEffect(() => {
    if (id) {
      fetchEventById(id);
      fetchComments({ limit: 10, approved: true });
    }
  }, [id, fetchEventById, fetchComments]);

  const { ref, imageSrc, isLoading: imageLoading, hasError: imageError } = useImageLazyLoading(
    currentEvent?.imageUrl || ''
  );

  const onSubmitRegistration = async (data: RegistrationForm) => {
    if (!currentEvent || !id) return;

    setIsRegistering(true);
    try {
      await registrationsApi.createRegistration({
        ...data,
        eventId: id,
      });
      toast.success('Registration successful! Check your email for confirmation.');
      setShowRegistrationModal(false);
      reset();
      // Refresh event data to update participant count
      fetchEventById(id);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsRegistering(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-16">
        <div className="container-custom">
          <div className="flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!currentEvent) {
    return (
      <div className="py-16">
        <div className="container-custom text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Event not found</h1>
          <p className="text-gray-600 mb-8">The event you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/events')}>
            Back to Events
          </Button>
        </div>
      </div>
    );
  }

  const isEventFull = currentEvent.currentParticipants >= currentEvent.maxParticipants;
  const isEventPast = new Date(currentEvent.date) < new Date();

  return (
    <>
      <Helmet>
        <title>{currentEvent.title} - GAFC Rotterdam</title>
        <meta name="description" content={currentEvent.description} />
      </Helmet>

      <div className="py-16">
        <div className="container-custom">
          {/* Back Button */}
          <Button
            variant="outline"
            onClick={() => navigate('/events')}
            className="mb-8"
          >
            ← Back to Events
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Event Image */}
              <div ref={ref} className="relative h-64 md:h-96 rounded-lg overflow-hidden mb-8">
                {imageLoading && (
                  <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                    <LoadingSpinner size="lg" />
                  </div>
                )}
                {imageError ? (
                  <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 text-lg">Image not available</span>
                  </div>
                ) : imageSrc ? (
                  <img
                    src={imageSrc}
                    alt={currentEvent.title}
                    className="w-full h-full object-cover"
                  />
                ) : null}
              </div>

              {/* Event Details */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    {currentEvent.title}
                  </h1>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <span className="w-4 h-4 mr-2">📅</span>
                      <span>{formatDate(currentEvent.date)}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-4 h-4 mr-2">🕐</span>
                      <span>{formatTime(currentEvent.date)}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-4 h-4 mr-2">📍</span>
                      <span>{currentEvent.location}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">About this event</h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {currentEvent.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Registration Card */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Details</h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Participants</span>
                      <span className="text-sm text-gray-600">
                        {currentEvent.currentParticipants}/{currentEvent.maxParticipants}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${(currentEvent.currentParticipants / currentEvent.maxParticipants) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    {isEventPast ? (
                      <div className="text-center py-4">
                        <p className="text-gray-500 mb-2">This event has already passed</p>
                      </div>
                    ) : isEventFull ? (
                      <div className="text-center py-4">
                        <p className="text-red-600 mb-2">This event is full</p>
                      </div>
                    ) : (
                      <Button
                        onClick={() => setShowRegistrationModal(true)}
                        className="w-full"
                      >
                        Register for Event
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Comments */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Comments</h3>
                <CommentSection comments={comments} isLoading={commentsLoading} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      <Modal
        isOpen={showRegistrationModal}
        onClose={() => setShowRegistrationModal(false)}
        title="Register for Event"
        size="md"
      >
        <form onSubmit={handleSubmit(onSubmitRegistration)} className="space-y-4">
            <Input
              label="Your Name"
              error={errors.userName?.message}
              required
              {...register('userName')}
            />
          
          <Input
            label="Email Address"
            type="email"
            error={errors.userEmail?.message}
            required
            {...register('userEmail')}
          />
          
          <Input
            label="Phone Number"
            type="tel"
            error={errors.phoneNumber?.message}
            required
            {...register('phoneNumber')}
          />

          <div className="flex space-x-4 pt-4">
            <Button
              type="submit"
              disabled={isRegistering}
              className="flex-1 flex items-center justify-center space-x-2"
            >
              {isRegistering && <LoadingSpinner size="sm" />}
              <span>{isRegistering ? 'Registering...' : 'Register'}</span>
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowRegistrationModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default EventDetailsPage;
