import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Image,
  Platform,
  PixelRatio,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import axiosInstance from '../services/axiosInstance';
import axios from 'axios';

// Define the Property interface
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
  images: string[];
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

// Define props interface for the PropertyCard component
interface PropertyCardProps {
  property: Property;
  onViewDetails: () => void;
  cardWidth: number;
}

// Function to get screen dimensions that works consistently
const getScreenDimensions = () => {
  const { width, height } = Dimensions.get('window');
  return { width, height };
};

// Fully implemented PropertyCard component with fixed image rendering
const PropertyCard: React.FC<PropertyCardProps> = React.memo(({ property, onViewDetails, cardWidth }) => {
  // Use a placeholder image that will definitely work
  const defaultImage = 'https://via.placeholder.com/300x200/e1e1e1/969696?text=Property';
  
  // Format the location string
  const locationString = [
    property.location?.city,
    property.location?.state,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <View style={[styles.card, { width: cardWidth - 16 }]}>
      <View style={styles.imageContainer}>
        {/* Use only URI source instead of require for dynamic rendering */}
        <Image 
          source={{ uri: property.images && property.images.length > 0 
            ? property.images[0] 
            : defaultImage 
          }}
          style={styles.cardImage}
          /* Remove the defaultSource that's causing the error */
          resizeMode="cover"
        />
        {property.isNew && (
          <View style={styles.newTag}>
            <Text style={styles.newTagText}>NEW</Text>
          </View>
        )}
      </View>
      
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={1}>{property.title}</Text>
        <Text style={styles.cardPrice}>
          ${typeof property.price === 'string' 
            ? parseFloat(property.price).toLocaleString() 
            : '0'}
        </Text>
        
        <Text style={styles.cardLocation} numberOfLines={2}>
          {locationString || 'Location not available'}
        </Text>
        
        <View style={styles.featuresRow}>
          <View style={styles.featureItem}>
            <Icon name="home" size={16} color="#6B7280" />
            <Text style={styles.featureText}>{property.propertyType || 'Property'}</Text>
          </View>
          
          <View style={styles.featureItem}>
            <Icon name="bed" size={16} color="#6B7280" />
            <Text style={styles.featureText}>{property.bedrooms || 0} Beds</Text>
          </View>
          
          <View style={styles.featureItem}>
            <Icon name="droplet" size={16} color="#6B7280" />
            <Text style={styles.featureText}>{property.bathrooms || 0} Baths</Text>
          </View>
        </View>
        
        {/* <TouchableOpacity 
          style={styles.cardButton} 
          onPress={onViewDetails}
          activeOpacity={0.8}
        >
          <Text style={styles.cardButtonText}>View Details</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
});

// Define types for navigation
type NavigationProp = {
  navigate: (screen: string, params?: any) => void;
};

const FeaturedProperties: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [dimensions, setDimensions] = useState(getScreenDimensions());
  const navigation = useNavigation<NavigationProp>();
  const flatListRef = useRef<FlatList<Property>>(null);
  const [property, setProperty] = useState<Property | null>(null);
const route = useRoute<any>();
 const { id } = route.params || {};
  // Calculate how many cards to show per screen based on screen width
  const getCardsPerScreen = useCallback(() => {
    const { width } = dimensions;
    if (width < 400) return 1;
    if (width < 768) return 2;
    return 3;
  }, [dimensions]);

  const cardsPerScreen = getCardsPerScreen();
  const cardWidth = dimensions.width / cardsPerScreen;

  // useEffect(() => {
  //     const fetchIndividualProperty = async () => {
  //       try {
  //         setLoading(true);
  //         const response = await axios.get(`https://realestatesite-backend.onrender.com/api/v1/Property/getby/${id}`);
  //         const data = response.data;
  
  //         if (!data.success || !data.property) {
  //           throw new Error('Property not found or invalid response');
  //         }
  
  //         const apiProperty = data.property;
  
  //         const formattedProperty: Property = {
  //           _id: apiProperty._id || '',
  //           title: apiProperty.title || '',
  //           location: {
  //             address: apiProperty.location?.address || '',
  //             city: apiProperty.location?.city || '',
  //             state: apiProperty.location?.state || '',
  //             country: apiProperty.location?.country || '',
  //             postalCode: apiProperty.location?.postalCode || '',
  //             latitude: apiProperty.geo?.coordinates?.[0] || 0,
  //             longitude: apiProperty.geo?.coordinates?.[1] || 0,
  //           },
  //           price: apiProperty.price?.toString() || '0',
  //           bedrooms: apiProperty.features?.bedrooms || 0,
  //           bathrooms: apiProperty.features?.bathrooms || 0,
  //           area: apiProperty.area || apiProperty.size || apiProperty.features?.area?.toString() || '0',
  //           size: apiProperty.size || apiProperty.area || apiProperty.features?.area?.toString() || '0',
  //           images: Array.isArray(apiProperty.images) ? apiProperty.images : apiProperty.images ? [apiProperty.images] : [],
  //           status: apiProperty.status || '',
  //           features: {
  //             parking: apiProperty.features?.parking || false,
  //             furnished: apiProperty.features?.furnished || false,
  //             bedrooms: apiProperty.features?.bedrooms || 0,
  //             bathrooms: apiProperty.features?.bathrooms || 0,
  //             area: apiProperty.features?.area || 0,
  //           },
  //           propertyType: apiProperty.type || '',
  //           type: apiProperty.type || '',
  //           owner: {
  //             name: apiProperty.owner?.name || '',
  //             email: apiProperty.owner?.email || '',
  //             contact: apiProperty.owner?.contact || '',
  //           },
  //           description: apiProperty.description || '',
  //           isNew: apiProperty.isNew || false,
  //           isVerified: apiProperty.isVerified || false,
  //         };
  
  //         setProperty(formattedProperty);
  //         setError(null);
  //       } catch (err) {
  //         console.error('Error fetching property:', err);
  //         setError(err instanceof Error ? err.message : 'Failed to fetch property details');
  //         setProperty(null);
  //       } finally {
  //         setLoading(false);
  //       }
  //     };
  
  //     fetchIndividualProperty();
  //   }, [id]);
  
  // Update dimensions when screen size changes
  
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions(getScreenDimensions());
    };

    const dimensionsHandler = Dimensions.addEventListener('change', updateDimensions);

    return () => {
      if (typeof dimensionsHandler?.remove === 'function') {
        dimensionsHandler.remove();
      }
    };
  }, []);

  // Interface for API response
  interface PropertyApiResponse {
    data: {
      data: any[];
      [key: string]: any;
    };
    [key: string]: any;
  }

  // Fetch properties from API
  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get<PropertyApiResponse>('/Property/getFrontPageAllProperties');
      
      if (!response || !response.data) {
        throw new Error('No response from server');
      }
      
      // Debug: Check what data we're getting
      console.log('API Response:', JSON.stringify(response.data));
      
      const data = response.data;
      const propertiesData = Array.isArray(data.data) ? data.data : [];
      
      // Format and normalize the data
      const formattedProperties: Property[] = propertiesData.map(item => ({
        _id: item._id || item.id || `temp-${Math.random()}`,
        title: item.title || 'Untitled Property',
        location: {
          address: item.location?.address || '',
          city: item.location?.city || '',
          state: item.location?.state || '',
          country: item.location?.country || '',
          postalCode: item.location?.postalCode || '',
          latitude: item.location?.latitude || 0,
          longitude: item.location?.longitude || 0,
        },
        price: item.price?.toString() || '0',
        bedrooms: Number(item.bedrooms || item.features?.bedrooms || 0),
        bathrooms: Number(item.bathrooms || item.features?.bathrooms || 0),
        area: item.area?.toString() || item.size?.toString() || '0',
        size: item.size?.toString() || item.area?.toString() || '0',
        images: Array.isArray(item.images) 
          ? item.images.filter((img: any) => !!img) // Filter out empty values 
          : item.images 
            ? [item.images] 
            : [],
        status: item.status || 'Available',
        features: {
          parking: Boolean(item.features?.parking),
          furnished: Boolean(item.features?.furnished),
          bedrooms: Number(item.features?.bedrooms || item.bedrooms || 0),
          bathrooms: Number(item.features?.bathrooms || item.bathrooms || 0),
          area: Number(item.features?.area || 0),
        },
        propertyType: item.propertyType || item.type || 'Residential',
        type: item.type || item.propertyType || 'Residential',
        owner: {
          name: item.owner?.name || '',
          email: item.owner?.email || '',
          contact: item.owner?.contact || '',
        },
        description: item.description || '',
        isNew: Boolean(item.isNew),
        isVerified: Boolean(item.isVerified),
        approval: item.approval || 'pending',
      }));
      
      // Debug: Check formatted properties
      console.log('Formatted Properties:', JSON.stringify(formattedProperties.slice(0, 1)));
      
      setProperties(formattedProperties);
      setError(null);
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch properties');
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const totalPages = Math.max(1, Math.ceil(properties.length / cardsPerScreen));

  // Handle navigation to property details
  const handleViewDetails = (property: Property) => {
    navigation.navigate('Property', { propertyId: property._id });
  };

  // Handle page changes when user scrolls
  const handleScroll = (event: { nativeEvent: { contentOffset: { x: number }, layoutMeasurement: { width: number } } }) => {
    const { contentOffset, layoutMeasurement } = event.nativeEvent;
    const pageNum = Math.floor(contentOffset.x / layoutMeasurement.width);
    if (pageNum >= 0 && pageNum < totalPages) {
      setCurrentPage(pageNum);
    }
  };

  // Manually navigate to a specific page
  const goToPage = (pageIndex: number) => {
    if (flatListRef.current && pageIndex >= 0 && pageIndex < totalPages) {
      flatListRef.current.scrollToOffset({ 
        offset: pageIndex * dimensions.width, 
        animated: true 
      });
      setCurrentPage(pageIndex);
    }
  };

  // Create mock data if needed (for testing)
  const mockProperties: Property[] = [
    {
      _id: '1',
      title: 'Luxury Apartment',
      location: {
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        country: 'USA',
        postalCode: '10001',
        latitude: 40.7128,
        longitude: -74.006,
      },
      price: '550000',
      bedrooms: 3,
      bathrooms: 2,
      area: '1500',
      size: '1500',
      images: ['https://via.placeholder.com/800x600/2563eb/ffffff?text=Luxury+Apartment'],
      status: 'Available',
      features: {
        parking: true,
        furnished: true,
        bedrooms: 3,
        bathrooms: 2,
        area: 1500,
      },
      propertyType: 'Apartment',
      type: 'Sale',
      owner: {
        name: 'John Doe',
        email: 'john@example.com',
        contact: '555-123-4567',
      },
      description: 'Beautiful luxury apartment in the heart of the city.',
      isNew: true,
      isVerified: true,
    },
    {
      _id: '2',
      title: 'Modern Villa',
      location: {
        address: '456 Park Ave',
        city: 'Los Angeles',
        state: 'CA',
        country: 'USA',
        postalCode: '90001',
        latitude: 34.0522,
        longitude: -118.2437,
      },
      price: '1200000',
      bedrooms: 5,
      bathrooms: 4,
      area: '3200',
      size: '3200',
      images: ['https://via.placeholder.com/800x600/10b981/ffffff?text=Modern+Villa'],
      status: 'Available',
      features: {
        parking: true,
        furnished: false,
        bedrooms: 5,
        bathrooms: 4,
        area: 3200,
      },
      propertyType: 'Villa',
      type: 'Sale',
      owner: {
        name: 'Jane Smith',
        email: 'jane@example.com',
        contact: '555-987-6543',
      },
      description: 'Stunning modern villa with pool and garden.',
      isNew: false,
      isVerified: true,
    },
    {
      _id: '3',
      title: 'Cozy Studio',
      location: {
        address: '789 Broadway',
        city: 'Chicago',
        state: 'IL',
        country: 'USA',
        postalCode: '60007',
        latitude: 41.8781,
        longitude: -87.6298,
      },
      price: '250000',
      bedrooms: 1,
      bathrooms: 1,
      area: '600',
      size: '600',
      images: ['https://via.placeholder.com/800x600/f59e0b/ffffff?text=Cozy+Studio'],
      status: 'Available',
      features: {
        parking: false,
        furnished: true,
        bedrooms: 1,
        bathrooms: 1,
        area: 600,
      },
      propertyType: 'Studio',
      type: 'Rent',
      owner: {
        name: 'Mike Johnson',
        email: 'mike@example.com',
        contact: '555-789-0123',
      },
      description: 'Cozy downtown studio, perfect for young professionals.',
      isNew: true,
      isVerified: false,
    },
  ];

  // Fallback to mock data if no real data available
  const displayProperties = properties.length > 0 ? properties : mockProperties;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Loading properties...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <View style={styles.errorCard}>
          <Icon name="alert-circle" size={36} color="#B91C1C" />
          <Text style={styles.errorTitle}>Unable to load properties</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchProperties}
          >
            <Text style={styles.retryButtonText}>Try again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (displayProperties.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.sectionTitle}>Featured Properties</Text>
        <Text style={styles.emptyText}>
          No properties currently available. Check back soon!
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Featured Properties</Text>
      <Text style={styles.sectionSubtitle}>
        Explore our handpicked premium properties in top locations
      </Text>

      {/* FlatList with fixed dimensions and horizontal paging */}
      <FlatList
        ref={flatListRef}
        data={displayProperties}
        keyExtractor={(item) => item._id.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        getItemLayout={(data, index) => ({
          length: dimensions.width,
          offset: dimensions.width * index,
          index,
        })}
        snapToInterval={dimensions.width}
        decelerationRate="fast"
        snapToAlignment="start"
        contentContainerStyle={{ paddingHorizontal: 0 }}
        renderItem={({ item }) => (
          <View style={{ width: dimensions.width, padding: 8 }}>
            <View style={styles.cardWrapper}>
              <PropertyCard
                property={item}
                onViewDetails={() => handleViewDetails(item)}
                cardWidth={cardWidth}
              />
            </View>
          </View>
        )}
      />

      {/* Pagination dots */}
      {totalPages > 1 && (
        <View style={styles.pagination}>
          {Array.from({ length: totalPages }).map((_, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.paginationDot,
                currentPage === index ? styles.paginationDotActive : null,
              ]}
              onPress={() => goToPage(index)}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F9FAFB',
    paddingVertical: 24,
    paddingHorizontal: 0, // Remove horizontal padding for full-width slider
  },
  cardWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingVertical: 48,
    minHeight: 300,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 8,
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingVertical: 32,
    paddingHorizontal: 16,
    minHeight: 200,
  },
  errorCard: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FEE2E2',
    borderRadius: 8,
    padding: 24,
    maxWidth: 400,
    width: '100%',
    alignItems: 'center',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#B91C1C',
    marginTop: 8,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: '#DC2626',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#DC2626',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  retryButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  emptyContainer: {
    backgroundColor: '#F9FAFB',
    paddingVertical: 32,
    paddingHorizontal: 16,
    alignItems: 'center',
    minHeight: 200,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    maxWidth: 400,
    marginTop: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    height: 380, // Fixed height for consistency
    // Remove fixed width to allow dynamic sizing
  },
  imageContainer: {
    position: 'relative',
    height: 180,
    backgroundColor: '#E5E7EB',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F3F4F6', // Fallback background color
  },
  newTag: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#2563EB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  newTagText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2563EB',
    marginBottom: 8,
  },
  cardLocation: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
    lineHeight: 20,
  },
  featuresRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#6B7280',
  },
  cardButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 8,
  },
  cardButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D1D5DB',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    width: 24,
    backgroundColor: '#2563EB',
  },
});

export default FeaturedProperties;