import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useOrganizersStore } from '../stores/organizersStore';
import OrganizerCard from '../components/OrganizerCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const OrganizersPage: React.FC = () => {
  const { organizers, fetchOrganizers, isLoading } = useOrganizersStore();

  useEffect(() => {
    fetchOrganizers({ active: true });
  }, [fetchOrganizers]);

  return (
    <>
      <Helmet>
        <title>Meet Our Organizers - GAFC Rotterdam</title>
        <meta name="description" content="Get to know the amazing people behind our GAFC Rotterdam community." />
      </Helmet>

      <div className="py-16">
        <div className="container-custom">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Meet Our Organizers
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get to know the amazing people behind our community
            </p>
          </div>

          {/* Organizers Grid */}
          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : organizers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {organizers.map((organizer) => (
                <OrganizerCard key={organizer._id} organizer={organizer} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">👥</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No organizers to display
              </h3>
              <p className="text-gray-500">
                Our organizer profiles are being updated. Check back soon!
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default OrganizersPage;
