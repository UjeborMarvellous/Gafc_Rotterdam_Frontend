// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any[];
}

export interface PaginationData {
  current: number;
  pages: number;
  total: number;
}

// User Types
export interface User {
  id: string;
  email: string;
  role: 'admin';
  name: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  profileImageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Event Types
export interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  imageUrl: string;
  maxParticipants: number;
  currentParticipants: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface EventSummary {
  _id: string;
  title: string;
  date?: string;
  location?: string;
}

export interface EventRegistration {
  _id: string;
  eventId: string | EventSummary;
  userEmail: string;
  userName: string;
  phoneNumber: string;
  registrationDate: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

// Gallery Types
export interface GalleryImage {
  _id: string;
  imageUrl: string;
  title?: string;
  description?: string;
  uploadedBy: {
    _id: string;
    email: string;
  };
  createdAt: Date;
  updatedAt: Date;
  caption: string;
  isActive: boolean;
}

// Organizer Types
export interface Organizer {
  _id: string;
  name: string;
  position: string;
  bio: string;
  profileImageUrl: string;
  socialLinks?: {
    whatsapp?: string;
    instagram?: string;
    facebook?: string;
    linkedin?: string;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  phoneNumber: string;
}

// Comment Types
export interface Comment {
  _id: string;
  content: string;
  authorName: string;
  authorEmail: string;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

// Contact Types
export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  status: 'new' | 'in_review' | 'resolved';
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface EventForm {
  title: string;
  description: string;
  date: string;
  location: string;
  imageUrl: string;
  maxParticipants: number;
  isActive: boolean;
}

export interface RegistrationForm {
  eventId: string | EventSummary;
  userEmail: string;
  userName: string;
  phoneNumber: string;
}

export interface CommentForm {
  content: string;
  authorName: string;
  authorEmail: string;
}

export interface ContactMessageForm {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export interface OrganizerForm {
  name: string;
  position: string;
  bio: string;
  profileImageUrl: string;
  socialLinks?: {
    whatsapp?: string;
    instagram?: string;
    facebook?: string;
    linkedin?: string;
  };
  isActive: boolean;
}

// Store Types
export interface EventsState {
  events: Event[];
  currentEvent: Event | null;
  isLoading: boolean;
  error: string | null;
  pagination: PaginationData | null;
}

export interface GalleryState {
  images: GalleryImage[];
  isLoading: boolean;
  error: string | null;
  pagination: PaginationData | null;
}

export interface OrganizersState {
  organizers: Organizer[];
  isLoading: boolean;
  error: string | null;
}

export interface CommentsState {
  comments: Comment[];
  isLoading: boolean;
  error: string | null;
  pagination: PaginationData | null;
}

export interface RegistrationsState {
  registrations: EventRegistration[];
  isLoading: boolean;
  error: string | null;
  pagination: PaginationData | null;
}

export interface ContactMessagesState {
  messages: ContactMessage[];
  isLoading: boolean;
  error: string | null;
  pagination: PaginationData | null;
}

// Component Props Types
export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  className?: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}
