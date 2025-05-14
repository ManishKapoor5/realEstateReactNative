/**
 * Component for displaying and managing user properties
 */
import React from 'react';
import useProperties from './useProperties'
import { useAuthStore } from '../store/authStore';
//import { Property } from '../services/api';

const MyPropertiesPage: React.FC = () => {
  const { user } = useAuthStore();
  const { properties, loading, error, fetchProperties } = useProperties();

  // Handle refresh button click
  const handleRefresh = (): void => {
    fetchProperties();
  };

  if (loading) {
    return <div className="loading">Loading your properties...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={handleRefresh}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="properties-page">
      <h1>My Properties</h1>
      
      <div className="user-info">
        <p>Logged in as: {user?.fullName || 'Unknown User'}</p>
        <button onClick={handleRefresh}>Refresh Properties</button>
      </div>
      
      {properties.length === 0 ? (
        <div className="no-properties">
          <p>You don't have any properties listed yet.</p>
          <button onClick={() => window.location.href = '/add-property'}>
            Add Your First Property
          </button>
        </div>
      ) : (
        <div className="properties-list">
          {properties.map((property) => (
            <div key={property._id} className="property-card">
              <h3>{property.title}</h3>
              <p>{property.description}</p>
              <p className="price">${property.price}</p>
              {/* Add more property details as needed */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPropertiesPage;