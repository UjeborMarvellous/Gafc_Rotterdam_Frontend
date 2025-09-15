import apiClient from './client';
import { Organizer, OrganizerForm, ApiResponse } from '../types';

export const organizersApi = {
  // Get organizers
  getOrganizers: async (params?: {
    active?: boolean;
  }): Promise<ApiResponse<{ organizers: Organizer[] }>> => {
    const queryParams = new URLSearchParams();
    if (params?.active !== undefined) queryParams.append('active', params.active.toString());
    
    return apiClient.get(`/organizers?${queryParams.toString()}`);
  },

  // Create organizer (admin)
  createOrganizer: async (organizerData: OrganizerForm): Promise<ApiResponse<{ organizer: Organizer }>> => {
    return apiClient.post('/organizers', organizerData);
  },

  // Update organizer (admin)
  updateOrganizer: async (id: string, organizerData: Partial<OrganizerForm>): Promise<ApiResponse<{ organizer: Organizer }>> => {
    return apiClient.put(`/organizers/${id}`, organizerData);
  },

  // Delete organizer (admin)
  deleteOrganizer: async (id: string): Promise<ApiResponse> => {
    return apiClient.delete(`/organizers/${id}`);
  },
};
