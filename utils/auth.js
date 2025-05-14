// utils/auth.js

export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refresh_token');
  if (!refreshToken) {
    console.error('No refresh token found');
    return null;
  }

  try {
    const response = await fetch('/api/refresh-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const data = await response.json();
    const newAccessToken = data.access_token;

    // Store the new access token in localStorage
    localStorage.setItem('access_token', newAccessToken);

    return newAccessToken;
  } catch (error) {
    console.error('Error refreshing access token:', error);
    return null;
  }
};

// Global function to make API requests with auto token refresh
export const apiRequest = async (url, options = {}) => {
  let accessToken = localStorage.getItem('access_token');
  
  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${accessToken}`,
  };

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    // Access token might be expired, try to refresh it
    const newAccessToken = await refreshAccessToken();
    
    if (newAccessToken) {
      // Retry the original request with the new token
      headers['Authorization'] = `Bearer ${newAccessToken}`;
      const retryResponse = await fetch(url, { ...options, headers });
      return retryResponse;
    }
  }

  return response;
};
