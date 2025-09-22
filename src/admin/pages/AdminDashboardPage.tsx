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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-1">Live insight across events, organisers, gallery, and comments.</p>
        </div>
        <div className="flex items-center space-x-4">
          <Link
            to="/admin/events"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>New Event</span>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 flex flex-col space-y-4 hover:shadow-xl transition-shadow duration-300"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradientClasses} text-white flex items-center justify-center shadow-lg`}>
                <IconComponent className="w-6 h-6" />
              </div>
              <div>
                <p className="text-slate-600 text-sm">{stat.title}</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{stat.value}</p>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className={`w-4 h-4 ${changeClasses}`} />
                <span className={`text-sm font-medium ${changeClasses}`}>{stat.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Events */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-slate-200">
          <div className="p-6 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Recent Events</h2>
              <p className="text-slate-500 text-sm">Latest updates from your community events</p>
            </div>
            <Link
              to="/admin/events"
              className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {loadingDashboard && sortedEvents.length === 0 ? (
            <div className="flex items-center justify-center py-12 text-slate-500">Loading live event data…</div>
          ) : sortedEvents.length > 0 ? (
            <div className="divide-y divide-slate-200">
              {sortedEvents.map((event) => {
                const participants = event.currentParticipants ?? 0;
                const maxParticipants = event.maxParticipants || 1;
                const progress = Math.min(100, Math.round((participants / maxParticipants) * 100));

                return (
                  <div key={event._id} className="p-6 hover:bg-slate-50 transition-colors duration-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">{event.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-slate-500 mt-2">
                          <div className="inline-flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{new Date(event.date).toLocaleDateString()}</span>
                          </div>
                          <div className="inline-flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>
                              {participants}/{maxParticipants} participants
                            </span>
                          </div>
                          {event.location && (
                            <div className="inline-flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span>{event.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            event.isActive ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {event.isActive ? 'Active' : 'Completed'}
                        </span>
                        <div className="w-24 bg-slate-200 rounded-full h-2">
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
          ) : (
            <div className="flex items-center justify-center py-12 text-slate-500">No events to display yet.</div>
          )}
        </div>

        {/* Recent Comments */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Recent Comments</h2>
              <Link
                to="/admin/comments"
                className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                <span>View All</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          {loadingDashboard && recentComments.length === 0 ? (
            <div className="flex items-center justify-center py-12 text-slate-500">Loading community feedback…</div>
          ) : recentComments.length > 0 ? (
            <div className="p-6 space-y-4">
              {recentComments.map((comment) => (
                <div key={comment._id} className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors duration-200">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-semibold">
                        {comment.authorName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold text-slate-900 text-sm">{comment.authorName}</h4>
                        <span className="text-xs text-slate-500">•</span>
                        <span className="text-xs text-slate-500">{comment.authorEmail}</span>
                      </div>
                      <p className="text-slate-600 text-sm mb-2 line-clamp-2">{comment.content}</p>
                      <div className="flex items-center text-xs text-slate-500">
                        <Clock className="w-3 h-3 mr-1" />
                        <span>{formatDate(comment.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center py-12 text-slate-500">No comments to display yet.</div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
