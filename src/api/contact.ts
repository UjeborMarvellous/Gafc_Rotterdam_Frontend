import apiClient from './client';
import {
  ApiResponse,
  ContactMessage,
  ContactMessageForm,
  PaginationData
} from '../types';

export const contactApi = {
  submitMessage: async (
    payload: ContactMessageForm
  ): Promise<ApiResponse<{ contactMessage: ContactMessage }>> => {
    return apiClient.post('/contact', payload);
  },

  getMessages: async (
    params: { page?: number; limit?: number; status?: 'new' | 'in_review' | 'resolved' } = {}
  ): Promise<ApiResponse<{ messages: ContactMessage[]; pagination: PaginationData }>> => {
    const queryParams = new URLSearchParams();

    if (params.page) {
      queryParams.set('page', String(params.page));
    }
    if (params.limit) {
      queryParams.set('limit', String(params.limit));
    }
    if (params.status) {
      queryParams.set('status', params.status);
    }

    const queryString = queryParams.toString();
    const url = queryString ? `/contact?${queryString}` : '/contact';

    return apiClient.get(url);
  },
};

export default contactApi;
