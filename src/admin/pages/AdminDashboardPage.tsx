import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Users,
  Image,
  MessageSquare,
  TrendingUp,
  Clock,
  MapPin,
  Eye,
  Plus,
  ArrowRight,
} from 'lucide-react';
import { useEventsStore } from '../../stores/eventsStore';
import { useOrganizersStore } from '../../stores/organizersStore';
import { useGalleryStore } from '../../stores/galleryStore';
import { useCommentsStore } from '../../stores/commentsStore';
import { formatDate } from '../../utils';

const AdminDashboardPage: React.FC = () => {
  const {
    events,
    fetchEvents,
    isLoading: eventsLoading,
  } = useEventsStore();

  const {
    organizers,
    fetchOrganizers,
    isLoading: organizersLoading,
  } = useOrganizersStore();

  const {
    images: galleryImages,
    fetchImages,
    isLoading: galleryLoading,
  } = useGalleryStore();

  const {
    comments,
    fetchComments,
    isLoading: commentsLoading,
  } = useCommentsStore();

  useEffect(() => {
    fetchEvents({ limit: 10, page: 1 });
    fetchOrganizers();
    fetchImages({ limit: 12, page: 1 });
    fetchComments({ limit: 12, page: 1 });
  }, [fetchEvents, fetchOrganizers, fetchImages, fetchComments]);

  const totalEvents = events.length;
  const upcomingEvents = useMemo(
    () => events.filter((event) => new Date(event.date) >= new Date()).length,
    [events],
  );

  const totalOrganizers = organizers.length;
  const activeOrganizers = useMemo(
    () => organizers.filter((organizer) => organizer.isActive).length,
    [organizers],
  );

  const totalImages = galleryImages.length;
  const imagesThisMonth = useMemo(() => {
    const now = new Date();
    return galleryImages.filter((image: any) => {
      if (!image?.createdAt) return false;
      const created = new Date(image.createdAt);
      return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
    }).length;
  }, [galleryImages]);

  const totalComments = comments.length;
  const pendingComments = useMemo(
    () => comments.filter((comment) => !comment.isApproved).length,
    [comments],
  );

  const stats = [
    {
      title: 'Total Events',
      value: eventsLoading && totalEvents === 0 ? '—' : totalEvents,
      change: upcomingEvents > 0 ? `${upcomingEvents} upcoming` : 'No upcoming events',
      changeType: upcomingEvents > 0 ? 'positive' : 'neutral',
      icon: Calendar,
      color: 'blue',
    },
    {
      title: 'Active Organizers',
      value: organizersLoading && activeOrganizers === 0 ? '—' : activeOrganizers,
      change:
        totalOrganizers === activeOrganizers
          ? 'All organisers active'
          : `${totalOrganizers - activeOrganizers} inactive`,
      changeType: totalOrganizers === activeOrganizers ? 'positive' : 'neutral',
      icon: Users,
      color: 'green',
    },
    {
      title: 'Gallery Images',
      value: galleryLoading && totalImages === 0 ? '—' : totalImages,
      change: imagesThisMonth > 0 ? `${imagesThisMonth} added this month` : 'Live total',
      changeType: imagesThisMonth > 0 ? 'positive' : 'neutral',
      icon: Image,
      color: 'purple',
    },
    {
      title: 'Comments',
      value: commentsLoading && totalComments === 0 ? '—' : totalComments,
      change: pendingComments > 0 ? `${pendingComments} awaiting review` : 'All moderated',
      changeType: pendingComments > 0 ? 'warning' : 'positive',
      icon: MessageSquare,
      color: 'orange',
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      purple: 'from-purple-500 to-purple-600',
      orange: 'from-orange-500 to-orange-600',
    };
    return colors[color as keyof typeof colors] || 'from-gray-500 to-gray-600';
  };

  const sortedEvents = useMemo(
    () =>
      [...events]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5),
    [events],
  );

  const recentComments = useMemo(
    () =>
      [...comments]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5),
    [comments],
  );

  const loadingDashboard = eventsLoading && organizersLoading && galleryLoading && commentsLoading;

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm sm:text-base text-slate-600 mt-1">Live insight across events, organisers, gallery, and comments.</p>
        </div>
        <div className="flex items-center space-x-4">
          <Link
            to="/admin/events"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg text-sm sm:text-base"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden xs:inline">New Event</span>
            <span className="xs:hidden">New</span>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat) => {
          const IconComponent = stat.icon;
          const gradientClasses = getColorClasses(stat.color);
          const changeClasses =
            stat.changeType === 'positive'
              ? 'text-green-600'
              : stat.changeType === 'negative'
              ? 'text-red-600'
              : stat.changeType === 'warning'
              ? 'text-amber-600'
              : 'text-slate-600';

          return (
            <div
              key={stat.title}
              className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-slate-200 p-4 sm:p-6 flex flex-col space-y-3 sm:space-y-4 hover:shadow-xl transition-shadow duration-300"
            >
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br ${gradientClasses} text-white flex items-center justify-center shadow-lg`}>
                <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <p className="text-slate-600 text-xs sm:text-sm">{stat.title}</p>
                <p className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1 sm:mt-2">{stat.value}</p>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className={`w-3 h-3 sm:w-4 sm:h-4 ${changeClasses}`} />
                <span className={`text-xs sm:text-sm font-medium ${changeClasses}`}>{stat.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Recent Events */}
        <div className="lg:col-span-2 bg-white rounded-xl sm:rounded-2xl shadow-lg border border-slate-200">
          <div className="p-4 sm:p-6 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">Recent Events</h2>
              <p className="text-slate-500 text-xs sm:text-sm">Latest updates from your community events</p>
            </div>
            <Link
              to="/admin/events"
              className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-700 font-medium text-xs sm:text-sm"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </Link>
          </div>
          {loadingDashboard && sortedEvents.length === 0 ? (
            <div className="flex items-center justify-center py-8 sm:py-12 text-slate-500 text-sm">Loading live event data…</div>
          ) : sortedEvents.length > 0 ? (
            <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
            <div className="divide-y divide-slate-200">
              {sortedEvents.map((event, index) => {
                const participants = event.currentParticipants ?? 0;
                const maxParticipants = event.maxParticipants || 1;
                const progress = Math.min(100, Math.round((participants / maxParticipants) * 100));

                return (
                    <div key={event._id || `event-${index}`} className="p-4 sm:p-6 hover:bg-slate-50 transition-colors duration-200">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base sm:text-lg font-semibold text-slate-900 truncate">{event.title}</h3>
                          <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 text-xs sm:text-sm text-slate-500 mt-2">
                          <div className="inline-flex items-center space-x-1">
                              <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>{new Date(event.date).toLocaleDateString()}</span>
                          </div>
                          <div className="inline-flex items-center space-x-1">
                              <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>
                              {participants}/{maxParticipants} participants
                            </span>
                          </div>
                          {event.location && (
                            <div className="inline-flex items-center space-x-1">
                                <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="truncate">{event.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                        <div className="flex items-center space-x-2 sm:space-x-3">
                        <span
                            className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${
                            event.isActive ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {event.isActive ? 'Active' : 'Completed'}
                        </span>
                          <div className="w-16 sm:w-24 bg-slate-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center py-8 sm:py-12 text-slate-500 text-sm">No events to display yet.</div>
          )}
        </div>

        {/* Recent Comments */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-slate-200">
          <div className="p-4 sm:p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">Recent Comments</h2>
              <Link
                to="/admin/comments"
                className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-700 font-medium text-xs sm:text-sm"
              >
                <span>View All</span>
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </Link>
            </div>
          </div>
          {loadingDashboard && recentComments.length === 0 ? (
            <div className="flex items-center justify-center py-8 sm:py-12 text-slate-500 text-sm">Loading community feedback…</div>
          ) : recentComments.length > 0 ? (
            <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
              <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
              {recentComments.map((comment, index) => (
                  <div key={comment._id || `comment-${index}`} className="p-3 sm:p-4 bg-slate-50 rounded-lg sm:rounded-xl hover:bg-slate-100 transition-colors duration-200">
                    <div className="flex items-start space-x-2 sm:space-x-3">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs sm:text-sm font-semibold">
                        {comment.authorName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 mb-1">
                          <h4 className="font-semibold text-slate-900 text-xs sm:text-sm">{comment.authorName}</h4>
                          <span className="text-xs text-slate-500 hidden sm:inline">•</span>
                          <span className="text-xs text-slate-500 truncate">{comment.authorEmail}</span>
                      </div>
                        <p className="text-slate-600 text-xs sm:text-sm mb-2 line-clamp-2">{comment.content}</p>
                      <div className="flex items-center text-xs text-slate-500">
                        <Clock className="w-3 h-3 mr-1" />
                        <span>{formatDate(comment.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center py-8 sm:py-12 text-slate-500 text-sm">No comments to display yet.</div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-slate-200 p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 sm:mb-6">Quick Actions</h2>
        
        {/* Mobile Layout - Vertical Cards */}
        <div className="block sm:hidden space-y-3">
          <Link
            to="/admin/events"
            className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all duration-300 group"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 text-sm">Manage Events</h3>
                <p className="text-xs text-slate-600">Create and edit events</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
          </Link>

          <Link
            to="/admin/organizers"
            className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl hover:from-green-100 hover:to-green-200 transition-all duration-300 group"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <Users className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 text-sm">Organizers</h3>
                <p className="text-xs text-slate-600">Manage team members</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-green-600 transition-colors" />
          </Link>

          <Link
            to="/admin/gallery"
            className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl hover:from-purple-100 hover:to-purple-200 transition-all duration-300 group"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <Image className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 text-sm">Gallery</h3>
                <p className="text-xs text-slate-600">Upload and manage images</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 transition-colors" />
          </Link>

          <Link
            to="/admin/comments"
            className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl hover:from-orange-100 hover:to-orange-200 transition-all duration-300 group"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 text-sm">Comments</h3>
                <p className="text-xs text-slate-600">Moderate discussions</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-orange-600 transition-colors" />
          </Link>
        </div>

        {/* Desktop Layout - Grid Cards */}
        <div className="hidden sm:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/admin/events"
            className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all duration-300 group"
          >
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Manage Events</h3>
              <p className="text-sm text-slate-600">Create and edit events</p>
            </div>
          </Link>

          <Link
            to="/admin/organizers"
            className="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl hover:from-green-100 hover:to-green-200 transition-all duration-300 group"
          >
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Organizers</h3>
              <p className="text-sm text-slate-600">Manage team members</p>
            </div>
          </Link>

          <Link
            to="/admin/gallery"
            className="flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl hover:from-purple-100 hover:to-purple-200 transition-all duration-300 group"
          >
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <Image className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Gallery</h3>
              <p className="text-sm text-slate-600">Upload and manage images</p>
            </div>
          </Link>

          <Link
            to="/admin/comments"
            className="flex items-center space-x-3 p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl hover:from-orange-100 hover:to-orange-200 transition-all duration-300 group"
          >
            <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Comments</h3>
              <p className="text-sm text-slate-600">Moderate discussions</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
