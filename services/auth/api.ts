import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useContext } from 'react'; // Import useContext
import { AuthContext } from '../../context/AuthContext'; // Import AuthContext

const BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_URL, // Replace with your Django API URL
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await SecureStore.getItemAsync('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${BASE_URL}/authentication/refresh/`, { // Adjust refresh endpoint
            refresh: refreshToken,
          });

          const { access } = response.data;
          await SecureStore.setItemAsync('accessToken', access);
          api.defaults.headers.common.Authorization = `Bearer ${access}`;
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        } else {
          // If no refresh token, force logout
          // We can't use router here, so we'll use AuthContext to trigger signOut
          // This assumes that api.ts is only used within the AuthProvider
          const authContext = useContext(AuthContext);
          if (authContext) {
            await authContext.signOut();
          }
        }
      } catch (refreshError) {
        // Handle refresh token errors
        console.error('Refresh token error:', refreshError);
        const authContext = useContext(AuthContext);
        if (authContext) {
          await authContext.signOut();
        }
      }
    }
    return Promise.reject(error);
  }
);

// Add register function
export const register = async (userData: any) => {
  try {
    const response = await api.post('/authentication/register/', userData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw { detail: 'An error occurred during registration' };
  }
};

export default api;