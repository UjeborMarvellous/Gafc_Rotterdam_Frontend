import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, parseISO, isValid } from 'date-fns';

// Utility function to merge Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Date formatting utilities
export const formatDate = (date: string | Date, formatStr: string = 'PPP'): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return 'Invalid Date';
    return format(dateObj, formatStr);
  } catch (error) {
    return 'Invalid Date';
  }
};

export const formatDateTime = (date: string | Date): string => {
  return formatDate(date, 'PPP p');
};

export const formatTime = (date: string | Date): string => {
  return formatDate(date, 'p');
};

// String utilities
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export const capitalizeFirst = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

// Validation utilities
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

// URL utilities
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Local storage utilities
export const getFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

export const setToStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const removeFromStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};

// Debounce utility
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Error handling utilities
export const getErrorMessage = (error: any): string => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  if (error?.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

// Image utilities
export const getImageUrl = (url: string): string => {
  if (url.startsWith('http')) {
    return url;
  }
  return `${process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000'}${url}`;
};

// Pagination utilities
export const getPaginationInfo = (current: number, total: number, limit: number) => {
  const totalPages = Math.ceil(total / limit);
  const hasNext = current < totalPages;
  const hasPrev = current > 1;
  
  return {
    current,
    totalPages,
    hasNext,
    hasPrev,
    startItem: (current - 1) * limit + 1,
    endItem: Math.min(current * limit, total),
  };
};

// Social media utilities
export const getSocialIcon = (platform: string): string => {
  const icons: Record<string, string> = {
    whatsapp: '📱',
    instagram: '📷',
    facebook: '👥',
    linkedin: '💼',
  };
  return icons[platform.toLowerCase()] || '🔗';
};

// Form utilities
export const getFormErrors = (errors: any): Record<string, string> => {
  if (!errors) return {};
  
  if (Array.isArray(errors)) {
    return errors.reduce((acc, error) => {
      if (error.param) {
        acc[error.param] = error.msg;
      }
      return acc;
    }, {} as Record<string, string>);
  }
  
  return errors;
};
