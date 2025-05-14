/**
 * Auth utilities for handling tokens and authentication state
 */

// Token refresh response interface
interface TokenRefreshResponse {
  accessToken: string;
  refreshToken?: string;
}

// Save tokens to localStorage
export const saveTokens = (accessToken: string, refreshToken: string): void => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

// Clear tokens from localStorage
export const clearTokens = (): void => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

// Get tokens from localStorage
export const getTokens = (): { accessToken: string | null; refreshToken: string | null } => {
  return {
    accessToken: localStorage.getItem('accessToken'),
    refreshToken: localStorage.getItem('refreshToken')
  };
};

// Check if user is authenticated based on valid token
export const isAuthenticated = (): boolean => {
  const accessToken = localStorage.getItem('accessToken');
  
  // Basic token validation - you might want to check token expiration as well
  return !!accessToken;
};

// Refresh the access token using refresh token
export const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = localStorage.getItem('refreshToken');
  
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }
  
  try {
    const response = await fetch('https://realestatesite-backend.onrender.com/api/v1/RealEstateUser/refresh-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error('Token refresh failed');
    }
    
    const data: TokenRefreshResponse = await response.json();
    const newAccessToken = data.accessToken;
    
    // Update localStorage with new token
    localStorage.setItem('accessToken', newAccessToken);
    
    console.log("✅ Token refreshed and saved to localStorage");
    return newAccessToken;
  } catch (error) {
    console.error("Token refresh error:", error);
    clearTokens(); // Clear invalid tokens
    throw error;
  }
};