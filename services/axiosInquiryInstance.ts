import axios from 'axios';

// Create an axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://realestatesite-backend.onrender.com/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include auth token in all requests
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // If token exists, add it to the authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle unauthorized errors (401)
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login if needed
      localStorage.removeItem('token');
      
      // If using React Router, you could redirect here
      // window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;