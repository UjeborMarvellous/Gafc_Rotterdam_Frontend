import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send } from 'lucide-react';
import { useCommentsStore } from '../stores/commentsStore';
import { CommentForm } from '../types';
import CommentItem from './CommentItem';
import LoadingSpinner from './ui/LoadingSpinner';
import toast from 'react-hot-toast';

interface CommentListProps {
  eventId?: string;
  title?: string;
}

const CommentList: React.FC<CommentListProps> = ({ eventId, title = 'Comments' }) => {
  const { comments, isLoading, fetchComments, createComment } = useCommentsStore();
  const [formData, setFormData] = useState({ authorName: '', authorEmail: '', content: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchComments({
      // TEMPORARY FIX: Removed approved filter until Firestore composite index is created
      // approved: true,
      eventId,
      parentId: null, // Only fetch top-level comments
      limit: 50,
    });
  }, [fetchComments, eventId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.authorName || !formData.authorEmail || !formData.content) {
      toast.error('Please fill in all fields');
      return;
    }

    setSubmitting(true);
    try {
      const commentData: CommentForm = {
        ...formData,
        ...(eventId && { eventId }),
      };

      await createComment(commentData);
      toast.success('Comment submitted! It will appear after admin approval.');
      setFormData({ authorName: '', authorEmail: '', content: '' });

      // Refresh comments
      fetchComments({
        // TEMPORARY FIX: Removed approved filter until Firestore composite index is created
        // approved: true,
        eventId,
        parentId: null,
        limit: 50,
      });
    } catch (error) {
      toast.error('Failed to submit comment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8 sm:mb-12"
      >
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">
            {title}
          </h2>
        </div>
        <p className="text-sm sm:text-base md:text-lg text-slate-600">
          Share your thoughts and join the conversation
        </p>
      </motion.div>

      {/* Comment Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-8 sm:mb-12"
      >
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-lg border border-slate-200">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 sm:mb-6">
            Leave a Comment
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Your Name"
                  value={formData.authorName}
                  onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.authorEmail}
                  onChange={(e) => setFormData({ ...formData, authorEmail: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-slate-700 mb-2">
                Comment <span className="text-red-500">*</span>
              </label>
              <textarea
                id="comment"
                placeholder="Share your thoughts..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={4}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                required
              />
            </div>

            <div className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm text-slate-500">
              <span className="text-blue-600 font-medium">ℹ️</span>
              <p>Your comment will be reviewed by an admin before being published.</p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Submit Comment</span>
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>

      {/* Comments List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : comments.length > 0 ? (
          <div className="space-y-4 sm:space-y-6">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 sm:mb-6">
              {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
            </h3>
            {comments.map((comment) => (
              <CommentItem key={comment._id} comment={comment} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 sm:py-16">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 sm:w-10 sm:h-10 text-slate-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2">
              No comments yet
            </h3>
            <p className="text-sm sm:text-base text-slate-600">
              Be the first to share your thoughts!
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default CommentList;
