import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, Image, ArrowRight, Star, Clock, MapPin } from 'lucide-react';
import EventCard from '../components/EventCard';
import OrganizerCard from '../components/OrganizerCard';
import GalleryImage from '../components/GalleryImage';
import { useEventsStore } from '../stores/eventsStore';
import { useOrganizersStore } from '../stores/organizersStore';
import { useGalleryStore } from '../stores/galleryStore';

const HomePage: React.FC = () => {
  // Events from backend via store
  const { events, fetchEvents, isLoading, error } = useEventsStore();

  useEffect(() => {
    // Fetch a small set of active upcoming events for the homepage
    fetchEvents({ page: 1, limit: 6, active: true });
    fetchOrganizers({ active: true });
    fetchImages({ page: 1, limit: 6 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Organizers from backend via store
  const { organizers, fetchOrganizers, isLoading: orgLoading, error: orgError } = useOrganizersStore();

  // Gallery images from backend via store
  const { images: galleryImages, fetchImages, isLoading: galleryLoading, error: galleryError } = useGalleryStore();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/50 to-transparent"></div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Welcome to
              <span className="block bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">
                GAFC Rotterdam
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Join our vibrant community of innovators, creators, and changemakers. 
              Discover amazing events, connect with like-minded people, and be part of something special.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/events"
                className="inline-flex items-center space-x-2 bg-white text-blue-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl"
              >
                <Calendar className="w-6 h-6" />
                <span>Explore Events</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/organizers"
                className="inline-flex items-center space-x-2 border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-blue-700 transition-all duration-300 transform hover:-translate-y-1"
              >
                <Users className="w-6 h-6" />
                <span>Meet Organizers</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-2">50+</h3>
              <p className="text-slate-600">Events Organized</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-2">500+</h3>
              <p className="text-slate-600">Community Members</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Image className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-2">1000+</h3>
              <p className="text-slate-600">Memories Created</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Upcoming Events</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Don't miss out on our exciting upcoming events. Join us for amazing experiences and networking opportunities.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {isLoading ? (
              // Simple loading placeholders
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-80 bg-white rounded-2xl border border-slate-200 animate-pulse" />
              ))
            ) : events && events.length > 0 ? (
              events.slice(0, 6).map((event) => (
                <EventCard key={event._id} event={event} />
              ))
            ) : (
              <div className="col-span-full text-center text-slate-600">
                {error ? error : 'No upcoming events found.'}
              </div>
            )}
          </div>
          
          <div className="text-center">
            <Link
              to="/events"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
            >
              <span>View All Events</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Meet Organizers */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Meet Our Organizers</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Get to know the passionate people behind our amazing community events and initiatives.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {orgLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-72 bg-white rounded-2xl border border-slate-200 animate-pulse" />
              ))
            ) : organizers && organizers.length > 0 ? (
              organizers.slice(0, 6).map((organizer) => (
                <OrganizerCard key={organizer._id} organizer={organizer} />
              ))
            ) : (
              <div className="col-span-full text-center text-slate-600">
                {orgError ? orgError : 'No organizers to display.'}
              </div>
            )}
          </div>
          
          <div className="text-center">
            <Link
              to="/organizers"
              className="inline-flex items-center space-x-2 border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:-translate-y-1"
            >
              <span>Meet All Organizers</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Community Gallery</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Take a look at some of our recent events and community moments.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {galleryLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-square bg-white rounded-2xl border border-slate-200 animate-pulse" />
              ))
            ) : galleryImages && galleryImages.length > 0 ? (
              galleryImages.slice(0, 6).map((image) => (
                <GalleryImage key={image._id} image={image} />
              ))
            ) : (
              <div className="col-span-full text-center text-slate-600">
                {galleryError ? galleryError : 'No gallery images yet.'}
              </div>
            )}
          </div>
          
          <div className="text-center">
            <Link
              to="/gallery"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
            >
              <span>View Full Gallery</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">Ready to Join Our Community?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Be part of something amazing. Connect with like-minded people, attend incredible events, 
            and create lasting memories.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/events"
              className="inline-flex items-center space-x-2 bg-white text-blue-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl"
            >
              <Calendar className="w-6 h-6" />
              <span>Browse Events</span>
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center space-x-2 border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-blue-700 transition-all duration-300 transform hover:-translate-y-1"
            >
              <span>Get in Touch</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
