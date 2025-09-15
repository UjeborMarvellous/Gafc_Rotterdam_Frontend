import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useEventsStore } from '../stores/eventsStore';
import EventCard from '../components/EventCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Button from '../components/ui/Button';

const EventsPage: React.FC = () => {
  const { events, fetchEvents, isLoading, pagination } = useEventsStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [showActiveOnly, setShowActiveOnly] = useState(true);

  useEffect(() => {
    fetchEvents({ page: currentPage, limit: 9, active: showActiveOnly });
  }, [fetchEvents, currentPage, showActiveOnly]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterChange = (active: boolean) => {
    setShowActiveOnly(active);
    setCurrentPage(1);
  };

  return (
    <>
      <Helmet>
        <title>Events - GAFC Rotterdam</title>
        <meta name="description" content="Discover upcoming events and activities in the GAFC Rotterdam community." />
      </Helmet>

      <div className="py-16">
        <div className="container-custom">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our Events
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join our exciting events and connect with fellow community members
            </p>
          </div>

          {/* Filter */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => handleFilterChange(true)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  showActiveOnly
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Upcoming Events
              </button>
              <button
                onClick={() => handleFilterChange(false)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  !showActiveOnly
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                All Events
              </button>
            </div>
          </div>

          {/* Events Grid */}
          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : events.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {events.map((event) => (
                  <EventCard key={event._id} event={event} />
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
                <span className="text-4xl">📅</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No events found
              </h3>
              <p className="text-gray-500">
                {showActiveOnly
                  ? 'No upcoming events at the moment. Check back later!'
                  : 'No events have been created yet.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EventsPage;
