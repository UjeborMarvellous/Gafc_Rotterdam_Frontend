import React from 'react';
import { Link } from 'react-router-dom';
import { Event } from '../types';
import { formatDate, formatTime } from '../utils';
import { useImageLazyLoading } from '../hooks/useLazyLoading';
import { Calendar, Clock, MapPin, Users, ArrowRight } from 'lucide-react';
import GlassCard from './ui/GlassCard';

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const { ref, imageSrc, isLoading, hasError } = useImageLazyLoading(event.imageUrl);

  return (
    <GlassCard className="group overflow-hidden">
      <div ref={ref} className="relative h-48 overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 animate-pulse flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin" />
          </div>
        )}
        {hasError ? (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
            <span className="text-slate-500 font-medium">Image not available</span>
          </div>
        ) : imageSrc ? (
          <img
            src={imageSrc}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : null}
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        
        {/* Status badge */}
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            event.isActive 
              ? 'bg-brand-green-100 text-brand-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {event.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors duration-200 mb-3">
          {event.title}
        </h3>
        
        <p className="text-slate-600 text-sm line-clamp-3 mb-4 leading-relaxed">
          {event.description}
        </p>

        <div className="space-y-3 mb-6">
          <div className="flex items-center text-slate-600">
            <Calendar className="w-4 h-4 mr-3 text-blue-500" />
            <span className="text-sm font-medium">{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center text-slate-600">
            <Clock className="w-4 h-4 mr-3 text-blue-500" />
            <span className="text-sm font-medium">{formatTime(event.date)}</span>
          </div>
          <div className="flex items-center text-slate-600">
            <MapPin className="w-4 h-4 mr-3 text-blue-500" />
            <span className="text-sm font-medium truncate">{event.location}</span>
          </div>
        </div>

        {/* Participants progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center text-slate-600">
              <Users className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">
                {event.currentParticipants || 0}/{event.maxParticipants || 100} participants
              </span>
            </div>
            <span className="text-sm font-semibold text-blue-600">
              {Math.round(((event.currentParticipants || 0) / (event.maxParticipants || 100)) * 100)}%
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
              style={{
                width: `${((event.currentParticipants || 0) / (event.maxParticipants || 100)) * 100}%`,
              }}
            />
          </div>
        </div>

        <Link
          to={`/events/${event._id}`}
          className="inline-flex items-center justify-center w-full bg-brand-green-600 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-brand-green-700 transition-all duration-300 transform hover:-translate-y-0.5 shadow-soft hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-brand-green-600/30 group"
        >
          <span>View Details</span>
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
        </Link>
      </div>
    </GlassCard>
  );
};

export default EventCard;
