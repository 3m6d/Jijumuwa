import apiClient from '@/api/apiClient';
import axios from 'axios';
import { globalConfig } from '@/global-config';

export interface Bhajan {
  id: number;
  title: string;
  artist: string | null;
  file_path: string;  // This will be the full URL to the audio file
  duration: string | null;
}

// Debounce timer and cache
let fetchDebounceTimer: NodeJS.Timeout | null = null;
let lastFetchTime = 0;
const DEBOUNCE_DELAY = 2000; // 2 seconds
let cachedBhajans: Bhajan[] | null = null;

export const fetchBhajans = async (): Promise<Bhajan[]> => {
  // Return cached data if it exists and the request is within debounce period
  const now = Date.now();
  if (cachedBhajans && now - lastFetchTime < DEBOUNCE_DELAY) {
    console.log('[BhajanService] Returning cached bhajans');
    return cachedBhajans;
  }

  // Clear any pending debounced requests
  if (fetchDebounceTimer) {
    clearTimeout(fetchDebounceTimer);
  }

  return new Promise((resolve, reject) => {
    fetchDebounceTimer = setTimeout(async () => {
      try {
        console.log('[BhajanService] Fetching bhajans from:', `${globalConfig.api.baseUrl}/care/bhajans/`);
        
        const controller = new AbortController();
        const timeout = setTimeout(() => {
          controller.abort();
        }, 10000); // 10 second timeout

        const response = await apiClient.get<Bhajan[]>('/care/bhajans/', {
          signal: controller.signal,
          timeout: 10000,
        });

        clearTimeout(timeout);
        console.log('[BhajanService] Received response:', response.data);
        
        if (!response.data || !Array.isArray(response.data)) {
          throw new Error('Invalid response format from server');
        }

        // Validate each bhajan has required fields
        const validBhajans = response.data.filter(bhajan => {
          if (!bhajan.file_path) {
            console.warn('[BhajanService] Bhajan missing file_path:', bhajan);
            return false;
          }
          // Ensure file_path is a valid URL
          try {
            new URL(bhajan.file_path);
            return true;
          } catch {
            console.warn('[BhajanService] Invalid URL in file_path:', bhajan.file_path);
            return false;
          }
        });

        if (validBhajans.length === 0) {
          throw new Error('No valid bhajans found in response');
        }

        // Update cache and timestamp
        cachedBhajans = validBhajans;
        lastFetchTime = Date.now();
        
        resolve(validBhajans);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('[BhajanService] Axios error:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
          });
          
          if (error.code === 'ECONNABORTED') {
            reject(new Error('Request timed out. Please check your connection.'));
          } else if (error.response?.status === 404) {
            reject(new Error('Bhajans endpoint not found. Please check the server configuration.'));
          } else if (error.response?.status === 401) {
            reject(new Error('Authentication required to access bhajans.'));
          } else if (error.response?.status === 500) {
            reject(new Error('Server error. Please try again later.'));
          } else {
            reject(new Error('Network error. Please check your connection.'));
          }
        } else if (error instanceof Error) {
          console.error('[BhajanService] Error:', error.message);
          reject(error);
        } else {
          console.error('[BhajanService] Unknown error:', error);
          reject(new Error('Failed to fetch bhajans. Please check your internet connection and try again.'));
        }
      }
    }, 100); // Small delay to allow debouncing
  });
}; 