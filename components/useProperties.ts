/**
 * Custom hook for property management
 */
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore'
import { propertyApi, Property } from '../services/api';
import { isAuthenticated, refreshAccessToken } from '../utils/authUtils';

interface UsePropertiesReturn {
  properties: Property[];
  loading: boolean;
  error: string | null;
  fetchProperties: () => Promise<any>;
  setError: (error: string | null) => void;
}

const useProperties = (): UsePropertiesReturn => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { user } = useAuthStore();

  // Fetch properties function that depends on authentication
  const fetchProperties = useCallback(async () => {
    const { user } = useAuthStore.getState();
    
    if (!user || !user._id) {
      console.error("Cannot fetch properties: User ID is missing");
      setError("User information is incomplete. Please log in again.");
      return;
    }
    
    try {
      setLoading(true);
      console.log("Fetching properties for user:", user._id);
      
      const result = await propertyApi.getSellerProperties(user._id);
      
      // Detailed logging to diagnose the issue
      console.log("API response type:", typeof result);
      console.log("API response structure:", JSON.stringify(result, null, 2).substring(0, 300) + "...");
      
      // Handle different response structures
      if (result && 'data' in result && Array.isArray(result.data)) {
        console.log("Found properties:", result.data.length);
        setProperties(result.data);
      } else if (Array.isArray(result)) {
        console.log("Found properties (array):", result.length);
        setProperties(result);
      } else {
        console.log("Unexpected response format, no properties found");
        setProperties([]);
      }
      
      return result;
    } catch (err: any) {
      console.error("Error fetching properties:", err);
      if (err.response) {
        console.error("Response status:", err.response.status);
        console.error("Response data:", err.response.data);
      }
      setError(err.message || 'Failed to fetch properties');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Authentication check effect
  useEffect(() => {
    const checkAuthAndFetchProperties = async () => {
      setLoading(true);
      
      try {
        // If not authenticated, try to refresh
        if (!isAuthenticated()) {
          try {
            await refreshAccessToken();
            // If refresh was successful, fetch properties
            await fetchProperties();
          } catch (err) {
            // If refresh failed, redirect to login
            setError('Your session has expired. Please log in again.');
            setTimeout(() => {
              navigate('/login');
            }, 2000);
          }
        } else {
          // User IS authenticated - fetch their properties
          await fetchProperties();
        }
      } catch (err) {
        console.error("Auth check error:", err);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuthAndFetchProperties();
  }, [fetchProperties, navigate]);

  // Debug effect to monitor properties changes
  useEffect(() => {
    console.log("Properties state updated - count:", properties.length);
  }, [properties]);

  return {
    properties,
    loading,
    error,
    fetchProperties,
    setError
  };
};

export default useProperties;