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

  const handleReply = (commentId: string) => {
    setReplyingTo(commentId);
    setValue('parentId', commentId);
  };


  const toggleReplies = (commentId: string) => {
    const newExpanded = new Set(expandedReplies);
    if (newExpanded.has(commentId)) {
      newExpanded.delete(commentId);
    } else {
      newExpanded.add(commentId);
    }
    setExpandedReplies(newExpanded);
  };

  const renderComment = (comment: Comment, isReply = false) => (
    <div key={comment._id} className={`bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300 ${isReply ? 'ml-8 border-l-2 border-l-blue-200' : ''}`}>
      <div className="flex items-start space-x-4">
        {/* Avatar */}
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm">
            {comment.authorName.split(' ').map(n => n[0]).join('').toUpperCase()}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <h4 className="font-semibold text-slate-900">{comment.authorName}</h4>
              <span className="text-slate-500 text-sm">
                {formatRelativeTime(comment.createdAt)}
              </span>
            </div>
          </div>

          {/* Comment Text */}
          <p className="text-slate-700 leading-relaxed mb-4">{comment.content}</p>

          {/* Interactions */}
          <div className="flex items-center">
            {!isReply && (
              <button
                onClick={() => handleReply(comment._id)}
                className="text-slate-600 hover:text-blue-500 transition-colors text-sm font-medium"
              >
                Reply
              </button>
            )}
          </div>

          {/* Replies */}
          {!isReply && expandedReplies.has(comment._id) && comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 space-y-4">
              {comment.replies.map((reply) => renderComment(reply, true))}
            </div>
          )}
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
    <div className="max-w-7xl mx-auto">
      {/* Search Bar */}
      <div className="mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search comments and discussions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Statistics and Comment Form */}
        <div className="lg:col-span-1 space-y-6">
          {/* Statistics Card */}
          <div className="bg-blue-50 rounded-xl p-6 text-center">
            <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-slate-900">{totalMessages}</div>
            <div className="text-sm text-slate-600">Total Messages</div>
          </div>

          {/* Comment Form */}
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center space-x-2 mb-4">
              <MessageCircle className="h-5 w-5 text-slate-600" />
              <h3 className="font-semibold text-slate-900">Share Your Thoughts</h3>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  What's on your mind?
                </label>
                <textarea
                  {...register('content')}
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Share your thoughts..."
                />
                {errors.content && (
                  <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 font-semibold rounded-lg flex items-center justify-center space-x-2"
              >
                <Send className="h-4 w-4" />
                <span>{isSubmitting ? 'Posting...' : 'Post Comment'}</span>
              </Button>
            </form>
          </div>
        </div>

        {/* Right Column - Comments */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-900">Recent Discussions</h2>
            <span className="text-sm text-slate-600">
              {searchTerm ? `${filteredComments.length} of ${comments.length}` : `${comments.length}`} comments
            </span>
          </div>

          <div className={`space-y-4 ${filteredComments.length > 4 ? 'h-[70dvh] overflow-y-auto pr-2' : ''}`}>
            {filteredComments.length > 0 ? (
              filteredComments.map((comment) => renderComment(comment))
            ) : searchTerm ? (
              <div className="bg-white rounded-xl p-12 text-center border border-slate-200">
                <Search className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  No results found
                </h3>
                <p className="text-slate-600">
                  Try searching with different keywords or browse all comments.
                </p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear search
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-xl p-12 text-center border border-slate-200">
                <MessageCircle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  No comments yet
                </h3>
                <p className="text-slate-600">
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
