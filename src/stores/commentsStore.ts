import { create } from 'zustand';
import { CommentsState, CommentForm } from '../types';
import { commentsApi } from '../api/comments';
import { getErrorMessage } from '../utils';

interface CommentsStore extends CommentsState {
  fetchComments: (params?: { page?: number; limit?: number; approved?: boolean }) => Promise<void>;
  createComment: (commentData: CommentForm) => Promise<void>;
  updateComment: (id: string, data: { isApproved: boolean }) => Promise<void>;
  deleteComment: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useCommentsStore = create<CommentsStore>((set, get) => ({
  comments: [],
  isLoading: false,
  error: null,
  pagination: null,

  fetchComments: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await commentsApi.getComments(params);
      
      if (response.success && response.data) {
        set({
          comments: response.data.comments,
          pagination: response.data.pagination,
          isLoading: false,
        });
      } else {
        throw new Error(response.message || 'Failed to fetch comments');
      }
    } catch (error) {
      set({
        isLoading: false,
        error: getErrorMessage(error),
      });
    }
  },

  createComment: async (commentData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await commentsApi.createComment(commentData);
      
      if (response.success && response.data) {
        set({ isLoading: false });
      } else {
        throw new Error(response.message || 'Failed to create comment');
      }
    } catch (error) {
      set({
        isLoading: false,
        error: getErrorMessage(error),
      });
      throw error;
    }
  },

  updateComment: async (id: string, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await commentsApi.updateComment(id, data);
      
      if (response.success && response.data) {
        const updatedComment = response.data.comment;
        set((state) => ({
          comments: state.comments.map((comment) =>
            comment._id === id ? updatedComment : comment
          ),
          isLoading: false,
        }));
      } else {
        throw new Error(response.message || 'Failed to update comment');
      }
    } catch (error) {
      set({
        isLoading: false,
        error: getErrorMessage(error),
      });
      throw error;
    }
  },

  deleteComment: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await commentsApi.deleteComment(id);
      
      if (response.success) {
        set((state) => ({
          comments: state.comments.filter((comment) => comment._id !== id),
          isLoading: false,
        }));
      } else {
        throw new Error(response.message || 'Failed to delete comment');
      }
    } catch (error) {
      set({
        isLoading: false,
        error: getErrorMessage(error),
      });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
