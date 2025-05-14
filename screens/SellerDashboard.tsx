import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Platform,
  Alert,
  Dimensions,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  FlatList,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons, Feather } from '@expo/vector-icons';
import axiosInstance from '../services/axiosInstance';
import { useAuthStore } from '../store/authStore';
import PropertyForm from '../components/PropertyForm';
import { RootStackParamList } from '../types/index';
import { useToast } from '../hooks/use-toast';

// --- Interfaces ---
interface Location {
  address: string;
  city: string;
  state: string;
  country: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

interface Property {
  _id: string;
  title: string;
  type: string;
  price: number | string;
  location: Location;
  status: string;
  approval: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  features?: string[];
  description?: string;
  images?: string[];
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

// --- Analytics tracking function ---
const trackEvent = (event: string, data: Record<string, any>) => {
  console.log(`Analytics: ${event}`, data);
};

// --- Device dimensions for responsive design ---
const { width } = Dimensions.get('window');
const isSmallDevice = width < 375;

type SellerDashboardNavigationProp = StackNavigationProp<RootStackParamList, 'SellerDashboard'>;

// --- Utility: Format price for display ---
const formatPrice = (price: string | number) => {
  const num = typeof price === 'string' ? parseInt(price, 10) : price;
  if (isNaN(num)) return '';
  return `₹${num.toLocaleString('en-IN')}`;
};

// --- Default placeholder image ---
const DEFAULT_IMAGE = 'https://via.placeholder.com/300x200/e2e8f0/64748b?text=No+Image';

const SellerDashboard: React.FC = () => {
  // --- State variables ---
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'properties' | 'add' | 'rejected'>('properties');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'sold'>('all');
  const [approvalFilter, setApprovalFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const [sortBy, setSortBy] = useState<'price' | 'date'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [imageLoadErrors, setImageLoadErrors] = useState<Record<string, boolean>>({});

  const navigation = useNavigation<SellerDashboardNavigationProp>();
  const { showToast } = useToast();
  const { isAuthenticated, accessToken, user, refreshToken } = useAuthStore();

  // --- Location permissions (simulated for demo) ---
  useEffect(() => {
    const requestLocation = async () => {
      try {
        if (Platform.OS === 'android' || Platform.OS === 'ios') {
          setUserLocation({ latitude: 28.6139, longitude: 77.2090 });
          trackEvent('Geolocation Success', { latitude: 28.6139, longitude: 77.2090 });
        }
      } catch (err: any) {
        console.error('Geolocation error:', err);
        setError('Failed to get your location. You can still add properties without location data.');
        showToast('error', 'Geolocation Error', 'Unable to retrieve location.');
        trackEvent('Geolocation Error', { error: err.message });
      }
    };
    requestLocation();
  }, []);

  // --- Authentication & fetch properties ---
  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated) {
        navigation.navigate('Login');
        return;
      }
      await fetchProperties();
      setLoading(false);
    };
    checkAuth();
  }, [isAuthenticated, accessToken, navigation, page, filterStatus, approvalFilter, sortBy, sortOrder, searchQuery]);

  // --- Fetch properties from API ---
  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      if (!accessToken) throw new Error('Authentication token missing');
      const params = {
        page,
        limit: 9,
        status: filterStatus === 'all' ? undefined : filterStatus,
        approvalStatus: approvalFilter === 'all' ? undefined : approvalFilter,
        sortBy,
        sortOrder,
        search: searchQuery || undefined,
      };
      const response = await axiosInstance.get(`/Property/properties/seller/${user?._id}`, { params });
      const { data, totalPages: total } = response.data;
      setProperties(data || []);
      setTotalPages(total || 1);
      trackEvent('Fetch Properties Success', { userId: user?._id, page, count: data?.length });
    } catch (err: any) {
      console.error('❌ API call failed:', err);
      if (err.response?.status === 401) {
        try {
          await refreshToken;
          await fetchProperties();
        } catch (refreshErr) {
          setError('Session expired. Please log in again.');
          navigation.navigate('Login');
          showToast('error', 'Authentication Error', 'Session expired.');
        }
      } else {
        setError(err.message || 'Failed to fetch properties');
        showToast('error', 'Error', err.message || 'Failed to fetch properties');
      }
      trackEvent('Fetch Properties Error', { error: err.message });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [accessToken, user?._id, page, filterStatus, approvalFilter, sortBy, sortOrder, searchQuery, navigation]);

  // --- Pull to refresh ---
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchProperties();
  }, [fetchProperties]);

  // --- Property selection ---
  const handleViewDetails = (property: Property) => {
    setSelectedProperty(property);
    trackEvent('View Property Details', { propertyId: property._id, title: property.title });
  };

  // --- Close property details modal ---
  const handleCloseDetails = () => {
    setSelectedProperty(null);
    trackEvent('Close Property Details', {});
  };

  // --- Delete property ---
  const handleDeleteProperty = async (id: string) => {
    Alert.alert(
      "Delete Property",
      "Are you sure you want to delete this property?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: async () => {
            try {
              const response = await axiosInstance.delete(`/Property/delete/${id}`);
              if (response.status === 200) {
                setProperties((prev) => prev.filter((prop) => prop._id !== id));
                showToast('success', 'Success', 'Property deleted successfully');
                trackEvent('Delete Property Success', { propertyId: id });
              } else {
                throw new Error('Delete failed with status ' + response.status);
              }
            } catch (err: any) {
              console.error('Error deleting property:', err);
              showToast('error', 'Error', 'Failed to delete property');
              trackEvent('Delete Property Error', { propertyId: id, error: err.message });
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  // --- Resubmit rejected property ---
  const handleResubmitProperty = async (property: Property) => {
    try {
      const updatedData = {
        ...property,
        approvalStatus: 'pending',
        rejectionReason: undefined
      };
      const response = await axiosInstance.put(`/Property/update/${property._id}`, updatedData);
      if (response.status === 200) {
        setProperties(properties.map(p =>
          p._id === property._id ? { ...p, approval: 'pending', rejectionReason: undefined } : p
        ));
        showToast('success', 'Success', 'Property resubmitted for approval');
        trackEvent('Resubmit Property', { propertyId: property._id });
        if (activeTab === 'rejected') fetchProperties();
      }
    } catch (err: any) {
      console.error('Error resubmitting property:', err);
      showToast('error', 'Error', 'Failed to resubmit property');
    }
  };

  // --- Pagination ---
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      trackEvent('Change Page', { page: newPage });
    }
  };

  // --- Filtered properties ---
  const getFilteredProperties = () => {
    let filtered = [...properties];
    if (activeTab === 'rejected') {
      filtered = filtered.filter(p => p.approval === 'rejected');
    } else {
      filtered = filtered.filter(p => p.approval !== 'rejected');
      if (approvalFilter !== 'all') filtered = filtered.filter(p => p.approval === approvalFilter);
      if (filterStatus !== 'all') filtered = filtered.filter(p => p.status === filterStatus);
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(query) ||
        p.location.address.toLowerCase().includes(query) ||
        p.location.city.toLowerCase().includes(query)
      );
    }
    return filtered;
  };

  // --- Get property image URL ---
  const getPropertyImage = (property: Property) => {
    // Check if property has images and the first one hasn't had a load error
    if (property.images && property.images.length > 0 && !imageLoadErrors[property._id]) {
      return property.images[0];
    }
    return DEFAULT_IMAGE;
  };

  // --- Handle image load error ---
  const handleImageError = (propertyId: string) => {
    setImageLoadErrors(prev => ({ ...prev, [propertyId]: true }));
  };

  // --- Approval badge ---
  const getApprovalBadge = (approval: string) => {
    switch (approval) {
      case 'approved':
        return { backgroundColor: '#d1fae5', textColor: '#065f46', text: 'Approved' };
      case 'rejected':
        return { backgroundColor: '#fee2e2', textColor: '#991b1b', text: 'Rejected' };
      default:
        return { backgroundColor: '#fef3c7', textColor: '#92400e', text: 'Pending Approval' };
    }
  };

  const filteredProperties = getFilteredProperties();

  // --- Render property item ---
  const renderPropertyItem = ({ item }: { item: Property }) => {
    const badge = getApprovalBadge(item.approval);
    const imageUrl = getPropertyImage(item);
    
    return (
      <TouchableOpacity
        style={styles.propertyCard}
        onPress={() => handleViewDetails(item)}
      >
        {/* Property Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: imageUrl }}
            style={styles.propertyImage}
            onError={() => handleImageError(item._id)}
            resizeMode="cover"
          />
          <View style={[styles.badgeOverlay, { backgroundColor: badge.backgroundColor }]}>
            <Text style={[styles.badgeText, { color: badge.textColor }]}>
              {badge.text}
            </Text>
          </View>
        </View>
        
        <View style={styles.propertyCardContent}>
          <Text style={styles.propertyTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.propertyAddress} numberOfLines={1}>
            {item.location.address}, {item.location.city}
          </Text>
          <Text style={styles.propertyPrice}>
            {formatPrice(item.price)}
          </Text>
          <View style={styles.propertyFeatures}>
            {item.bedrooms && (
              <View style={styles.featureItem}>
                <Ionicons name="bed-outline" size={14} color="#4b5563" />
                <Text style={styles.featureText}>{item.bedrooms} Beds</Text>
              </View>
            )}
            {item.bathrooms && (
              <View style={styles.featureItem}>
                <Ionicons name="water-outline" size={14} color="#4b5563" />
                <Text style={styles.featureText}>{item.bathrooms} Baths</Text>
              </View>
            )}
            {item.area && (
              <View style={styles.featureItem}>
                <Feather name="square" size={14} color="#4b5563" />
                <Text style={styles.featureText}>{item.area} sq.ft</Text>
              </View>
            )}
          </View>
          {item.approval === 'rejected' && item.rejectionReason && (
            <View style={styles.rejectionContainer}>
              <View style={styles.rejectionHeader}>
                <Ionicons name="alert-circle" size={14} color="#b91c1c" />
                <Text style={styles.rejectionTitle}>Rejected Reason:</Text>
              </View>
              <Text style={styles.rejectionText} numberOfLines={2}>
                {item.rejectionReason}
              </Text>
            </View>
          )}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.viewButton}
              onPress={() => handleViewDetails(item)}
            >
              <Text style={styles.viewButtonText}>View Details</Text>
            </TouchableOpacity>
            {item.approval === 'rejected' && (
              <TouchableOpacity
                style={styles.resubmitButton}
                onPress={() => handleResubmitProperty(item)}
              >
                <Feather name="refresh-cw" size={12} color="#2563eb" />
                <Text style={styles.resubmitButtonText}>Resubmit</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteProperty(item._id)}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // --- Render property details modal ---
  const renderPropertyDetailsModal = () => {
    if (!selectedProperty) return null;
    
    const badge = getApprovalBadge(selectedProperty.approval);
    
    return (
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ScrollView>
            {/* Image Gallery */}
            <ScrollView 
              horizontal 
              pagingEnabled 
              showsHorizontalScrollIndicator={false}
              style={styles.imageGallery}
            >
              {selectedProperty.images && selectedProperty.images.length > 0 ? (
                selectedProperty.images.map((img, index) => (
                  <Image
                    key={index}
                    source={{ uri: img }}
                    style={styles.galleryImage}
                    onError={() => {/* Handle error */}}
                    resizeMode="cover"
                  />
                ))
              ) : (
                <Image
                  source={{ uri: DEFAULT_IMAGE }}
                  style={styles.galleryImage}
                  resizeMode="cover"
                />
              )}
            </ScrollView>
            
            {/* Property Details */}
            <View style={styles.modalBody}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{selectedProperty.title}</Text>
                <View style={[styles.badge, { backgroundColor: badge.backgroundColor }]}>
                  <Text style={[styles.badgeText, { color: badge.textColor }]}>
                    {badge.text}
                  </Text>
                </View>
              </View>
              
              <Text style={styles.modalPrice}>
                {formatPrice(selectedProperty.price)}
              </Text>
              
              <Text style={styles.modalAddress}>
                {selectedProperty.location.address}, {selectedProperty.location.city}, {selectedProperty.location.state}
              </Text>
              
              <View style={styles.modalFeatures}>
                {selectedProperty.bedrooms && (
                  <View style={styles.modalFeatureItem}>
                    <Ionicons name="bed-outline" size={18} color="#4b5563" />
                    <Text style={styles.modalFeatureText}>
                      {selectedProperty.bedrooms} Bedrooms
                    </Text>
                  </View>
                )}
                {selectedProperty.bathrooms && (
                  <View style={styles.modalFeatureItem}>
                    <Ionicons name="water-outline" size={18} color="#4b5563" />
                    <Text style={styles.modalFeatureText}>
                      {selectedProperty.bathrooms} Bathrooms
                    </Text>
                  </View>
                )}
                {selectedProperty.area && (
                  <View style={styles.modalFeatureItem}>
                    <Feather name="square" size={18} color="#4b5563" />
                    <Text style={styles.modalFeatureText}>
                      {selectedProperty.area} sq.ft Area
                    </Text>
                  </View>
                )}
                <View style={styles.modalFeatureItem}>
                  <Feather name="home" size={18} color="#4b5563" />
                  <Text style={styles.modalFeatureText}>
                    {selectedProperty.type} Property
                  </Text>
                </View>
                <View style={styles.modalFeatureItem}>
                  <Feather name="tag" size={18} color="#4b5563" />
                  <Text style={styles.modalFeatureText}>
                    Status: {selectedProperty.status}
                  </Text>
                </View>
              </View>
              
              {selectedProperty.description && (
                <View style={styles.descriptionContainer}>
                  <Text style={styles.descriptionTitle}>Description</Text>
                  <Text style={styles.descriptionText}>
                    {selectedProperty.description}
                  </Text>
                </View>
              )}
              
              {selectedProperty.features && selectedProperty.features.length > 0 && (
                <View style={styles.featuresContainer}>
                  <Text style={styles.featuresTitle}>Features</Text>
                  <View style={styles.featuresList}>
                    {selectedProperty.features.map((feature, index) => (
                      <View key={index} style={styles.featureTag}>
                        <Text style={styles.featureTagText}>{feature}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
              
              {selectedProperty.approval === 'rejected' && selectedProperty.rejectionReason && (
                <View style={styles.modalRejectionContainer}>
                  <View style={styles.rejectionHeader}>
                    <Ionicons name="alert-circle" size={16} color="#b91c1c" />
                    <Text style={styles.rejectionTitle}>Rejection Reason:</Text>
                  </View>
                  <Text style={styles.modalRejectionText}>
                    {selectedProperty.rejectionReason}
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
          
          {/* Modal Footer Actions */}
          <View style={styles.modalFooter}>
            {selectedProperty.approval === 'rejected' && (
              <TouchableOpacity
                style={styles.modalResubmitButton}
                onPress={() => {
                  handleResubmitProperty(selectedProperty);
                  handleCloseDetails();
                }}
              >
                <Feather name="refresh-cw" size={16} color="#fff" />
                <Text style={styles.modalResubmitText}>Resubmit Property</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.modalDeleteButton}
              onPress={() => {
                handleDeleteProperty(selectedProperty._id);
                handleCloseDetails();
              }}
            >
              <Feather name="trash-2" size={16} color="#fff" />
              <Text style={styles.modalDeleteText}>Delete Property</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={handleCloseDetails}
            >
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  // --- Render tabs ---
  const renderTabs = () => (
    <View style={styles.tabsContainer}>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'properties' && styles.activeTab]}
        onPress={() => setActiveTab('properties')}
      >
        <Text style={[styles.tabText, activeTab === 'properties' && styles.activeTabText]}>
          My Properties
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'add' && styles.activeTab]}
        onPress={() => setActiveTab('add')}
      >
        <Text style={[styles.tabText, activeTab === 'add' && styles.activeTabText]}>
          Add New
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'rejected' && styles.activeTab]}
        onPress={() => setActiveTab('rejected')}
      >
        <Text style={[styles.tabText, activeTab === 'rejected' && styles.activeTabText]}>
          Rejected
        </Text>
      </TouchableOpacity>
    </View>
  );

  // --- Render property list ---
  const renderPropertiesList = () => (
    <FlatList
      data={filteredProperties}
      keyExtractor={(item) => item._id}
      renderItem={renderPropertyItem}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      ListEmptyComponent={
        <View style={styles.emptyList}>
          <Text style={styles.emptyListText}>
            {activeTab === 'rejected'
              ? 'No rejected properties found.'
              : 'No properties found.'}
          </Text>
        </View>
      }
      contentContainerStyle={{ paddingBottom: 40 }}
    />
  );

  // --- Main render ---
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      {renderTabs()}
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#2563eb" style={{ marginTop: 40 }} />
        ) : (
          <>
            {activeTab === 'properties' && (
              <View style={{ flex: 1 }}>
                {renderPropertiesList()}
              </View>
            )}
            {activeTab === 'add' && (
              <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
                keyboardShouldPersistTaps="handled"
              >
                <PropertyForm
                  userLocation={userLocation}
                  open={true} // or manage this state dynamically
                  onOpenChange={(isOpen) => console.log('Modal open state:', isOpen)}
                  onSubmit={(propertyData) => console.log('Submitted property data:', propertyData)}
                />
              </ScrollView>
            )}
            {activeTab === 'rejected' && (
              <View style={{ flex: 1 }}>
                {renderPropertiesList()}
              </View>
            )}
          </>
        )}
      </View>
      {selectedProperty && renderPropertyDetailsModal()}
    </SafeAreaView>
  );
};

// --- Styles ---


const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  container: { 
    flex: 1, 
    paddingHorizontal: 0, 
    backgroundColor: '#fff' 
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    padding: 10,
    justifyContent: 'space-around'
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: '#2563eb',
  },
  tabText: {
    color: '#374151',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#fff',
  },
  propertyCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  imageContainer: {
    position: 'relative',
    height: 160,
    width: '100%',
  },
  propertyImage: {
    width: '100%',
    height: '100%',
  },
  badgeOverlay: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  propertyCardContent: {
    padding: 16,
  },
  propertyTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#1f2937',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    marginLeft: 8,
  },
  badgeText: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  propertyAddress: {
    color: '#6b7280',
    marginTop: 4,
    fontSize: 13,
  },
  propertyPrice: {
    color: '#2563eb',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 4,
  },
  propertyFeatures: {
    flexDirection: 'row',
    marginTop: 8,
    flexWrap: 'wrap',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 4,
  },
  featureText: {
    color: '#4b5563',
    fontSize: 13,
    marginLeft: 4,
  },
  rejectionContainer: {
    backgroundColor: '#fee2e2',
    borderRadius: 6,
    padding: 8,
    marginTop: 8,
  },
  rejectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  rejectionTitle: {
    color: '#b91c1c',
    fontWeight: 'bold',
    marginLeft: 4,
    fontSize: 13,
  },
  rejectionText: {
    color: '#991b1b',
    fontSize: 13,
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 10,
  },
  viewButton: {
    backgroundColor: '#e0e7ff',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  viewButtonText: {
    color: '#2563eb',
    fontWeight: 'bold',
    fontSize: 13,
  },
  resubmitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#2563eb',
  },
  resubmitButtonText: {
    color: '#2563eb',
    fontWeight: 'bold',
    fontSize: 13,
    marginLeft: 4,
  },
  deleteButton: {
    backgroundColor: '#fee2e2',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  deleteButtonText: {
    color: '#991b1b',
    fontWeight: 'bold',
    fontSize: 13,
  },
  emptyList: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyListText: {
    color: '#6b7280',
    fontSize: 16,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '90%',
    maxHeight: '80%',
    overflow: 'hidden',
  },
  imageGallery: {
    height: 220,
    width: '100%',
  },
  galleryImage: {
    width: 300,
    height: 220,
  },
  modalBody: {
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#1f2937',
    flex: 1,
  },
  modalPrice: {
    color: '#2563eb',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
  },
  modalAddress: {
    color: '#6b7280',
    fontSize: 14,
    marginBottom: 12,
  },
  modalFeatures: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  modalFeatureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: 8,
  },
  modalFeatureText: {
    color: '#4b5563',
    fontSize: 14,
    marginLeft: 8,
  },
  descriptionContainer: {
    marginBottom: 16,
  },
  descriptionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#1f2937',
    marginBottom: 4,
  },
  descriptionText: {
    color: '#4b5563',
    fontSize: 14,
    lineHeight: 20,
  },
  featuresContainer: {
    marginBottom: 16,
  },
  featuresTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#1f2937',
    marginBottom: 8,
  },
  featuresList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  featureTag: {
    backgroundColor: '#e5e7eb',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginRight: 8,
    marginBottom: 8,
  },
  featureTagText: {
    color: '#1f2937',
    fontSize: 13,
  },
  modalRejectionContainer: {
    backgroundColor: '#fee2e2',
    borderRadius: 6,
    padding: 10,
    marginBottom: 16,
  },
  modalRejectionText: {
    color: '#991b1b',
    fontSize: 14,
    lineHeight: 20,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    gap: 10,
    flexWrap: 'wrap',
  },
  modalResubmitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563eb',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  modalResubmitText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 8,
  },
  modalDeleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#b91c1c',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  modalDeleteText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 8,
  },
  modalCloseButton: {
    backgroundColor: '#6b7280',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  modalCloseText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default SellerDashboard;