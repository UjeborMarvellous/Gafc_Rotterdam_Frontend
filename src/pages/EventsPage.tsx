import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Search, Filter } from 'lucide-react';
import { useEventsStore } from '../stores/eventsStore';
import EventCard from '../components/EventCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Button from '../components/ui/Button';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const EventsPage: React.FC = () => {
  const { events, fetchEvents, isLoading, pagination } = useEventsStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [showActiveOnly, setShowActiveOnly] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const headerAnimation = useScrollAnimation({ threshold: 0.2 });

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

  // Filter events by search query
  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Helmet>
        <title>Events - GAFC Rotterdam</title>
        <meta name="description" content="Discover upcoming events and activities in the GAFC Rotterdam community." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-12 sm:py-16 lg:py-20">
        <div className="container-custom">
          {/* Animated Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-green-100 text-brand-green-700 text-sm font-semibold mb-6"
            >
              <Calendar className="h-4 w-4" />
              <span>Discover Events</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6"
            >
              Our <span className="text-gradient">Events</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4"
            >
              Join our exciting events and connect with fellow community members
            </motion.p>
          </motion.div>

          {/* Search and Filter Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="max-w-4xl mx-auto mb-12 space-y-6"
          >
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search events by name, description, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-brand-green-500 focus:ring-4 focus:ring-brand-green-100 transition-all duration-200 text-gray-900 placeholder-gray-500"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 bg-white rounded-2xl p-1.5 shadow-lg border border-gray-200">
                <button
                  onClick={() => handleFilterChange(true)}
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    showActiveOnly
                      ? 'bg-gradient-to-r from-brand-green-600 to-brand-green-700 text-white shadow-md hover:shadow-lg transform hover:scale-105'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Calendar className="h-4 w-4" />
                  Upcoming Events
                </button>
                <button
                  onClick={() => handleFilterChange(false)}
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    !showActiveOnly
                      ? 'bg-gradient-to-r from-brand-green-600 to-brand-green-700 text-white shadow-md hover:shadow-lg transform hover:scale-105'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Filter className="h-4 w-4" />
                  All Events
                </button>
              </div>
            </div>
          </motion.div>

          {/* Events Grid with AnimatePresence */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
              {Array.from({ length: 6 }).map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className="h-96 rounded-3xl border border-slate-200 skeleton"
                />
              ))}
            </div>
          ) : filteredEvents.length > 0 ? (
            <>
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12"
              >
                <AnimatePresence mode="popLayout">
                  {filteredEvents.map((event, index) => (
                    <motion.div
                      key={event._id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.1, duration: 0.4 }}
                      className="h-full"
                    >
                      <div className="hover-lift h-full">
                        <EventCard event={event} />
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* Enhanced Pagination */}
              {pagination && pagination.pages > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-2"
                >
                  <Button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto hover-lift disabled:hover:transform-none"
                  >
                    ← Previous
                  </Button>

                  <div className="flex flex-wrap justify-center gap-2">
                    {Array.from({ length: Math.min(pagination.pages, 7) }, (_, i) => {
                      let page: number;
                      if (pagination.pages <= 7) {
                        page = i + 1;
                      } else if (currentPage <= 4) {
                        page = i + 1;
                      } else if (currentPage >= pagination.pages - 3) {
                        page = pagination.pages - 6 + i;
                      } else {
                        page = currentPage - 3 + i;
                      }

                      return (
                        <Button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          variant={page === currentPage ? 'primary' : 'outline'}
                          size="sm"
                          className={`w-10 hover-lift ${
                            page === currentPage ? 'shadow-glow-green' : ''
                          }`}
                        >
                          {page}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === pagination.pages}
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto hover-lift disabled:hover:transform-none"
                  >
                    Next →
                  </Button>
                </motion.div>
              )}
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-16 sm:py-20"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-soft"
              >
                <Calendar className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400" />
              </motion.div>

              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-3"
              >
                {searchQuery ? 'No matching events' : 'No events found'}
              </motion.h3>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-base sm:text-lg text-gray-500 max-w-md mx-auto px-4"
              >
                {searchQuery ? (
                  <>Try adjusting your search or filter to find what you're looking for.</>
                ) : showActiveOnly ? (
                  <>No upcoming events at the moment. Check back later!</>
                ) : (
                  <>No events have been created yet.</>
                )}
              </motion.p>

              {searchQuery && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  onClick={() => setSearchQuery('')}
                  className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-green-600 text-white font-semibold hover-lift hover:bg-brand-green-700 transition-all duration-300"
                >
                  Clear Search
                </motion.button>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default EventsPage;
