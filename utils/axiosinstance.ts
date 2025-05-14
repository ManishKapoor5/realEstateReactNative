import axios from "axios";

// Create instance
const axiosInstance = axios.create({
  baseURL: "https://your-api.com/api",
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      // handle token refresh logic here if needed
      console.log("Unauthorized! Token might be expired.");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
