import React from 'react';
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
  ArrowRight
} from 'lucide-react';

const AdminDashboardPage: React.FC = () => {
  // Mock data - replace with actual data from your stores
  const stats = [
    {
      title: 'Total Events',
      value: '24',
      change: '+12%',
      changeType: 'positive',
      icon: Calendar,
      color: 'blue'
    },
    {
      title: 'Active Organizers',
      value: '8',
      change: '+2',
      changeType: 'positive',
      icon: Users,
      color: 'green'
    },
    {
      title: 'Gallery Images',
      value: '156',
      change: '+23',
      changeType: 'positive',
      icon: Image,
      color: 'purple'
    },
    {
      title: 'Comments',
      value: '89',
      change: '+15%',
      changeType: 'positive',
      icon: MessageSquare,
      color: 'orange'
    }
  ];

  const recentEvents = [
    {
      _id: '1',
      title: 'Community Meetup 2025',
      date: '2025-02-15',
      participants: 45,
      maxParticipants: 100,
      status: 'active'
    },
    {
      _id: '2',
      title: 'Tech Workshop Series',
      date: '2025-02-20',
      participants: 23,
      maxParticipants: 50,
      status: 'active'
    },
    {
      _id: '3',
      title: 'Networking Event',
      date: '2025-02-10',
      participants: 78,
      maxParticipants: 80,
      status: 'completed'
    }
  ];

  const recentComments = [
    {
      _id: '1',
      author: 'John Doe',
      content: 'Amazing event! Looking forward to the next one.',
      event: 'Community Meetup 2025',
      createdAt: '2025-01-15T10:30:00Z'
    },
    {
      _id: '2',
      author: 'Jane Smith',
      content: 'Great workshop, learned a lot about React!',
      event: 'Tech Workshop Series',
      createdAt: '2025-01-14T15:45:00Z'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      purple: 'from-purple-500 to-purple-600',
      orange: 'from-orange-500 to-orange-600'
    };
    return colors[color as keyof typeof colors] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-1">Welcome back! Here's what's happening with your community.</p>
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
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${getColorClasses(stat.color)} rounded-xl flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className={`text-sm font-semibold ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</h3>
                <p className="text-slate-600 text-sm">{stat.title}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Events */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Recent Events</h2>
              <Link
                to="/admin/events"
                className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                <span>View All</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentEvents.map((event) => (
                <div key={event._id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors duration-200">
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 mb-1">{event.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-slate-600">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        <span>{event.participants}/{event.maxParticipants}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      event.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {event.status === 'active' ? 'Active' : 'Completed'}
                    </span>
                    <div className="w-24 bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${(event.participants / event.maxParticipants) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
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
          <div className="p-6">
            <div className="space-y-4">
              {recentComments.map((comment) => (
                <div key={comment._id} className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors duration-200">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-semibold">
                        {comment.author.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold text-slate-900 text-sm">{comment.author}</h4>
                        <span className="text-xs text-slate-500">•</span>
                        <span className="text-xs text-slate-500">{comment.event}</span>
                      </div>
                      <p className="text-slate-600 text-sm mb-2 line-clamp-2">{comment.content}</p>
                      <div className="flex items-center text-xs text-slate-500">
                        <Clock className="w-3 h-3 mr-1" />
                        <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
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