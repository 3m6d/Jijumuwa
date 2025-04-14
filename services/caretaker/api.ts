// src/services/api.ts
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { getAccessToken, clearAuthData } from "@/services/auth/authService";
import { globalConfig } from "../../global-config";

const API_BASE_URL = globalConfig.api.baseUrl;

// Create axios instance with common configuration
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to add auth token to all requests
apiClient.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle 401 errors and token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await getAccessToken();
        if (refreshToken) {
          // Try to refresh the token
          const response = await axios.post(
            `${API_BASE_URL}/authentication/token/refresh/`,
            {
              refresh: refreshToken,
            }
          );

          if (response.data.access) {
            // Update the token in SecureStore
            await SecureStore.setItemAsync(
              "access_token",
              response.data.access
            );

            // Update the authorization header
            originalRequest.headers.Authorization = `Bearer ${response.data.access}`;

            // Retry the original request
            return apiClient(originalRequest);
          }
        }
      } catch (refreshError) {
        // If token refresh fails, clear auth data and redirect to login
        await clearAuthData();
        // You might want to add navigation to login screen here
      }
    }

    return Promise.reject(error);
  }
);


// Generic API service functions
const apiService = {
  get: async (url: string) => {
    try {
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error("API GET Error:", error);
      throw error;
    }
  },

  post: async (url: string, data: any) => {
    try {
      const response = await apiClient.post(url, data);
      return response.data;
    } catch (error) {
      console.error("API POST Error:", error);
      throw error;
    }
  },

  put: async (url: string, data: any) => {
    try {
      const response = await apiClient.put(url, data);
      return response.data;
    } catch (error) {
      console.error("API PUT Error:", error);
      throw error;
    }
  },

  delete: async (url: string) => {
    try {
      const response = await apiClient.delete(url);
      return response.data;
    } catch (error) {
      console.error("API DELETE Error:", error);
      throw error;
    }
  },
};

export default apiService;
