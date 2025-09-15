import { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';

export const useAuth = () => {
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    validateToken,
    clearError,
    initializeAuth,
  } = useAuthStore();

  // Validate token on mount
  useEffect(() => {
    if (token && !user) {
      validateToken();
    }
  }, [token, user, validateToken]);

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    validateToken,
    clearError,
    initializeAuth,
  };
};
