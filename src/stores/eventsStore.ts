import { create } from 'zustand';
import { Event, EventsState, EventForm } from '../types';
import { eventsApi } from '../api/events';
import { getErrorMessage } from '../utils';

// Helper function to map backend response (id) to frontend format (_id)
const mapEventResponse = (event: any): Event => ({
  ...event,
  _id: event.id || event._id,
});

interface EventsStore extends EventsState {
  fetchEvents: (params?: { page?: number; limit?: number; active?: boolean }) => Promise<void>;
  fetchEventById: (id: string) => Promise<void>;
  createEvent: (eventData: EventForm) => Promise<void>;
  updateEvent: (id: string, eventData: Partial<EventForm>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  clearError: () => void;
  setCurrentEvent: (event: Event | null) => void;
}

export const useEventsStore = create<EventsStore>((set, get) => ({
  events: [],
  currentEvent: null,
  isLoading: false,
  error: null,
  pagination: null,

  fetchEvents: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await eventsApi.getEvents(params);

      if (response.success && response.data) {
        set({
          events: response.data.events.map(mapEventResponse),
          pagination: response.data.pagination,
          isLoading: false,
        });
      } else {
        throw new Error(response.message || 'Failed to fetch events');
      }
    } catch (error) {
      set({
        isLoading: false,
        error: getErrorMessage(error),
      });
    }
  },

  fetchEventById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await eventsApi.getEventById(id);

      if (response.success && response.data) {
        set({
          currentEvent: mapEventResponse(response.data.event),
          isLoading: false,
        });
      } else {
        throw new Error(response.message || 'Failed to fetch event');
      }
    } catch (error) {
      set({
        isLoading: false,
        error: getErrorMessage(error),
      });
    }
  },

  createEvent: async (eventData: EventForm) => {
    set({ isLoading: true, error: null });
    try {
      const response = await eventsApi.createEvent(eventData);

      if (response.success && response.data) {
        const newEvent = mapEventResponse(response.data.event);
        set((state) => ({
          events: [newEvent, ...state.events],
          isLoading: false,
        }));
      } else {
        throw new Error(response.message || 'Failed to create event');
      }
    } catch (error) {
      set({
        isLoading: false,
        error: getErrorMessage(error),
      });
      throw error;
    }
  },

  updateEvent: async (id: string, eventData: Partial<EventForm>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await eventsApi.updateEvent(id, eventData);

      if (response.success && response.data) {
        const updatedEvent = mapEventResponse(response.data.event);
        set((state) => ({
          events: state.events.map((event) =>
            event._id === id ? updatedEvent : event
          ),
          currentEvent: state.currentEvent?._id === id ? updatedEvent : state.currentEvent,
          isLoading: false,
        }));
      } else {
        throw new Error(response.message || 'Failed to update event');
      }
    } catch (error) {
      set({
        isLoading: false,
        error: getErrorMessage(error),
      });
      throw error;
    }
  },

  deleteEvent: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await eventsApi.deleteEvent(id);
      
      if (response.success) {
        set((state) => ({
          events: state.events.filter((event) => event._id !== id),
          currentEvent: state.currentEvent?._id === id ? null : state.currentEvent,
          isLoading: false,
        }));
      } else {
        throw new Error(response.message || 'Failed to delete event');
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

  setCurrentEvent: (event: Event | null) => {
    set({ currentEvent: event });
  },
}));
