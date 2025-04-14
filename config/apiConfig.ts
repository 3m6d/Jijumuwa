// API configuration constants

/**
 * Base URL for the API endpoints
 * Change this when moving between development, staging and production
 */


export const API_BASE_URL = 'http://192.168.1.91:8000';

/**
 * API endpoint paths
 */
export const API_ENDPOINTS = {
  LOGIN: '/authentication/login/',
  LOGOUT: '/authentication/logout/',
  REGISTER: '/authentication/register/',
  REFRESH_TOKEN: '/authentication/token/refresh/',
};

/**
 * Default timeout for API requests in milliseconds
 */
export const API_TIMEOUT = 15000;

/**
 * Common request headers
 */
export const COMMON_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

/**
 * Get the full URL for an API endpoint
 * @param endpoint The endpoint path
 * @returns The complete URL
 */
export const getApiUrl = (endpoint: string): string => {
  // Ensure endpoint starts with a slash
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${normalizedEndpoint}`;
};
