import { create } from 'zustand';
import { RegistrationsState } from '../types';
import { registrationsApi } from '../api/registrations';
import { getErrorMessage } from '../utils';

interface RegistrationsStore extends RegistrationsState {
  fetchRegistrations: (params?: { page?: number; limit?: number; eventId?: string; status?: string }) => Promise<void>;
  clearError: () => void;
}

export const useRegistrationsStore = create<RegistrationsStore>((set, get) => ({
  registrations: [],
  isLoading: false,
  error: null,
  pagination: null,

  fetchRegistrations: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await registrationsApi.getRegistrations(params);
      
      if (response.success && response.data) {
        set({
          registrations: response.data.registrations,
          pagination: response.data.pagination,
          isLoading: false,
        });
      } else {
        throw new Error(response.message || 'Failed to fetch registrations');
      }
    } catch (error) {
      set({
        isLoading: false,
        error: getErrorMessage(error),
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
