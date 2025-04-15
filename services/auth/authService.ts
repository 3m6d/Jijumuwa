//services//auth/authService.ts

import * as SecureStore from "expo-secure-store";
import { Alert } from "react-native";
import { apiClient } from "../caretaker/api";

import { globalConfig } from "../../global-config";
const API_URL = globalConfig.api.baseUrl;

// SecureStore keys for storing auth data securely on the device
const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USER_ROLE_KEY = "user_role";
const USER_DATA_KEY = "user_data";
const ELDERLY_ID_KEY = "elderly_id";
const ELDERLY_NAME_KEY = "elderly_name";
const CARETAKER_ID_KEY = "caretaker_id";
const CARETAKER_NAME_KEY = "caretaker_name";

/**
 * Interface for user data structure
 */
interface UserData {
  role: string; // User role (elderly, caretaker)
  [key: string]: any; // Additional user properties
}

/**
 * Response type for authentication operations
 */
interface AuthResponse {
  success: boolean;
  role?: string;
  name?: string;
  error?: string;
}

/**
 * Response type for token refresh operations
 */
interface TokenRefreshResponse {
  success: boolean;
  accessToken?: string;
  error?: string;
}

/**
 * Response type for authenticated API requests
 */
interface APIRequestResponse {
  success: boolean;
  data?: any;
  error?: string;
}

/**
 * Stores authentication tokens and user data in secure storage
 *
 * @param accessToken - JWT access token
 * @param refreshToken - JWT refresh token
 * @param userData - User profile data
 * @returns Promise resolving to success boolean
 */
export const storeAuthData = async (
  access: string,
  refresh: string,
  name: string,
  role: string,
  elderlyId?: string
): Promise<boolean> => {
  try {
    console.log("[storeAuthData] Storing auth data for user role:", name);

    // Store all authentication data securely
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, access);
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refresh);
    await SecureStore.setItemAsync(USER_ROLE_KEY, role);
    await SecureStore.setItemAsync(USER_DATA_KEY, name);
    if (elderlyId) {
      await SecureStore.setItemAsync(ELDERLY_ID_KEY, elderlyId);
    }

    console.log("[storeAuthData] Auth data stored successfully.");
    return true;
  } catch (error: any) {
    console.error("[storeAuthData] Error storing auth data:", error);
    return false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  try {
    const token = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
    console.log("[getAccessToken] Retrieved token:", token);
    return token;
  } catch (error: any) {
    console.error("[getAccessToken] Error getting access token:", error);
    return null;
  }
};

export const getRefreshToken = async (): Promise<string | null> => {
  try {
    const token = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    console.log("[getRefreshToken] Retrieved token:", token);
    return token;
  } catch (error: any) {
    console.error("[getRefreshToken] Error getting refresh token:", error);
    return null;
  }
};

export const getUserRole = async (): Promise<string | null> => {
  try {
    const role = await SecureStore.getItemAsync(USER_ROLE_KEY);
    console.log("[getUserRole] Retrieved user role:", role);
    return role;
  } catch (error: any) {
    console.error("[getUserRole] Error getting user role:", error);
    return null;
  }
};

export const getUserData = async (): Promise<UserData | null> => {
  try {
    const userDataStr = await SecureStore.getItemAsync(USER_DATA_KEY);
    const parsedData = userDataStr ? JSON.parse(userDataStr) : null;
    console.log("[getUserData] Retrieved user data:", parsedData);
    return parsedData;
  } catch (error: any) {
    console.error("[getUserData] Error getting user data:", error);
    return null;
  }
};

export const isAuthenticated = async (): Promise<boolean> => {
  const token = await getAccessToken();
  console.log("[isAuthenticated] Is authenticated:", !!token);
  return !!token;
};

export const clearAuthData = async (): Promise<boolean> => {
  try {
    console.log("[clearAuthData] Clearing all stored authentication data.");
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_ROLE_KEY);
    await SecureStore.deleteItemAsync(USER_DATA_KEY);
    console.log("[clearAuthData] Auth data cleared.");
    return true;
  } catch (error: any) {
    console.error("[clearAuthData] Error clearing auth data:", error);
    return false;
  }
};

/**
 * Authenticates user with phone number and password
 *
 * @param phoneNumber - User's phone number
 * @param password - User's password
 * @returns Promise resolving to AuthResponse
 */
export const login = async (
  phoneNumber: string,
  password: string
): Promise<AuthResponse> => {
  try {
    // Use correct URL with trailing slash for Django compatibility
    const loginUrl = `${API_URL}/authentication/login/`;

    // Make login request - ensure phone_number and password are correctly sent
    const response = await fetch(loginUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        phone_number: phoneNumber,
        password: password,
      }),
    });

    const data = await response.json();

    console.log("[DATA]", data);

    // Handle unsuccessful responses
    if (!response.ok) {
      console.error("[login] Response error:", data);
      return {
        success: false,
        error: data.detail || "Login failed. Please check your credentials.",
      };
    }

    // // Verify required data is present
    // if (!data.access || !data.refresh || !data.name || !data.role) {
    //   console.error('[login] Incomplete data in successful response:', data);
    //   return {
    //     success: false,
    //     error: 'Server returned incomplete data. Please try again.'
    //   };
    // }

    // Extract tokens and user data
    const { access, refresh, name, role ,elderlyId} = data;
    console.log("[login] Login successful for user role:", role);

    // Store authentication data securely
    await storeAuthData(access, refresh, name, role, elderlyId);

    return {
      success: true,
      role,
      name,
    };
  } catch (error: any) {
    console.error("[login] Login error:", error);
    return {
      success: false,
      error:
        error.message ||
        "Login failed. Please check your connection and try again.",
    };
  }
};

export const refreshToken = async (): Promise<TokenRefreshResponse> => {
  try {
    console.log("[refreshToken] Attempting to refresh token.");
    const refresh = await getRefreshToken();

    if (!refresh) {
      console.error("[refreshToken] No refresh token available.");
      throw new Error("No refresh token available");
    }

    const response = await fetch(`${API_URL}/authentication/token/refresh/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh }),
    });

    const data = await response.json();
    console.log("[refreshToken] Response data:", data);

    if (!response.ok) {
      console.error("[refreshToken] Response error:", data);
      throw new Error(data.detail || "Token refresh failed");
    }

    console.log("[refreshToken] Storing new access token:", data.access);
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, data.access);

    console.log("[refreshToken] Token refreshed successfully.");
    return {
      success: true,
      accessToken: data.access,
    };
  } catch (error: any) {
    console.error("[refreshToken] Token refresh error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

export const logout = async (): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    console.log("[logout] Logging out.");
    const refresh = await getRefreshToken();

    if (refresh) {
      try {
        console.log("[logout] Invalidating refresh token on server.");
        await fetch(`${API_URL}/authentication/logout/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refresh }),
        });
      } catch (e) {
        console.error("[logout] Error invalidating token on server:", e);
      }
    }

    const cleared = await clearAuthData();
    if (cleared) {
      console.log("[logout] Logout completed successfully.");
      return { success: true };
    } else {
      throw new Error("Failed to clear auth data.");
    }
  } catch (error: any) {
    console.error("[logout] Logout error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

export const authenticatedRequest = async (
  endpoint: string,
  method: string = "GET",
  body: any = null
): Promise<APIRequestResponse> => {
  try {
    console.log(
      "[authenticatedRequest] Initiating request to endpoint:",
      endpoint
    );
    let accessToken = await getAccessToken();

    if (!accessToken) {
      console.error("[authenticatedRequest] No access token available.");
      throw new Error("No access token available");
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };

    const options: RequestInit = {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    };

    let response = await fetch(`${API_URL}${endpoint}`, options);
    console.log(
      "[authenticatedRequest] First response status:",
      response.status
    );

    if (response.status === 401) {
      console.warn(
        "[authenticatedRequest] Access token expired. Attempting to refresh token."
      );
      const refreshResult = await refreshToken();

      if (refreshResult.success && refreshResult.accessToken) {
        headers.Authorization = `Bearer ${refreshResult.accessToken}`;
        response = await fetch(`${API_URL}${endpoint}`, {
          method,
          headers,
          body: body ? JSON.stringify(body) : null,
        });
        console.log(
          "[authenticatedRequest] Retried response status:",
          response.status
        );
      } else {
        console.error("[authenticatedRequest] Token refresh failed.");
        await clearAuthData();
        throw new Error("Session expired. Please login again.");
      }
    }

    const data = await response.json();
    console.log("[authenticatedRequest] Response data:", data);

    if (!response.ok) {
      console.error("[authenticatedRequest] Request error:", data);
      throw new Error(data.detail || "Request failed");
    }

    console.log("[authenticatedRequest] Request succeeded.");
    return { success: true, data };
  } catch (error: any) {
    console.error("[authenticatedRequest] API request error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};
