import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Modal,
  Platform,
  Dimensions,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
// Import the correct geolocation package based on your setup
import * as Location from 'expo-location'; // If using Expo
// Or uncomment this if using the community geolocation package:
// import Geolocation from '@react-native-community/geolocation';
import { Picker as PickerComponent } from '@react-native-picker/picker';
import axiosInstance from '../services/axiosInstance';
import { useAuthStore } from '../store/authStore';
import { useAgentStore } from '../store/agentStore';
import PropertyCard from '../components/PropertyCard';
import PropertyForm from '../components/PropertyForm';
import { Property } from '../types';

// Define a custom type for Picker to ensure JSX compatibility
interface PickerWithItem {
  (props: any): JSX.Element;
  Item: React.ComponentType<any>;
}

// Cast Picker to ensure it's treated as a JSX component with Item
const Picker = PickerComponent as unknown as PickerWithItem;

// Analytics placeholder
const trackEvent = (event: string, data: Record<string, any>) => {
  console.log(`Analytics: ${event}`, data);
};

const AgentDashboard: React.FC = () => {
  const [myProperties, setMyProperties] = useState<Property[]>([]);
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'myProperties' | 'allProperties' | 'add'>('myProperties');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'sold'>('all');
  const [sortBy, setSortBy] = useState<'price' | 'date'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // Get window dimensions for responsive design
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  const navigation = useNavigation<any>();
  const { agents } = useAgentStore();
  const { isAuthenticated, accessToken, user, refreshToken } = useAuthStore();

  const showToast = useCallback(
    ({
      title,
      description,
      variant = 'default',
    }: {
      title: string;
      description: string;
      variant?: 'default' | 'destructive';
    }) => {
      Toast.show({
        type: variant === 'destructive' ? 'error' : 'success',
        text1: title,
        text2: description,
        visibilityTime: 3000,
      });
    },
    []
  );

  // Geolocation - Fixed implementation
  useEffect(() => {
    const requestLocation = async () => {
      try {
        // If using Expo Location
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError('Permission to access location was denied');
          showToast({
            variant: 'destructive',
            title: 'Location Permission',
            description: 'Permission to access location was denied.',
          });
          return;
        }
        
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        trackEvent('Geolocation Success', {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        
        // If using @react-native-community/geolocation, uncomment this block instead
        /* 
        Geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
            trackEvent('Geolocation Success', {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (err) => {
            console.error('Geolocation error:', err);
            setError('Failed to get your location. You can still add properties without location data.');
            showToast({
              variant: 'destructive',
              title: 'Geolocation Error',
              description: 'Unable to retrieve location.',
            });
            trackEvent('Geolocation Error', { error: err.message });
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
        */
      } catch (err: any) {
        console.error('Geolocation error:', err);
        setError('Failed to get your location. You can still add properties without location data.');
        showToast({
          variant: 'destructive',
          title: 'Geolocation Error',
          description: 'Unable to retrieve location.',
        });
        trackEvent('Geolocation Error', { error: err.message });
      }
    };

    requestLocation();
  }, [showToast]);

  // Check authentication and fetch properties
  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated) {
        navigation.navigate('Login');
        return;
      }
      await Promise.all([fetchMyProperties(), fetchAllProperties()]);
      setLoading(false);
    };

    checkAuth();
  }, [isAuthenticated, navigation, page, filterStatus, sortBy, sortOrder, searchQuery]);

  // Fetch my properties
  const fetchMyProperties = useCallback(async () => {
    try {
      setLoading(true);
      if (!accessToken || !user || !user._id) {
        throw new Error('Authentication token or user ID missing');
      }

      const params = {
        page,
        limit: 9,
        status: filterStatus === 'all' ? undefined : filterStatus,
        sortBy,
        sortOrder,
        search: searchQuery || undefined,
      };

      const response = await axiosInstance.get(`/Property/properties/seller/${user._id}`, { params });
      const { data, totalPages: total } = response.data;
      setMyProperties(data || []);
      setTotalPages(total || 1);
      trackEvent('Fetch My Properties Success', { agentId: user._id, page, count: data?.length || 0 });
    } catch (err: any) {
      handleError(err, 'Failed to fetch my properties');
    } finally {
      setLoading(false);
    }
  }, [accessToken, user, page, filterStatus, sortBy, sortOrder, searchQuery]);

  // Fetch all properties
  const fetchAllProperties = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 9,
        status: filterStatus === 'all' ? undefined : filterStatus,
        sortBy,
        sortOrder,
        search: searchQuery || undefined,
      };

      const response = await axiosInstance.get('/Property/getAll', { params });
      const { data, totalPages: total } = response.data;
      setAllProperties(data || []);
      setTotalPages(total || 1);
      trackEvent('Fetch All Properties Success', { page, count: data?.length || 0 });
    } catch (err: any) {
      handleError(err, 'Failed to fetch all properties');
    } finally {
      setLoading(false);
    }
  }, [page, filterStatus, sortBy, sortOrder, searchQuery]);

  // Handle errors
  const handleError = async (err: any, defaultMessage: string) => {
    console.error('❌ API call failed:', err);
    if (err.response?.status === 401) {
      try {
        await useAuthStore.getState().refreshToken;
        await Promise.all([fetchMyProperties(), fetchAllProperties()]);
      } catch (refreshErr) {
        setError('Session expired. Please log in again.');
        navigation.navigate('Login');
        showToast({
          variant: 'destructive',
          title: 'Authentication Error',
          description: 'Session expired.',
        });
      }
    } else if (err.response?.status === 404) {
      setError('No properties found. Please check if the endpoint or agent ID is correct.');
      showToast({
        variant: 'destructive',
        title: 'Not Found',
        description: 'No properties found for this request.',
      });
    } else {
      const message = err.message || defaultMessage;
      setError(message);
      showToast({
        variant: 'destructive',
        title: 'Error',
        description: message,
      });
    }
    trackEvent('Fetch Properties Error', { error: err.message });
  };

  const handleViewDetails = (property: Property) => {
    setSelectedProperty(property);
  };

  const handleCloseDetails = () => {
    setSelectedProperty(null);
  };

  const renderPropertyItem = ({ item }: { item: Property }) => (
    <PropertyCard
      title={item.title}
      price={typeof item.price === 'string' ? parseFloat(item.price) : item.price}
      location={`${item.location.address}, ${item.location.city}, ${item.location.state}, ${item.location.country}`}
      property={item}
      onViewDetails={handleViewDetails}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Agent Dashboard</Text>
        <Text style={styles.headerSubtitle}>Manage properties and connect buyers with sellers</Text>
      </View>

      {/* Filters and Search */}
      <View style={styles.filtersHeader}>
        <View style={styles.searchContainer}>
          <Feather name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search properties..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity 
          style={styles.filterToggleButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Feather name="filter" size={20} color="#2563EB" />
          <Text style={styles.filterToggleText}>Filters</Text>
        </TouchableOpacity>
      </View>
      
      {showFilters && (
        <View style={styles.filtersContainer}>
          <Text style={styles.filterSectionTitle}>Filter Options</Text>
          <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Status</Text>
              <Picker
              selectedValue={filterStatus}
              onValueChange={(value: 'all' | 'active' | 'sold') => setFilterStatus(value)}
              style={styles.picker}
              itemStyle={styles.pickerItem}
              >
              <Picker.Item label="All Status" value="all" />
              <Picker.Item label="Active" value="active" />
              <Picker.Item label="Sold" value="sold" />
              </Picker>
          </View>
          <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Sort By</Text>
              <Picker
              selectedValue={sortBy}
              onValueChange={(value: 'price' | 'date') => setSortBy(value)}
              style={styles.picker}
              itemStyle={styles.pickerItem}
              >
              <Picker.Item label="Sort by Price" value="price" />
              <Picker.Item label="Sort by Date" value="date" />
              </Picker>
          </View>
          <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Order</Text>
              <Picker
              selectedValue={sortOrder}
              onValueChange={(value: 'asc' | 'desc') => setSortOrder(value)}
              style={styles.picker}
              itemStyle={styles.pickerItem}
              >
              <Picker.Item label="Ascending" value="asc" />
              <Picker.Item label="Descending" value="desc" />
              </Picker>
          </View>
          <TouchableOpacity 
            style={styles.applyFiltersButton}
            onPress={() => setShowFilters(false)}
          >
            <Text style={styles.applyFiltersText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {['myProperties', 'allProperties', 'add'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabButton, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab as 'myProperties' | 'allProperties' | 'add')}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab === 'myProperties' ? 'My Listings' : tab === 'allProperties' ? 'All Properties' : 'Add Property'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Main Content */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : activeTab === 'myProperties' ? (
        <ScrollView contentContainerStyle={styles.content}>
          {myProperties.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Feather name="alert-triangle" size={48} color="#D97706" />
              <Text style={styles.emptyTitle}>No Properties Listed</Text>
              <Text style={styles.emptySubtitle}>You haven't listed any properties yet.</Text>
            </View>
          ) : (
            <>
              <FlatList
                data={myProperties}
                renderItem={renderPropertyItem}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.propertyList}
                numColumns={windowWidth > 768 ? 2 : 1}
                columnWrapperStyle={windowWidth > 768 ? styles.columnWrapper : undefined}
                showsVerticalScrollIndicator={false}
              />
              <View style={styles.paginationContainer}>
                <TouchableOpacity
                  style={[styles.paginationButton, page === 1 && styles.disabledButton]}
                  onPress={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={page === 1}
                >
                  <Text style={styles.paginationText}>Previous</Text>
                </TouchableOpacity>
                <Text style={styles.paginationInfo}>
                  Page {page} of {totalPages}
                </Text>
                <TouchableOpacity
                  style={[styles.paginationButton, page === totalPages && styles.disabledButton]}
                  onPress={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={page === totalPages}
                >
                  <Text style={styles.paginationText}>Next</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </ScrollView>
      ) : activeTab === 'allProperties' ? (
        <ScrollView contentContainerStyle={styles.content}>
          {allProperties.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Feather name="alert-triangle" size={48} color="#D97706" />
              <Text style={styles.emptyTitle}>No Properties Found</Text>
              <Text style={styles.emptySubtitle}>No properties are currently listed.</Text>
            </View>
          ) : (
            <>
              <FlatList
                data={allProperties}
                renderItem={renderPropertyItem}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.propertyList}
                numColumns={windowWidth > 768 ? 2 : 1}
                columnWrapperStyle={windowWidth > 768 ? styles.columnWrapper : undefined}
                showsVerticalScrollIndicator={false}
              />
              <View style={styles.paginationContainer}>
                <TouchableOpacity
                  style={[styles.paginationButton, page === 1 && styles.disabledButton]}
                  onPress={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={page === 1}
                >
                  <Text style={styles.paginationText}>Previous</Text>
                </TouchableOpacity>
                <Text style={styles.paginationInfo}>
                  Page {page} of {totalPages}
                </Text>
                <TouchableOpacity
                  style={[styles.paginationButton, page === totalPages && styles.disabledButton]}
                  onPress={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={page === totalPages}
                >
                  <Text style={styles.paginationText}>Next</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <PropertyForm
            userLocation={userLocation}
            open={true} // or manage this state dynamically
            onOpenChange={(isOpen) => console.log('Modal open state:', isOpen)}
            onSubmit={(propertyData) => console.log('Submitted property data:', propertyData)}
          />
        </ScrollView>
      )}

      {/* Property Details Modal */}
      <Modal
        visible={!!selectedProperty}
        transparent
        animationType="fade"
        onRequestClose={handleCloseDetails}
      >
        <View style={styles.modalOverlay}>
          <View style={[
            styles.modalContainer, 
            { width: windowWidth > 768 ? '70%' : '90%' }
          ]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle} numberOfLines={1} ellipsizeMode="tail">
                {selectedProperty?.title || 'Property Details'}
              </Text>
              {/* <TouchableOpacity onPress={handleCloseDetails}>
                <Feather name="x" size={24} color="#6B7280" />
              </TouchableOpacity> */}
            </View>
            <ScrollView contentContainerStyle={styles.modalScrollContent}>
              {selectedProperty && (
                <PropertyCard
                  title={selectedProperty.title}
                  price={typeof selectedProperty.price === 'string' ? parseFloat(selectedProperty.price) : selectedProperty.price}
                  location={`${selectedProperty.location.address}, ${selectedProperty.location.city}, ${selectedProperty.location.state}, ${selectedProperty.location.country}`}
                  property={selectedProperty}
                  showDetailedView={true}
                />
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Toast />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingTop: Platform.OS === 'ios' ? 0 : 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  filtersHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filtersContainer: {
    padding: 16,
    backgroundColor: '#F3F4F6',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    flex: 1,
    marginRight: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    color: '#111827',
  },
  filterToggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  filterToggleText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2563EB',
    marginLeft: 4,
  },
  applyFiltersButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  applyFiltersText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    marginBottom: 12,
    overflow: 'hidden',
    backgroundColor: '#FFF',
  },
  pickerLabel: {
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '500',
    marginLeft: 8,
    marginTop: 8,
    marginBottom: 4,
  },
  picker: {
    fontSize: 16,
    color: '#111827',
    height: Platform.OS === 'ios' ? 120 : 50,
  },
  pickerItem: {
    fontSize: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingHorizontal: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#2563EB',
  },
  tabText: {
    fontSize: 14,
    color: '#6B7280',
  },
  activeTabText: {
    color: '#2563EB',
    fontWeight: '600',
  },
  content: {
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 100 : 80, // Extra padding for bottom navigation
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    backgroundColor: '#FEF2F2',
    padding: 16,
    borderRadius: 8,
    margin: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#DC2626',
    textAlign: 'center',
  },
  emptyContainer: {
    backgroundColor: '#FFF',
    padding: 24,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
  },
  propertyList: {
    paddingBottom: 16,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    gap: 16,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    flexWrap: 'wrap',
    paddingHorizontal: 8,
  },
  paginationButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 8,
    marginBottom: 8,
  },
  disabledButton: {
    backgroundColor: '#D1D5DB',
  },
  paginationText: {
    fontSize: 14,
    color: '#FFF',
    fontWeight: '600',
  },
  paginationInfo: {
    fontSize: 14,
    color: '#374151',
    margin: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  modalContainer: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    maxWidth: 600,
    maxHeight: '90%',
    overflow: 'hidden',
    width: '90%',
  },
  modalScrollContent: {
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
});

export default AgentDashboard;