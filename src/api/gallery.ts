import apiClient from './client';
import { GalleryImage, ApiResponse, PaginationData } from '../types';

export const galleryApi = {
  // Get gallery images
  getGalleryImages: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<{ images: GalleryImage[]; pagination: PaginationData }>> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    return apiClient.get(`/gallery?${queryParams.toString()}`);
  },

  // Create gallery image (admin)
  createGalleryImage: async (imageData: {
    imageUrl: string;
    title: string;
    description?: string;
  }): Promise<ApiResponse<{ galleryImage: GalleryImage }>> => {
    return apiClient.post('/gallery', imageData);
  },

  // Delete gallery image (admin)
  deleteGalleryImage: async (id: string): Promise<ApiResponse> => {
    return apiClient.delete(`/gallery/${id}`);
  },
};
