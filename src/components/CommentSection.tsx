import React, { useState } from 'react';
import { Comment, CommentForm } from '../types';
import { useCommentsStore } from '../stores/commentsStore';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { formatDate } from '../utils';
import Button from './ui/Button';
import Input from './ui/Input';
import LoadingSpinner from './ui/LoadingSpinner';
import toast from 'react-hot-toast';

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
  const [showForm, setShowForm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CommentForm>({
    resolver: zodResolver(commentSchema),
  });

  const onSubmit = async (data: CommentForm) => {
    try {
      await createComment(data);
      toast.success('Comment submitted successfully! It will be reviewed before being published.');
      reset();
      setShowForm(false);
    } catch (error) {
      toast.error('Failed to submit comment. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Comments List */}
      {comments.length > 0 ? (
        <div className="space-y-6 mb-12">
          {comments.map((comment) => (
            <div key={comment._id} className="card">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-semibold text-sm">
                    {comment.authorName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-semibold text-gray-900">{comment.authorName}</h4>
                    <span className="text-gray-500 text-sm">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{comment.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 mb-12">
          <p className="text-gray-500 text-lg">No comments yet. Be the first to share your thoughts!</p>
        </div>
      )}

      {/* Comment Form */}
      <div className="card">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Leave a Comment</h3>
        
        {!showForm ? (
          <Button onClick={() => setShowForm(true)}>
            Write a Comment
          </Button>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Your Name"
                  error={errors.authorName?.message}
                  required
                  {...register('authorName')}
                />
              <Input
                label="Your Email"
                type="email"
                error={errors.authorEmail?.message}
                required
                {...register('authorEmail')}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Comment
                <span className="text-red-500 ml-1">*</span>
              </label>
              <textarea
                {...register('content')}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Share your thoughts about our community..."
              />
              {errors.content && (
                <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
              )}
            </div>

            <div className="flex space-x-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center space-x-2"
              >
                {isSubmitting && <LoadingSpinner size="sm" />}
                <span>{isSubmitting ? 'Submitting...' : 'Submit Comment'}</span>
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setShowForm(false);
                  reset();
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
