import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useCommentsStore } from '../../stores/commentsStore';
import { CheckIcon, XMarkIcon, TrashIcon } from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Modal from '../../components/ui/Modal';
import { formatDate } from '../../utils';
import toast from 'react-hot-toast';

const AdminCommentsPage: React.FC = () => {
  const { comments, fetchComments, updateComment, deleteComment, isLoading } = useCommentsStore();
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const [deletingComment, setDeletingComment] = useState<string | null>(null);

  useEffect(() => {
    fetchComments({ limit: 50 });
  }, [fetchComments]);

  const filteredComments = comments.filter(comment => {
    if (filter === 'pending') return !comment.isApproved;
    if (filter === 'approved') return comment.isApproved;
    return true;
  });

  const handleApprove = async (commentId: string) => {
    try {
      await updateComment(commentId, { isApproved: true });
      toast.success('Comment approved');
    } catch (error) {
      toast.error('Failed to approve comment');
    }
  };

  const handleReject = async (commentId: string) => {
    try {
      await updateComment(commentId, { isApproved: false });
      toast.success('Comment rejected');
    } catch (error) {
      toast.error('Failed to reject comment');
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      await deleteComment(commentId);
      toast.success('Comment deleted');
      setDeletingComment(null);
    } catch (error) {
      toast.error('Failed to delete comment');
    }
  };

  const pendingCount = comments.filter(comment => !comment.isApproved).length;

  return (
    <>
      <Helmet>
        <title>Comments Management - Admin Panel</title>
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Comments Management</h1>
            <p className="mt-1 text-sm text-gray-500">
              Moderate community comments and feedback
            </p>
          </div>
          {pendingCount > 0 && (
            <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
              {pendingCount} pending
            </div>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { key: 'all', label: 'All Comments', count: comments.length },
              { key: 'pending', label: 'Pending', count: comments.filter(c => !c.isApproved).length },
              { key: 'approved', label: 'Approved', count: comments.filter(c => c.isApproved).length },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  filter === tab.key
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Comments List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : filteredComments.length > 0 ? (
          <div className="space-y-4">
            {filteredComments.map((comment) => (
              <div key={comment._id} className="bg-white shadow rounded-lg p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 font-semibold text-sm">
                          {comment.authorName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          {comment.authorName}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {comment.authorEmail} • {formatDate(comment.createdAt)}
                        </p>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mt-3 leading-relaxed">
                      {comment.content}
                    </p>

                    <div className="flex items-center space-x-2 mt-4">
                      {comment.isApproved ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckIcon className="w-3 h-3 mr-1" />
                          Approved
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <XMarkIcon className="w-3 h-3 mr-1" />
                          Pending
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    {!comment.isApproved && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleApprove(comment._id)}
                        className="text-green-600 hover:text-green-700"
                      >
                        <CheckIcon className="h-4 w-4" />
                      </Button>
                    )}
                    {comment.isApproved && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReject(comment._id)}
                        className="text-yellow-600 hover:text-yellow-700"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeletingComment(comment._id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">💬</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No comments found
            </h3>
            <p className="text-gray-500">
              {filter === 'all' 
                ? 'No comments have been submitted yet.'
                : `No ${filter} comments found.`}
            </p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingComment}
        onClose={() => setDeletingComment(null)}
        title="Delete Comment"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete this comment? This action cannot be undone.
          </p>
          <div className="flex space-x-4">
            <Button
              onClick={() => deletingComment && handleDelete(deletingComment)}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              Delete
            </Button>
            <Button
              variant="secondary"
              onClick={() => setDeletingComment(null)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AdminCommentsPage;
