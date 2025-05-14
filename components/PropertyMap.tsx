// src/components/PropertyMap.tsx
import React, { useEffect, useRef } from 'react';
import { Property } from '@/types';

interface PropertyMapProps {
  properties: Property[];
  selectedProperty?: Property;
  onSelectProperty?: (property: Property) => void;
}

const PropertyMap: React.FC<PropertyMapProps> = ({ properties, selectedProperty, onSelectProperty }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    // Load Google Maps script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = initMap;

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (mapInstanceRef.current && properties.length > 0) {
      updateMarkers();
    }
  }, [properties, selectedProperty]);

  const initMap = () => {
    if (!window.google || !mapRef.current) return;

    // Default map center (can be adjusted based on user location or property locations)
    const center = { lat: 28.6139, lng: 77.2090 }; // New Delhi coordinates

    mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
      zoom: 12,
      center,
    });

    updateMarkers();
  };

  const updateMarkers = () => {
    if (!window.google || !mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Add markers for each property
    properties.forEach(property => {
      const position = {
        lat: property.location.latitude,
        lng: property.location.longitude
      };

      const marker = new window.google.maps.Marker({
        position,
        map: mapInstanceRef.current,
        title: property.title,
        icon: selectedProperty?._id === property._id 
          ? 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'  // Highlighted marker for selected property
          : 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'   // Default marker
      });

      marker.addListener('click', () => {
        if (onSelectProperty) {
          onSelectProperty(property);
        }
      });

      markersRef.current.push(marker);
    });

    // Fit map to show all markers if there are properties
    if (properties.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      markersRef.current.forEach(marker => bounds.extend(marker.getPosition()));
      mapInstanceRef.current.fitBounds(bounds);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-1">
      <div ref={mapRef} className="w-full h-96 rounded-lg"></div>
      <p className="text-xs text-gray-500 mt-2 text-center">
        Click on markers to view property details
      </p>
    </div>
  );
};

export default PropertyMap;