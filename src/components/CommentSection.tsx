import React, { useState } from 'react';
import { Comment, CommentForm } from '../types';
import { useCommentsStore } from '../stores/commentsStore';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { formatRelativeTime } from '../utils';
import Button from './ui/Button';
import Input from './ui/Input';
import LoadingSpinner from './ui/LoadingSpinner';
import toast from 'react-hot-toast';
import { 
  MessageCircle, Reply, Search, Users, Send
} from 'lucide-react';

interface CommentSectionProps {
  comments: Comment[];
  isLoading: boolean;
}

const commentSchema = z.object({
  content: z.string().min(1, 'Comment is required').max(500, 'Comment is too long'),
  authorName: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  authorEmail: z.string().email('Please enter a valid email'),
});

const CommentSection: React.FC<CommentSectionProps> = ({ comments, isLoading }) => {
  const { createComment, isLoading: isSubmitting } = useCommentsStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CommentForm>({
    resolver: zodResolver(commentSchema),
  });

  const onSubmit = async (data: CommentForm) => {
    try {
      await createComment(data);
      toast.success('Comment submitted successfully! It will be reviewed before being published.');
      reset();
      setReplyingTo(null);
    } catch (error) {
      toast.error('Failed to submit comment. Please try again.');
    }
  };

  // Reply functionality removed from frontend

  const renderComment = (comment: Comment, isReply = false) => (
    <div key={comment._id} className={`bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300 ${isReply ? 'ml-4 sm:ml-8 border-l-2 border-l-blue-200' : ''}`}>
      <div className="flex items-start space-x-3 sm:space-x-4">
        {/* Avatar */}
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-xs sm:text-sm">
            {comment.authorName.split(' ').map(n => n[0]).join('').toUpperCase()}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-1">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
              <h4 className="text-sm sm:text-base font-semibold text-slate-900">{comment.authorName}</h4>
              <span className="text-slate-500 text-xs sm:text-sm">
                {formatRelativeTime(comment.createdAt)}
              </span>
            </div>
          </div>

          {/* Comment Text */}
          <p className="text-slate-700 text-sm sm:text-base leading-relaxed">{comment.content}</p>

          {/* Interactions removed - no reply functionality on frontend */}
        </div>
      </div>
    </div>
  );

  // Filter comments based on search term
  const filteredComments = comments.filter((comment) => {
    if (!searchTerm.trim()) return true;

    const searchLower = searchTerm.toLowerCase();
    const contentMatch = comment.content.toLowerCase().includes(searchLower);
    const authorMatch = comment.authorName.toLowerCase().includes(searchLower);

    return contentMatch || authorMatch;
  });

  // Calculate statistics
  const totalMessages = comments.length;

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Search Bar */}
      <div className="mb-6 sm:mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search comments and discussions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 sm:py-3 text-sm sm:text-base border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Left Column - Statistics and Comment Form */}
        <div className="lg:col-span-1 space-y-4 sm:space-y-6 order-2 lg:order-1">
          {/* Statistics Card */}
          <div className="bg-blue-50 rounded-xl p-4 sm:p-6 text-center">
            <Users className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500 mx-auto mb-2" />
            <div className="text-xl sm:text-2xl font-bold text-slate-900">{totalMessages}</div>
            <div className="text-xs sm:text-sm text-slate-600">Total Messages</div>
          </div>

          {/* Comment Form */}
          <div className="bg-white rounded-xl p-4 sm:p-6 border border-slate-200">
            <div className="flex items-center space-x-2 mb-3 sm:mb-4">
              <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 text-slate-600" />
              <h3 className="text-sm sm:text-base font-semibold text-slate-900">Share Your Thoughts</h3>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
              <Input
                label="Your name"
                error={errors.authorName?.message}
                required
                {...register('authorName')}
              />

              <Input
                label="Your email"
                type="email"
                error={errors.authorEmail?.message}
                required
                {...register('authorEmail')}
              />

              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">
                  What's on your mind?
                </label>
                <textarea
                  {...register('content')}
                  rows={3}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Share your thoughts..."
                />
                {errors.content && (
                  <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.content.message}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-brand-green-600 hover:bg-brand-green-700 text-white py-2 sm:py-3 text-sm sm:text-base font-semibold rounded-lg flex items-center justify-center space-x-2"
              >
                <Send className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>{isSubmitting ? 'Posting...' : 'Post Comment'}</span>
              </Button>
            </form>
          </div>
        </div>

        {/* Right Column - Comments */}
        <div className="lg:col-span-2 order-1 lg:order-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-2">
            <h2 className="text-lg sm:text-xl font-semibold text-slate-900">Recent Discussions</h2>
            <span className="text-xs sm:text-sm text-slate-600">
              {searchTerm ? `${filteredComments.length} of ${comments.length}` : `${comments.length}`} comments
            </span>
          </div>

          <div className={`space-y-3 sm:space-y-4 ${filteredComments.length > 4 ? 'h-[60dvh] sm:h-[70dvh] overflow-y-auto pr-1 sm:pr-2' : ''}`}>
            {filteredComments.length > 0 ? (
              filteredComments.map((comment) => renderComment(comment))
            ) : searchTerm ? (
              <div className="bg-white rounded-xl p-8 sm:p-12 text-center border border-slate-200">
                <Search className="h-8 w-8 sm:h-12 sm:w-12 text-slate-400 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">
                  No results found
                </h3>
                <p className="text-sm sm:text-base text-slate-600">
                  Try searching with different keywords or browse all comments.
                </p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="mt-3 sm:mt-4 text-brand-green-600 hover:text-brand-green-700 font-medium text-sm sm:text-base"
                >
                  Clear search
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-xl p-8 sm:p-12 text-center border border-slate-200">
                <MessageCircle className="h-8 w-8 sm:h-12 sm:w-12 text-slate-400 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">
                  No comments yet
                </h3>
                <p className="text-sm sm:text-base text-slate-600">
                  Be the first to share your thoughts about our community!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentSection;
