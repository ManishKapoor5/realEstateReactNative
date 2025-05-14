// src/pages/NearbyProperties.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-native';

const NearbyProperties = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'buyer') {
      alert('Only buyers can view nearby properties.');
      navigate('/login');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await axios.get(`https://realestatesite-backend.onrender.com/api/v1/Property/nearby?lat=${latitude}&lng=${longitude}`);
          setProperties(res.data);
        } catch (err) {
          console.error(err);
          alert('Failed to fetch properties nearby.');
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        alert('Please enable location to view nearby properties.');
        setLoading(false);
      }
    );
  }, [user, navigate]);

  if (loading) return <div className="text-center py-10">Loading properties...</div>;

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Nearby Properties</h2>
      {properties.length === 0 ? (
        <p>No properties found near your location.</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {properties.map((prop: any) => (
            <div key={prop._id} className="border rounded-xl shadow p-4">
              <img src={prop.images[0]} alt="Property" className="w-full h-40 object-cover rounded mb-2" />
              <h3 className="font-semibold text-lg">{prop.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{prop.location.address}, {prop.location.city}</p>
              <p className="text-green-700 font-bold mb-1">
                ₹{Number(prop.price).toLocaleString()}
              </p>
              <p className="text-sm">{prop.features.bedrooms} BHK • {prop.features.bathrooms} Bath • {prop.features.area} sqft</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NearbyProperties;
