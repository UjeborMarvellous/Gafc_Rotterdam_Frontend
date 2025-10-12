import { create } from 'zustand';
import { OrganizersState, OrganizerForm } from '../types';
import { organizersApi } from '../api/organizers';
import { getErrorMessage } from '../utils';

// Helper function to map backend response (id) to frontend format (_id)
const mapOrganizerResponse = (organizer: any) => ({
  ...organizer,
  _id: organizer.id || organizer._id,
});

interface OrganizersStore extends OrganizersState {
  fetchOrganizers: (params?: { active?: boolean }) => Promise<void>;
  createOrganizer: (organizerData: OrganizerForm) => Promise<void>;
  updateOrganizer: (id: string, organizerData: Partial<OrganizerForm>) => Promise<void>;
  deleteOrganizer: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useOrganizersStore = create<OrganizersStore>((set, get) => ({
  organizers: [],
  isLoading: false,
  error: null,

  fetchOrganizers: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await organizersApi.getOrganizers(params);

      if (response.success && response.data) {
        set({
          organizers: response.data.organizers.map(mapOrganizerResponse),
          isLoading: false,
        });
      } else {
        throw new Error(response.message || 'Failed to fetch organizers');
      }
    } catch (error) {
      set({
        isLoading: false,
        error: getErrorMessage(error),
      });
    }
  },

  createOrganizer: async (organizerData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await organizersApi.createOrganizer(organizerData);

      if (response.success && response.data) {
        const newOrganizer = mapOrganizerResponse(response.data.organizer);
        set((state) => ({
          organizers: [newOrganizer, ...state.organizers],
          isLoading: false,
        }));
      } else {
        throw new Error(response.message || 'Failed to create organizer');
      }
    } catch (error) {
      set({
        isLoading: false,
        error: getErrorMessage(error),
      });
      throw error;
    }
  },

  updateOrganizer: async (id: string, organizerData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await organizersApi.updateOrganizer(id, organizerData);

      if (response.success && response.data) {
        const updatedOrganizer = mapOrganizerResponse(response.data.organizer);
        set((state) => ({
          organizers: state.organizers.map((organizer) =>
            organizer._id === id ? updatedOrganizer : organizer
          ),
          isLoading: false,
        }));
      } else {
        throw new Error(response.message || 'Failed to update organizer');
      }
    } catch (error) {
      set({
        isLoading: false,
        error: getErrorMessage(error),
      });
      throw error;
    }
  },

  deleteOrganizer: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await organizersApi.deleteOrganizer(id);
      
      if (response.success) {
        set((state) => ({
          organizers: state.organizers.filter((organizer) => organizer._id !== id),
          isLoading: false,
        }));
      } else {
        throw new Error(response.message || 'Failed to delete organizer');
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
