import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState } from '../types';
import { FirebaseAuthService } from '../services/firebaseAuth';
import { getErrorMessage } from '../utils';

interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  validateToken: () => Promise<void>;
  clearError: () => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const userCredential = await FirebaseAuthService.signInWithEmail(email, password);
          const idToken = await userCredential.user.getIdToken();
          
          const user = {
            id: userCredential.user.uid,
            email: userCredential.user.email!,
            role: 'admin' as const,
            name: userCredential.user.displayName || '',
            phoneNumber: '',
            address: '',
            city: '',
            state: '',
            zipCode: '',
            country: '',
            profileImageUrl: userCredential.user.photoURL || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          set({
            user,
            token: idToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          console.error('Login store error:', error);
          const errorMessage = getErrorMessage(error);
          
          // Handle specific Firebase errors
          if (error instanceof Error) {
            if (error.message.includes('network-request-failed')) {
              set({
                isLoading: false,
                error: 'Network error. Please check your internet connection and try again.',
                isAuthenticated: false,
              });
            } else if (error.message.includes('auth/user-not-found')) {
              set({
                isLoading: false,
                error: 'No account found with this email address.',
                isAuthenticated: false,
              });
            } else if (error.message.includes('auth/wrong-password')) {
              set({
                isLoading: false,
                error: 'Incorrect password. Please try again.',
                isAuthenticated: false,
              });
            } else {
              set({
                isLoading: false,
                error: errorMessage,
                isAuthenticated: false,
              });
            }
          } else {
            set({
              isLoading: false,
              error: errorMessage,
              isAuthenticated: false,
            });
          }
          throw error;
        }
      },

      loginWithGoogle: async () => {
        set({ isLoading: true, error: null });
        try {
          const userCredential = await FirebaseAuthService.signInWithGoogle();
          const idToken = await userCredential.user.getIdToken();
          
          const user = {
            id: userCredential.user.uid,
            email: userCredential.user.email!,
            role: 'admin' as const,
            name: userCredential.user.displayName || '',
            phoneNumber: '',
            address: '',
            city: '',
            state: '',
            zipCode: '',
            country: '',
            profileImageUrl: userCredential.user.photoURL || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          set({
            user,
            token: idToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          console.error('Google login store error:', error);
          const errorMessage = getErrorMessage(error);
          
          // Handle specific Firebase errors
          if (error instanceof Error) {
            if (error.message.includes('network-request-failed')) {
              set({
                isLoading: false,
                error: 'Network error. Please check your internet connection and try again.',
                isAuthenticated: false,
              });
            } else if (error.message.includes('auth/popup-closed-by-user')) {
              set({
                isLoading: false,
                error: 'Sign-in popup was closed. Please try again.',
                isAuthenticated: false,
              });
            } else {
              set({
                isLoading: false,
                error: errorMessage,
                isAuthenticated: false,
              });
            }
          } else {
            set({
              isLoading: false,
              error: errorMessage,
              isAuthenticated: false,
            });
          }
          throw error;
        }
      },

      logout: () => {
        try {
          FirebaseAuthService.signOut();
        } catch (error) {
          console.error('Logout error:', error);
        }
        
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      validateToken: async () => {
        const currentUser = FirebaseAuthService.getCurrentUser();
        if (!currentUser) {
          set({ isAuthenticated: false });
          return;
        }

        set({ isLoading: true });
        try {
          const idToken = await currentUser.getIdToken();
          const user = {
            id: currentUser.uid,
            email: currentUser.email!,
            role: 'admin' as const,
            name: currentUser.displayName || '',
            phoneNumber: '',
            address: '',
            city: '',
            state: '',
            zipCode: '',
            country: '',
            profileImageUrl: currentUser.photoURL || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          set({
            user,
            token: idToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          console.error('Token validation error:', error);
          get().logout();
        }
      },

      clearError: () => {
        set({ error: null });
      },

      initializeAuth: () => {
        // Listen to Firebase auth state changes
        FirebaseAuthService.onAuthStateChanged((user) => {
          if (user) {
            user.getIdToken().then((idToken) => {
              const userData = {
                id: user.uid,
                email: user.email!,
                role: 'admin' as const, // For now, all users are admin
                name: user.displayName || '',
                phoneNumber: '',
                address: '',
                city: '',
                state: '',
                zipCode: '',
                country: '',
                profileImageUrl: user.photoURL || '',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              };
              
              set({
                user: userData,
                token: idToken,
                isAuthenticated: true,
                isLoading: false,
              });
            }).catch((error) => {
              console.error('Error getting ID token:', error);
              set({
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
              });
            });
          } else {
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }
        });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
