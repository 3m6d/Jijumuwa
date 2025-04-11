// src/services/api.ts
import axios from 'axios';

// Base URL for your Django backend
const API_BASE_URL = 'http://192.168.1.75/care'; 

// Create axios instance with common configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication if needed
apiClient.interceptors.request.use((config) => {
  // You can add authentication token here
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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