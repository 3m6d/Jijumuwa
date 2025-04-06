// types/index.ts

// Define user roles explicitly
export type UserRole = 'elderly' | 'caretaker' | null;

// User information structure
export interface User {
  id: number; // Assuming backend provides user ID
  name: string;
  phone_number: string; // Keep consistent with backend model
  role: UserRole;
}

// Authentication state structure
export interface AuthState {
  isLoading: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  userRole: UserRole;
  user: User | null; // Store user details upon login
}

// Actions for the authentication reducer
export type AuthAction =
  | { type: 'RESTORE_TOKEN'; payload: { accessToken: string | null; refreshToken: string | null; userRole: UserRole, user: User | null } }
  | { type: 'SIGN_IN'; payload: { accessToken: string; refreshToken: string; userRole: UserRole, user: User } }
  | { type: 'SIGN_OUT' };

// Structure for chat messages
export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}

// --- Remove StackParamList types, Expo Router uses file structure ---

