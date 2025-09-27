import { create } from 'zustand';
import { ContactMessagesState } from '../types';
import { contactApi } from '../api/contact';
import { getErrorMessage } from '../utils';

interface ContactMessagesStore extends ContactMessagesState {
  fetchMessages: (params?: { page?: number; limit?: number; status?: 'new' | 'in_review' | 'resolved' }) => Promise<void>;
  clearError: () => void;
}

export const useContactMessagesStore = create<ContactMessagesStore>((set) => ({
  messages: [],
  isLoading: false,
  error: null,
  pagination: null,

  fetchMessages: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await contactApi.getMessages(params);

      if (response.success && response.data) {
        set({
          messages: response.data.messages,
          pagination: response.data.pagination,
          isLoading: false,
        });
      } else {
        throw new Error(response.message || 'Failed to fetch messages');
      }
    } catch (error) {
      set({
        isLoading: false,
        error: getErrorMessage(error),
      });
    }
  },

  clearError: () => set({ error: null }),
}));
