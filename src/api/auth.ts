import apiClient from './client';
import { User, LoginForm, ApiResponse } from '../types';

export const authApi = {
  // Admin login
  login: async (credentials: LoginForm): Promise<ApiResponse<{ user: User; token: string }>> => {
    return apiClient.post('/auth/login', credentials);
  },

  // Validate token
  validateToken: async (): Promise<ApiResponse<{ user: User }>> => {
    return apiClient.get('/auth/validate');
  },

  // Admin registration (one-time setup)
  register: async (credentials: LoginForm): Promise<ApiResponse<{ user: User; token: string }>> => {
    return apiClient.post('/auth/register', credentials);
  },
};
