import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Modal, ActivityIndicator, Dimensions, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Feather'; // Using Feather icons as a substitute for lucide-react
import { useAuthStore } from '../store/authStore';
import { useLimitConfigStore } from '../store/limitConfigStore';
import { Property, TierLimit } from '../types';

const { width } = Dimensions.get('window');

interface ApiResponse {
  success: boolean;
  property: Property;
}

const PropertyDetailPage: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { id } = route.params || {};
  const { user, isAuthenticated } = useAuthStore();
  const { limitConfig, fetchLimitConfig } = useLimitConfigStore();

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [viewRecorded, setViewRecorded] = useState(false);

  // Fetch property data
  const { data, isLoading, error } = useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      if (!id) throw new Error('Property ID is required');
      const response = await axios.get<ApiResponse>(`https://realestatesite-backend.onrender.com/api/v1/Property/getby/${id}`);
      return response.data;
    },
    enabled: !!id,
    retry: 1,
  });

  const property = data?.property;

  // Fetch limit config on mount
  useEffect(() => {
    fetchLimitConfig();
  }, [fetchLimitConfig]);

  // Check view limits when property data is loaded and user is authenticated
  useEffect(() => {
    if (property && isAuthenticated && user && !viewRecorded) {
      checkAndRecordView();
    }
  }, [property, isAuthenticated, user, viewRecorded]);

  const checkAndRecordView = async () => {
    try {
      if (!user || viewRecorded || !id) return;

      const response = await axios.post('/api/property-views/check', {
        propertyId: id,
      });

      const { canView } = response.data;

      if (!canView) {
        setShowUpgradeModal(true);
      } else {
        await axios.post('/api/property-views', {
          propertyId: id,
        });
        setViewRecorded(true);
      }
    } catch (error) {
      console.error('Error checking view limits:', error);
      setViewRecorded(true);
    }
  };

  const handleUpgradeTier = (tierId: string) => {
    navigation.navigate('UpgradeTier', { tierId });
  };

  const handleJoinWaitlist = async () => {
    try {
      if (!id) {
        throw new Error('Property ID is required');
      }

      await axios.post('/api/waitlist', {
        propertyId: id,
      });

      Alert.alert('Success', 'You have been added to the waitlist for this property!', [
        { text: 'OK', onPress: () => setShowUpgradeModal(false) },
      ]);
    } catch (error) {
      console.error('Error joining waitlist:', error);
      Alert.alert('Error', 'Failed to join waitlist. Please try again.', [
        { text: 'OK' },
      ]);
    }
  };

  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    if (isNaN(numPrice)) return 'Price not available';

    if (numPrice >= 10000000) {
      return `₹${(numPrice / 10000000).toFixed(2)} Cr`;
    } else if (numPrice >= 100000) {
      return `₹${(numPrice / 100000).toFixed(2)} Lac`;
    } else {
      return `₹${numPrice.toLocaleString()}`;
    }
  };

  const getPropertyType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const getStatusBadge = (status: string) => {
    const statusStyles: Record<string, { backgroundColor: string; color: string }> = {
      available: { backgroundColor: '#DCFCE7', color: '#166534' },
      sold: { backgroundColor: '#FEE2E2', color: '#991B1B' },
      rented: { backgroundColor: '#DBEAFE', color: '#1E40AF' },
    };

    const style = statusStyles[status] || { backgroundColor: '#F3F4F6', color: '#1F2937' };

    return (
      <View style={[styles.statusBadge, style]}>
        <Text style={[styles.statusText, { color: style.color }]}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Text>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  if (error || !property) {
    return (
      <View style={styles.errorContainer}>
        <View style={styles.errorCard}>
          <View style={styles.errorHeader}>
            <Icon name="alert-circle" size={24} color="#DC2626" style={styles.errorIcon} />
            <Text style={styles.errorTitle}>Property Not Found</Text>
          </View>
          <Text style={styles.errorMessage}>
            The property you're looking for doesn't exist or has been removed.
          </Text>
          <TouchableOpacity
            style={styles.errorButton}
            onPress={() => navigation.navigate('Properties')}
          >
            <Text style={styles.errorButtonText}>Back to Properties</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (showUpgradeModal && limitConfig) {
    return (
      <Modal visible={showUpgradeModal} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>View Limit Reached</Text>
          <Text style={styles.modalMessage}>
            You've reached your property view limit for this tier.
          </Text>
          {limitConfig.tiers.map((tier: TierLimit) => (
            <TouchableOpacity
              key={tier.id}
              style={styles.tierButton}
              onPress={() => handleUpgradeTier(tier.id)}
            >
              <Text style={styles.tierButtonText}>Upgrade to {tier.name}</Text>
            </TouchableOpacity>
          ))}
          {limitConfig.allowWaitlist && (
            <TouchableOpacity style={styles.waitlistButton} onPress={handleJoinWaitlist}>
              <Text style={styles.waitlistButtonText}>Join Waitlist</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowUpgradeModal(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{property.title}</Text>
          <View style={styles.locationContainer}>
            <Icon name="map-pin" size={20} color="#4B5563" />
            <Text style={styles.locationText}>
              {property.location.address}, {property.location.city}, {property.location.state},{' '}
              {property.location.country} - {property.location.postalCode}
            </Text>
          </View>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>{formatPrice(property.price)}</Text>
          {getStatusBadge(property.status)}
        </View>
      </View>

      {/* Property Images */}
      <View style={styles.imageSection}>
        <Image
          source={{ uri: (typeof property.images?.[0] === 'string' ? property.images[0] : property.images?.[0]?.uri) || 'https://via.placeholder.com/800x600' }}
          style={styles.mainImage}
          resizeMode="cover"
        />
        <View style={styles.thumbnailContainer}>
          {[1, 2, 3, 4].map((index) => (
            <Image
              key={index}
              source={{
                uri: (typeof property.images?.[index] === 'string' ? property.images[index] : property.images?.[index]?.uri) || 'https://via.placeholder.com/400x300',
              }}
              style={styles.thumbnail}
              resizeMode="cover"
            />
          ))}
        </View>
      </View>

      {/* Property Details */}
      <View style={styles.detailsContainer}>
        <View style={styles.overviewCard}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.overviewGrid}>
            <View style={styles.overviewItem}>
              <Icon name="home" size={24} color="#2563EB" />
              <Text style={styles.overviewLabel}>Type</Text>
              <Text style={styles.overviewValue}>{getPropertyType(property.type)}</Text>
            </View>
            <View style={styles.overviewItem}>
              <Icon name="bed" size={24} color="#2563EB" />
              <Text style={styles.overviewLabel}>Bedrooms</Text>
              <Text style={styles.overviewValue}>{property.features.bedrooms}</Text>
            </View>
            <View style={styles.overviewItem}>
              <Icon name="bath" size={24} color="#2563EB" />
              <Text style={styles.overviewLabel}>Bathrooms</Text>
              <Text style={styles.overviewValue}>{property.features.bathrooms}</Text>
            </View>
            <View style={styles.overviewItem}>
              <Icon name="square" size={24} color="#2563EB" />
              <Text style={styles.overviewLabel}>Area</Text>
              <Text style={styles.overviewValue}>{property.features.area ? `${property.features.area} sq.ft` : 'N/A'}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{property.description}</Text>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Features</Text>
          <View style={styles.featuresGrid}>
            <View style={styles.featureItem}>
              <Icon
                name={property.features.parking ? 'check' : 'x'}
                size={20}
                color={property.features.parking ? '#22C55E' : '#EF4444'}
              />
              <Text style={styles.featureText}>Parking</Text>
            </View>
            <View style={styles.featureItem}>
              <Icon
                name={property.features.furnished ? 'check' : 'x'}
                size={20}
                color={property.features.furnished ? '#22C55E' : '#EF4444'}
              />
              <Text style={styles.featureText}>Furnished</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Location</Text>
          {/* <View style={styles.mapPlaceholder}>
            {/* <Icon name="map" size={48} color="#9CA3AF" /> */}
            {/* <Text style={styles.mapPlaceholderText}>
              Map view at {property.location.latitude}, {property.location.longitude}
            </Text> */}
          {/* </View> */}

          <View style={styles.locationGrid}>
            <View style={styles.locationItem}>
              <Text style={styles.locationLabel}>Address</Text>
              <Text style={styles.locationValue}>{property.location.address}</Text>
            </View>
            <View style={styles.locationItem}>
              <Text style={styles.locationLabel}>City</Text>
              <Text style={styles.locationValue}>{property.location.city}</Text>
            </View>
            <View style={styles.locationItem}>
              <Text style={styles.locationLabel}>State</Text>
              <Text style={styles.locationValue}>{property.location.state}</Text>
            </View>
            <View style={styles.locationItem}>
              <Text style={styles.locationLabel}>Country</Text>
              <Text style={styles.locationValue}>{property.location.country}</Text>
            </View>
            <View style={styles.locationItem}>
              <Text style={styles.locationLabel}>Postal Code</Text>
              <Text style={styles.locationValue}>{property.location.postalCode}</Text>
            </View>
          </View>
        </View>


        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Property Info</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Status</Text>
              <Text style={styles.infoValue}>{property.status}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Approval</Text>
              <Text style={styles.infoValue}>{property.approval || 'N/A'}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Listed On</Text>
              <Text style={styles.infoValue}>
                {property.createdAt ? new Date(property.createdAt).toLocaleDateString() : 'N/A'}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Property ID</Text>
              <Text style={styles.infoValue}>{property._id.substring(0, 8)}...</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 16,
    color: '#4B5563',
    marginLeft: 4,
  },
  priceContainer: {
    alignItems: 'flex-end',
    marginTop: 8,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginTop: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  imageSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  mainImage: {
    width: width - 32,
    height: 240,
    borderRadius: 8,
    marginBottom: 8,
  },
  thumbnailContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  thumbnail: {
    width: (width - 40) / 2,
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  detailsContainer: {
    paddingHorizontal: 16,
  },
  overviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  overviewItem: {
    width: '25%',
    alignItems: 'center',
    marginBottom: 16,
  },
  overviewLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  overviewValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 16,
  },
  description: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 8,
  },
  mapPlaceholder: {
    height: 200,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 12,
  },
  mapPlaceholderText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  locationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  locationItem: {
    width: '50%',
    marginBottom: 12,
  },
  locationLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  locationValue: {
    fontSize: 14,
    color: '#374151',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoGrid: {
    flexDirection: 'column',
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorCard: {
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FECACA',
    maxWidth: 400,
    width: '100%',
  },
  errorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  errorIcon: {
    marginRight: 8,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#991B1B',
  },
  errorMessage: {
    fontSize: 14,
    color: '#DC2626',
    marginBottom: 16,
  },
  errorButton: {
    backgroundColor: '#FEE2E2',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  errorButtonText: {
    fontSize: 14,
    color: '#B91C1C',
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  modalMessage: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 16,
    textAlign: 'center',
  },
  tierButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
    marginBottom: 12,
    width: '80%',
    alignItems: 'center',
  },
  tierButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  waitlistButton: {
    backgroundColor: '#10B981',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
    marginBottom: 12,
    width: '80%',
    alignItems: 'center',
  },
  waitlistButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  closeButton: {
    backgroundColor: '#E5E7EB',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
    width: '80%',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
});

export default PropertyDetailPage;