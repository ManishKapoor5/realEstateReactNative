// utils/apiRequest.js
import { useAuthStore } from "@/store/authStore";

export const refreshAccessToken = async () => {
  const { refreshToken, setAccessToken } = useAuthStore.getState();

  if (!refreshToken) return null;

  try {
    const res = await fetch(
      "https://realestatesite-backend.onrender.com/api/v1/auth/refresh-token",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken }),
      }
    );

    if (!res.ok) throw new Error("Refresh token failed");

    const data = await res.json();

    if (data.access_token) {
      setAccessToken(data.access_token); // also sets localStorage
      return data.access_token;
    }

    return null;
  } catch (err) {
    console.error("Error refreshing token:", err);
    return null;
  }
};

export const apiRequest = async (url, options = {}) => {
  const { accessToken } = useAuthStore.getState();

  let headers = {
    ...options.headers,
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };

  let response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      headers.Authorization = `Bearer ${newToken}`;
      response = await fetch(url, { ...options, headers });
    }
  }

  return response;
};
