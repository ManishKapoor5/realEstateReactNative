import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Trash } from 'react-native-feather';

// Property interface
interface Property {
  _id: string;
  title: string;
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    latitude: number;
    longitude: number;
  };
  price: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  size: string;
  images: string | string[];
  status: string;
  features: {
    parking: boolean;
    furnished: boolean;
    bedrooms: number;
    bathrooms: number;
    area?: number;
  };
  propertyType: string;
  type: string;
  owner: {
    name: string;
    email: string;
    contact: string;
  };
  description: string;
  isNew?: boolean;
  isVerified?: boolean;
  approval?: string;
  createdAt?: string;
}

interface PropertyCardProps {
  property: Property;
  title: string;
  price: number;
  location: string;
  showDetailedView?: boolean;
  onViewDetails?: (property: Property) => void;
  onDelete?: (id: string) => void;
  viewMode?: 'grid' | 'list';
}

const { width } = Dimensions.get('window');

const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  showDetailedView = false,
  onViewDetails,
  onDelete,
  viewMode = 'grid',
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  const images = Array.isArray(property.images) ? property.images : [property.images].filter(Boolean);

  useEffect(() => {
    if (showDetailedView && images.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [images.length, showDetailedView]);

  const handleCardPress = () => {
    if (onViewDetails) {
      onViewDetails(property);
    }
  };

  // Calculate card width based on view mode
  const getCardWidth = () => {
    if (viewMode === 'list') {
      return width - 32; // Full width for list mode with some padding
    }
    
    // Grid mode
    if (width < 600) {
      return width - 32; // Full width for small devices
    } else if (width < 900) {
      return (width - 48) / 2; // 2 columns for medium devices
    } else {
      return (width - 64) / 3; // 3 columns for large devices
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, { width: getCardWidth() }]}
      onPress={handleCardPress}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ 
            uri: imageError || !images[currentImageIndex] 
              ? 'https://via.placeholder.com/600x400' 
              : images[currentImageIndex] 
          }}
          style={styles.image}
          onError={() => setImageError(true)}
        />
      </View>
      <Text style={styles.title} numberOfLines={1}>{property.title}</Text>
      <Text style={styles.location} numberOfLines={1}>{property.location.address}</Text>
      <Text style={styles.price}>₹{parseFloat(property.price).toLocaleString()}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 12,
    margin: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  imageContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 8,
  },
  image: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 4,
  },
  location: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#059669',
    marginTop: 4,
  },
});

export default PropertyCard;