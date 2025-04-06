// api/index.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://192.168.1.75:8081';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // Increased timeout
});

// Request interceptor to automatically add the JWT access token to headers
api.interceptors.request.use(async (config) => {
  try {
    const accessToken = await AsyncStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
      console.log('Token added to request header.'); // For debugging
    } else {
      console.log('No access token found for request.'); // For debugging
    }
  } catch (e) {
      console.error("Error retrieving access token from storage", e);
  }
  return config;
}, (error) => {
  console.error("Error in request interceptor", error);
  return Promise.reject(error);
});

export default api;
