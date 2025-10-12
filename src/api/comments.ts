import apiClient from './client';
import { Comment, CommentForm, ApiResponse, PaginationData } from '../types';

export const commentsApi = {
  // Get comments
  getComments: async (params?: {
    page?: number;
    limit?: number;
    approved?: boolean;
    eventId?: string;
    parentId?: string | null;
  }): Promise<ApiResponse<{ comments: Comment[]; pagination: PaginationData }>> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.approved !== undefined) queryParams.append('approved', params.approved.toString());
    if (params?.eventId) queryParams.append('eventId', params.eventId);
    if (params?.parentId !== undefined) {
      queryParams.append('parentId', params.parentId === null ? 'null' : params.parentId);
    }

    return apiClient.get(`/comments?${queryParams.toString()}`);
  },

  // Get replies for a specific comment
  getReplies: async (parentId: string): Promise<ApiResponse<{ comments: Comment[]; pagination: PaginationData }>> => {
    return apiClient.get(`/comments?parentId=${parentId}&approved=true`);
  },

  // Create comment or reply
  createComment: async (commentData: CommentForm): Promise<ApiResponse<{ comment: Comment }>> => {
    return apiClient.post('/comments', commentData);
  },

  // Update comment (admin)
  updateComment: async (id: string, data: { isApproved: boolean }): Promise<ApiResponse<{ comment: Comment }>> => {
    return apiClient.put(`/comments/${id}`, data);
  },

  // Delete comment (admin)
  deleteComment: async (id: string): Promise<ApiResponse> => {
    return apiClient.delete(`/comments/${id}`);
  },
};
