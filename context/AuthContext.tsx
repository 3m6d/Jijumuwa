// app/context/AuthContext.tsx
import React, { createContext, useContext, useReducer, useEffect, useMemo } from 'react';
import * as SecureStore from 'expo-secure-store';
import { AuthState, AuthAction, User, UserRole } from '../types';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';

const API_URL = axios.create({
  baseURL: 'http://192.168.1.91:8000'
});

const router = useRouter();

interface AuthContextType {
  signIn: (data: { phone_number: string; password?: string }) => Promise<void>;
  signOut: () => Promise<void>;
  // Use the signUp function provided here in your RegisterScreen
  signUp: (data: any) => Promise<void>;
  authState: AuthState;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Reducer remains the same as  provided
const authReducer = (prevState: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'RESTORE_TOKEN':
      return {
        ...prevState,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        userRole: action.payload.userRole,
        user: action.payload.user,
        isLoading: false,
      };
    case 'SIGN_IN':
      return {
        ...prevState,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        userRole: action.payload.userRole,
        user: action.payload.user,
        isLoading: false, // Ensure loading is set to false on sign in
      };
    case 'SIGN_OUT':
      return {
        ...prevState,
        accessToken: null,
        refreshToken: null,
        userRole: null,
        user: null,
      };
    default:
      // It's good practice to throw an error for unhandled actions
      // throw new Error(`Unhandled action type: ${action.type}`);
      // Or just return previous state if default is acceptable
       return prevState;
  }
};

// Initial state remains the same
const initialState: AuthState = {
  isLoading: true,
  accessToken: null,
  refreshToken: null,
  userRole: null,
  user: null,
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, dispatch] = useReducer(authReducer, initialState);

  // useEffect for bootstrapping remains the same
  useEffect(() => {
    const bootstrapAsync = async () => {
      let accessToken: string | null = null;
      let refreshToken: string | null = null;
      let userRole: UserRole = null; // Make sure UserRole type allows null
      let user: User | null = null;

      try {
        accessToken = await SecureStore.getItemAsync('accessToken');
        refreshToken = await SecureStore.getItemAsync('refreshToken');
        const storedRole = await SecureStore.getItemAsync('userRole');
        const storedUser = await SecureStore.getItemAsync('user');

        // Add basic type validation if needed before casting
        if (storedRole /* && isValidRole(storedRole) */) {
           userRole = storedRole as UserRole; // Be careful with casting
        }
        if (storedUser) {
           // Add try-catch specifically for JSON parsing
           try {
             user = JSON.parse(storedUser);
           } catch (parseError) {
             console.error("Failed to parse stored user data", parseError);
             // Optionally delete the invalid item
             // await SecureStore.deleteItemAsync('user');
           }
        }
      } catch (e) {
        console.error('Restoring auth state failed', e);
        // Consider clearing storage if restoration fails critically
        // await SecureStore.deleteItemAsync('accessToken');
        // ... delete other items ...
      }

      // Ensure isLoading is set to false even if tokens are null
      dispatch({ type: 'RESTORE_TOKEN', payload: { accessToken, refreshToken, userRole, user } });
    };

    bootstrapAsync();
  }, []);

  // useMemo for context value remains the same
  const authContextValue = useMemo(
    () => ({
      signIn: async (data: { phone_number: string; password?: string }) => {
        try {
          const response = await API_URL.post('/authentication/login/', {
            phone_number: data.phone_number,
            password: data.password,
          });

          // Ensure API response structure matches this destructuring
          const { access, refresh, role, name, id } = response.data;
          const loggedInUser: User = { name, phone_number: data.phone_number, role };

          await SecureStore.setItemAsync('accessToken', access);
          await SecureStore.setItemAsync('refreshToken', refresh);
          await SecureStore.setItemAsync('userRole', role);
          await SecureStore.setItemAsync('user', JSON.stringify(loggedInUser));

          dispatch({ type: 'SIGN_IN', payload: { accessToken: access, refreshToken: refresh, userRole: role, user: loggedInUser } });

          // Navigation is handled by the LoginScreen's useEffect reacting to state change
          // router.replace('/(app)/(elderly)'); // Keep commented or remove

        } catch (error: any) {
           // Provide feedback and re-throw for the calling component
           const errorMessage = error.response?.data?.detail || error.message || 'An unexpected error occurred.';
           console.error("Sign In Error:", errorMessage, error.response?.data); // Log details
           Alert.alert('Login Failed', errorMessage);
           throw error; // Re-throw the error
        }
      },
      signOut: async () => {
        try {
          const refreshToken = await SecureStore.getItemAsync('refreshToken');
          if (refreshToken) {
             // Attempt server-side logout, but don't block client-side logout if it fails
             await API_URL.post('/authentication/signout/', { refresh: refreshToken });
          }
        } catch (error: any) {
          // Log error but continue with local sign out
          console.error('Sign out API call error:', error.response?.data || error.message);
        } finally {
           // Ensure local state is cleared and user is redirected
          await SecureStore.deleteItemAsync('accessToken');
          await SecureStore.deleteItemAsync('refreshToken');
          await SecureStore.deleteItemAsync('userRole');
          await SecureStore.deleteItemAsync('user');
          dispatch({ type: 'SIGN_OUT' });
          router.replace('/(tabs)/login'); // Navigate after state update
        }
      },
      signUp: async (data: any) => {
        try {
          // Assume 'data' contains { name, phone_number, password, user_type }
          // as prepared by RegisterScreen
          const response = await API_URL.post('/authentication/register/', data);

          // Use a more generic success message or extract from response if available
          Alert.alert('Registration Successful', response.data?.message || 'You can now log in.');
          router.replace('/(tabs)/login'); // Navigate to login after successful registration

          // Note: No state dispatch needed here as registration doesn't automatically sign in
        } catch (error: any) {
          let errorMessage = 'Registration failed. Please try again.';
           // Attempt to parse complex Django Rest Framework errors
          if (error.response?.data && typeof error.response.data === 'object') {
            errorMessage = Object.entries(error.response.data)
              .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
              .join('\n');
          } else if (error.message) {
            errorMessage = error.message;
          }
          console.error("Sign Up Error:", errorMessage, error.response?.data); // Log details
          Alert.alert('Registration Failed', errorMessage);
          throw error; // Re-throw for the calling component
        }
      },
      authState, // Provide the state
    }),
    [authState] // Dependency array includes authState
  );

  return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
};

// useAuth hook remains the same
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};