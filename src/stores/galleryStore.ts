import { create } from 'zustand';
import { GalleryState } from '../types';
import { galleryApi } from '../api/gallery';
import { getErrorMessage } from '../utils';

// Helper function to map backend response (id) to frontend format (_id)
const mapGalleryResponse = (image: any) => ({
  ...image,
  _id: image.id || image._id,
});

interface GalleryStore extends GalleryState {
  fetchImages: (params?: { page?: number; limit?: number }) => Promise<void>;
  createImage: (imageData: { imageUrl: string; title: string; description?: string }) => Promise<void>;
  deleteImage: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useGalleryStore = create<GalleryStore>((set, get) => ({
  images: [],
  isLoading: false,
  error: null,
  pagination: null,

  fetchImages: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await galleryApi.getGalleryImages(params);
      
      if (response.success && response.data) {
        set({
          images: response.data.images.map(mapGalleryResponse),
          pagination: response.data.pagination,
          isLoading: false,
        });
      } else {
        throw new Error(response.message || 'Failed to fetch gallery images');
      }
    } catch (error) {
      set({
        isLoading: false,
        error: getErrorMessage(error),
      });
    }
  },

  createImage: async (imageData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await galleryApi.createGalleryImage(imageData);
      
      if (response.success && response.data) {
        const newImage = mapGalleryResponse(response.data.galleryImage);
        set((state) => ({
          images: [newImage, ...state.images],
          isLoading: false,
        }));
      } else {
        throw new Error(response.message || 'Failed to add gallery image');
      }
    } catch (error) {
      set({
        isLoading: false,
        error: getErrorMessage(error),
      });
      throw error;
    }
  },

  deleteImage: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await galleryApi.deleteGalleryImage(id);
      
      if (response.success) {
        set((state) => ({
          images: state.images.filter((image) => image._id !== id),
          isLoading: false,
        }));
      } else {
        throw new Error(response.message || 'Failed to delete gallery image');
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
