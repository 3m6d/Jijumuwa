// src/services/api.ts
import axios from 'axios';
import { getAccessToken } from '@/services/auth/authService';  

const API_BASE_URL = 'http://192.168.1.105/care'; 

// Create axios instance with common configuration
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


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

// Generic API service functions
const apiService = {
  get: async (url: string) => {
    try {
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('API GET Error:', error);
      throw error;
    }
  },
  
  post: async (url: string, data: any) => {
    try {
      const response = await apiClient.post(url, data);
      return response.data;
    } catch (error) {
      console.error('API POST Error:', error);
      throw error;
    }
  },
  
  put: async (url: string, data: any) => {
    try {
      const response = await apiClient.put(url, data);
      return response.data;
    } catch (error) {
      console.error('API PUT Error:', error);
      throw error;
    }
  },
  
  delete: async (url: string) => {
    try {
      const response = await apiClient.delete(url);
      return response.data;
    } catch (error) {
      console.error('API DELETE Error:', error);
      throw error;
    }
  },
};

export default apiService;
