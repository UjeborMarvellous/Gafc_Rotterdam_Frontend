import apiClient from './client';
import { EventRegistration, RegistrationForm, ApiResponse, PaginationData } from '../types';

export const registrationsApi = {
  // Create registration
  createRegistration: async (registrationData: RegistrationForm): Promise<ApiResponse<{ registration: EventRegistration }>> => {
    return apiClient.post('/registrations', registrationData);
  },

  // Get registrations (admin)
  getRegistrations: async (params?: {
    page?: number;
    limit?: number;
    eventId?: string;
    status?: string;
  }): Promise<ApiResponse<{ registrations: EventRegistration[]; pagination: PaginationData }>> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.eventId) queryParams.append('eventId', params.eventId);
    if (params?.status) queryParams.append('status', params.status);
    
    return apiClient.get(`/registrations?${queryParams.toString()}`);
  },

  // Get registration by ID (admin)
  getRegistrationById: async (id: string): Promise<ApiResponse<{ registration: EventRegistration }>> => {
    return apiClient.get(`/registrations/${id}`);
  },
};
