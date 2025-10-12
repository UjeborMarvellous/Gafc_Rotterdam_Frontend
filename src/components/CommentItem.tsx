import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Reply, Clock } from 'lucide-react';
import { Comment as CommentType, CommentForm } from '../types';
import { useCommentsStore } from '../stores/commentsStore';
import toast from 'react-hot-toast';

interface CommentItemProps {
  comment: CommentType;
  onReply?: (parentId: string) => void;
  depth?: number;
  maxDepth?: number;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onReply,
  depth = 0,
  maxDepth = 3,
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState<CommentType[]>([]);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [replyData, setReplyData] = useState({ authorName: '', authorEmail: '', content: '' });
  const [submitting, setSubmitting] = useState(false);

  const { fetchReplies, createComment } = useCommentsStore();

  const handleLoadReplies = async () => {
    if (replies.length > 0) {
      setShowReplies(!showReplies);
      return;
    }

    setLoadingReplies(true);
    try {
      const fetchedReplies: CommentType[] = await fetchReplies(comment._id);
      setReplies(fetchedReplies);
      setShowReplies(true);
    } catch (error) {
      toast.error('Failed to load replies');
    } finally {
      setLoadingReplies(false);
    }
  };

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!replyData.authorName || !replyData.authorEmail || !replyData.content) {
      toast.error('Please fill in all fields');
      return;
    }

    setSubmitting(true);
    try {
      const commentFormData: CommentForm = {
        ...replyData,
        parentId: comment._id,
      };

      await createComment(commentFormData);
      toast.success('Reply submitted! It will appear after admin approval.');
      setReplyData({ authorName: '', authorEmail: '', content: '' });
      setShowReplyForm(false);

      // Reload replies to include the new one (when approved)
      const updatedReplies: CommentType[] = await fetchReplies(comment._id);
      setReplies(updatedReplies);
    } catch (error) {
      toast.error('Failed to submit reply');
    } finally {
      setSubmitting(false);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const canReply = depth < maxDepth;
  const indentClass = depth > 0 ? 'ml-4 sm:ml-8 md:ml-12' : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`${indentClass} mb-4 sm:mb-6`}
    >
      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-300">
        {/* Comment Header */}
        <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
          {/* Avatar */}
          <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base">
            {comment.authorName.charAt(0).toUpperCase()}
          </div>

          {/* Author & Date */}
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-slate-900 text-sm sm:text-base truncate">
              {comment.authorName}
            </h4>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 mt-0.5">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>{formatDate(comment.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Comment Content */}
        <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-3 sm:mb-4 whitespace-pre-wrap break-words">
          {comment.content}
        </p>

        {/* Comment Actions */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          {canReply && (
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              <Reply className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Reply</span>
            </button>
          )}

          {comment.replyCount && comment.replyCount > 0 && (
            <button
              onClick={handleLoadReplies}
              disabled={loadingReplies}
              className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>
                {loadingReplies ? 'Loading...' : `${comment.replyCount} ${comment.replyCount === 1 ? 'Reply' : 'Replies'}`}
              </span>
            </button>
          )}
        </div>

        {/* Reply Form */}
        <AnimatePresence>
          {showReplyForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 sm:mt-6 overflow-hidden"
            >
              <form onSubmit={handleSubmitReply} className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={replyData.authorName}
                    onChange={(e) => setReplyData({ ...replyData, authorName: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    value={replyData.authorEmail}
                    onChange={(e) => setReplyData({ ...replyData, authorEmail: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    required
                  />
                </div>

                <textarea
                  placeholder="Write your reply..."
                  value={replyData.content}
                  onChange={(e) => setReplyData({ ...replyData, content: e.target.value })}
                  rows={3}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                  required
                />

                <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
                  <button
                    type="button"
                    onClick={() => setShowReplyForm(false)}
                    className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base font-medium text-slate-600 hover:text-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Submitting...' : 'Submit Reply'}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nested Replies */}
      <AnimatePresence>
        {showReplies && replies.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4"
          >
            {replies.map((reply) => (
              <CommentItem
                key={reply._id}
                comment={reply}
                depth={depth + 1}
                maxDepth={maxDepth}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CommentItem;
