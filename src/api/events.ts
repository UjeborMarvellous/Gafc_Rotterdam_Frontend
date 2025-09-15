import apiClient from './client';
import { Event, EventForm, ApiResponse, PaginationData } from '../types';

export const eventsApi = {
  // Get all events
  getEvents: async (params?: {
    page?: number;
    limit?: number;
    active?: boolean;
  }): Promise<ApiResponse<{ events: Event[]; pagination: PaginationData }>> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.active !== undefined) queryParams.append('active', params.active.toString());
    
    return apiClient.get(`/events?${queryParams.toString()}`);
  },

  // Get event by ID
  getEventById: async (id: string): Promise<ApiResponse<{ event: Event }>> => {
    return apiClient.get(`/events/${id}`);
  },

  // Create event (admin)
  createEvent: async (eventData: EventForm): Promise<ApiResponse<{ event: Event }>> => {
    return apiClient.post('/events', eventData);
  },

  // Update event (admin)
  updateEvent: async (id: string, eventData: Partial<EventForm>): Promise<ApiResponse<{ event: Event }>> => {
    return apiClient.put(`/events/${id}`, eventData);
  },

  // Delete event (admin)
  deleteEvent: async (id: string): Promise<ApiResponse> => {
    return apiClient.delete(`/events/${id}`);
  },
};
