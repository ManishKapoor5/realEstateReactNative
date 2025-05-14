import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  Alert,
  ActivityIndicator,
  FlatList,
  Platform,
  KeyboardAvoidingView,
  Image,
  SafeAreaView
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
import { debounce } from 'lodash';
import axiosInstance from '../services/axiosInstance';
import { useWindowDimensions } from 'react-native';

// Types
interface Property {
  _id: string;
  title: string;
  type: string;
  location: string | {
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    latitude: number;
    longitude: number;
  };
  price: number;
  status: 'available' | 'sold' | 'rented';
  approvalStatus: 'pending' | 'approved' | 'rejected';
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  featuredImage?: string;
  createdAt: Date;
  updatedAt: Date;
  rejectionReason?: string;
}

interface FormValues {
  title: string;
  type: string;
  location: string;
  price: string;
  status: 'available' | 'sold' | 'rented';
  bedrooms?: string;
  bathrooms?: string;
  area?: string;
  featuredImage?: string;
}

export const PropertiesTab: React.FC = () => {
  const { width, height } = useWindowDimensions();
  const isTablet = width > 768;
  const spacing = isTablet ? 16 : 8;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [approvalFilter, setApprovalFilter] = useState<string | null>(null);
  
  // Modal states
  const [isPropertyModalVisible, setIsPropertyModalVisible] = useState<boolean>(false);
  const [isRejectionModalVisible, setIsRejectionModalVisible] = useState<boolean>(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [rejectingProperty, setRejectingProperty] = useState<Property | null>(null);
  
  // Form states
  const [formValues, setFormValues] = useState<FormValues>({
    title: '',
    type: 'Flat/Apartment',
    location: '',
    price: '',
    status: 'available',
    bedrooms: '',
    bathrooms: '',
    area: '',
  });
  const [rejectionReason, setRejectionReason] = useState<string>('');

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    filterProperties();
  }, [searchText, approvalFilter, properties]);

  // Helper function to get location display text
  const getLocationText = (location: string | { address: string, city: string, state: string, country: string, postalCode: string, latitude: number, longitude: number }): string => {
    if (typeof location === 'string') {
      return location;
    } else if (location && typeof location === 'object') {
      // Create a formatted address from location object
      const parts = [];
      if (location.address) parts.push(location.address);
      if (location.city) parts.push(location.city);
      if (location.state) parts.push(location.state);
      return parts.join(', ') || 'Unknown location';
    }
    return 'Unknown location';
  };

  const fetchProperties = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get('/Property/getAll');
      console.log("Properties data", response.data);
      if (response.data && response.data.data) {
        const propertiesWithKeys = response.data.data.map((property: any, index: number) => ({
          ...property,
          approvalStatus: property.approvalStatus || 'pending',
          createdAt: property.createdAt ? new Date(property.createdAt) : new Date(),
          updatedAt: property.updatedAt ? new Date(property.updatedAt) : new Date(),
        }));
        setProperties(propertiesWithKeys);
      } else {
        setProperties([]);
        Alert.alert('Info', 'No properties found');
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
      setProperties([]);
      Alert.alert('Error', 'Failed to fetch properties');
    } finally {
      setIsLoading(false);
    }
  };

  const filterProperties = () => {
    const filtered = properties.filter(
      (property) => {
        const locationText = getLocationText(property.location);
        const matchesSearch = 
          property.title.toLowerCase().includes(searchText.toLowerCase()) ||
          locationText.toLowerCase().includes(searchText.toLowerCase()) ||
          property.type.toLowerCase().includes(searchText.toLowerCase());
        
        if (approvalFilter) {
          return matchesSearch && property.approvalStatus === approvalFilter;
        }
        
        return matchesSearch;
      }
    );
    setFilteredProperties(filtered);
  };

  const handleSearchChange = debounce((value: string) => {
    setSearchText(value);
  }, 300);

  const handleApproveProperty = async (propertyId: string) => {
    try {
      setIsLoading(true);
      await axiosInstance.put(`/Property/approve/${propertyId}`);
      
      setProperties(properties.map(property =>
        property._id === propertyId
          ? { ...property, approvalStatus: 'approved', updatedAt: new Date() }
          : property
      ));
      
      Alert.alert('Success', 'Property approved successfully');
    } catch (error) {
      console.error('Error approving property:', error);
      Alert.alert('Error', 'Failed to approve property');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectProperty = (property: Property) => {
    setRejectingProperty(property);
    setIsRejectionModalVisible(true);
  };

  const submitRejection = async () => {
    if (!rejectionReason.trim()) {
      Alert.alert('Error', 'Please provide a reason for rejection');
      return;
    }

    try {
      setIsLoading(true);
      await axiosInstance.put(`/Property/rejected/${rejectingProperty?._id}`, 
        { rejectionReason: rejectionReason }
      );
      
      setProperties(properties.map(property =>
        property._id === rejectingProperty?._id
          ? { 
              ...property, 
              approvalStatus: 'rejected', 
              rejectionReason: rejectionReason,
              updatedAt: new Date() 
            }
          : property
      ));
      
      Alert.alert('Success', 'Property rejected');
      setIsRejectionModalVisible(false);
      setRejectionReason('');
    } catch (error) {
      console.error('Error rejecting property:', error);
      Alert.alert('Error', 'Failed to reject property');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProperty = () => {
    setFormValues({
      title: '',
      type: 'Flat/Apartment',
      location: '',
      price: '',
      status: 'available',
      bedrooms: '',
      bathrooms: '',
      area: '',
      featuredImage: '',
    });
    setEditingProperty(null);
    setIsPropertyModalVisible(true);
  };

  const handleEditProperty = (property: Property) => {
    setEditingProperty(property);
    setFormValues({
      title: property.title,
      type: property.type,
      location: typeof property.location === 'string' ? property.location : 
        (property.location ? getLocationText(property.location) : ''),
      price: property.price.toString(),
      status: property.status,
      bedrooms: property.bedrooms?.toString() || '',
      bathrooms: property.bathrooms?.toString() || '',
      area: property.area?.toString() || '',
      featuredImage: property.featuredImage,
    });
    setIsPropertyModalVisible(true);
  };

  const handleDeleteProperty = (propertyId: string) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this property?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setProperties(properties.filter(property => property._id !== propertyId));
            Alert.alert('Success', 'Property deleted successfully');
          }
        },
      ]
    );
  };

  const handlePropertySubmit = () => {
    // Validate form
    if (!formValues.title || !formValues.type || !formValues.location || !formValues.price || !formValues.status) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      if (editingProperty) {
        setProperties(properties.map(property =>
          property._id === editingProperty._id
            ? { 
                ...property, 
                title: formValues.title,
                type: formValues.type,
                location: formValues.location,
                price: parseFloat(formValues.price),
                status: formValues.status,
                bedrooms: formValues.bedrooms ? parseInt(formValues.bedrooms) : undefined,
                bathrooms: formValues.bathrooms ? parseInt(formValues.bathrooms) : undefined,
                area: formValues.area ? parseInt(formValues.area) : undefined,
                featuredImage: formValues.featuredImage,
                updatedAt: new Date() 
              }
            : property
        ));
        Alert.alert('Success', 'Property updated successfully');
      } else {
        const newId = `prop-${(Math.floor(Math.random() * 1000)).toString().padStart(3, '0')}`;
        const newProperty: Property = {
          _id: newId,
          title: formValues.title,
          type: formValues.type,
          location: formValues.location,
          price: parseFloat(formValues.price),
          status: formValues.status,
          approvalStatus: 'pending',
          bedrooms: formValues.bedrooms ? parseInt(formValues.bedrooms) : undefined,
          bathrooms: formValues.bathrooms ? parseInt(formValues.bathrooms) : undefined,
          area: formValues.area ? parseInt(formValues.area) : undefined,
          featuredImage: formValues.featuredImage,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setProperties([...properties, newProperty]);
        Alert.alert('Success', 'Property added successfully');
      }

      setIsLoading(false);
      setIsPropertyModalVisible(false);
      setFormValues({
        title: '',
        type: 'Flat/Apartment',
        location: '',
        price: '',
        status: 'available',
        bedrooms: '',
        bathrooms: '',
        area: '',
      });
    }, 1000);
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        setFormValues({
          ...formValues,
          featuredImage: result.assets[0].uri
        });
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const renderPropertyItem = ({ item }: { item: Property }) => {
    let statusColor = '#52c41a'; // green for available
    if (item.status === 'sold') {
      statusColor = '#f5222d'; // red
    } else if (item.status === 'rented') {
      statusColor = '#1890ff'; // blue
    }

    let approvalStatusColor = '#faad14'; // gold for pending
    if (item.approvalStatus === 'approved') {
      approvalStatusColor = '#52c41a'; // green
    } else if (item.approvalStatus === 'rejected') {
      approvalStatusColor = '#f5222d'; // red
    }

    // Get formatted location text
    const locationText = getLocationText(item.location);

    return (
      <View style={[styles.propertyCard, { marginHorizontal: spacing }]}>
        <View style={styles.propertyHeader}>
          <Text style={styles.propertyTitle}>{item.title}</Text>
          <View style={styles.tagContainer}>
            <View style={[styles.statusTag, { backgroundColor: statusColor }]}>
              <Text style={styles.statusTagText}>{item.status.toUpperCase()}</Text>
            </View>
          </View>
        </View>

        <View style={styles.propertyDetails}>
          <View style={styles.detailRow}>
            <Icon name="location-on" size={16} color="#666" />
            <Text style={styles.detailText}>{locationText}</Text>
          </View>
          <View style={styles.detailRow}>
            <Icon name="home" size={16} color="#666" />
            <Text style={styles.detailText}>{item.type}</Text>
          </View>
          <View style={styles.detailRow}>
            <Icon name="attach-money" size={16} color="#666" />
            <Text style={styles.detailText}>₹{(item.price / 100000).toFixed(2)} L</Text>
          </View>
          {item.bedrooms && (
            <View style={styles.detailRow}>
              <Icon name="hotel" size={16} color="#666" />
              <Text style={styles.detailText}>{item.bedrooms} Beds</Text>
            </View>
          )}
          {item.bathrooms && (
            <View style={styles.detailRow}>
              <Icon name="bathtub" size={16} color="#666" />
              <Text style={styles.detailText}>{item.bathrooms} Baths</Text>
            </View>
          )}
          {item.area && (
            <View style={styles.detailRow}>
              <Icon name="straighten" size={16} color="#666" />
              <Text style={styles.detailText}>{item.area} sq ft</Text>
            </View>
          )}
        </View>

        <View style={styles.approvalSection}>
          <View style={[styles.approvalTag, { backgroundColor: approvalStatusColor }]}>
            <Text style={styles.approvalTagText}>{item.approvalStatus.toUpperCase()}</Text>
          </View>
          {item.approvalStatus === 'rejected' && item.rejectionReason && (
            <Text style={styles.rejectionReason}>Reason: {item.rejectionReason}</Text>
          )}
        </View>

        <View style={styles.lastUpdated}>
          <Text style={styles.lastUpdatedText}>
            Last Updated: {item.updatedAt instanceof Date 
              ? item.updatedAt.toLocaleDateString() 
              : new Date(item.updatedAt).toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.actions}>
          {item.approvalStatus === 'pending' && (
            <View style={styles.approvalActions}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.approveButton]}
                onPress={() => handleApproveProperty(item._id)}
              >
                <Icon name="check-circle" size={16} color="#fff" />
                <Text style={styles.actionButtonText}>Approve</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionButton, styles.rejectButton]}
                onPress={() => handleRejectProperty(item)}
              >
                <Icon name="cancel" size={16} color="#fff" />
                <Text style={styles.actionButtonText}>Reject</Text>
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.standardActions}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.editButton]}
              onPress={() => handleEditProperty(item)}
            >
              <Icon name="edit" size={16} color="#fff" />
              <Text style={styles.actionButtonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.deleteButton]}
              onPress={() => handleDeleteProperty(item._id)}
            >
              <Icon name="delete" size={16} color="#fff" />
              <Text style={styles.actionButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Search and Filters */}
      <View style={[styles.header, { paddingHorizontal: spacing }]}>
        <View style={[styles.searchContainer, isTablet ? { flexDirection: 'row' } : { flexDirection: 'column' }]}>
          <TextInput
            style={[styles.searchInput, isTablet ? { flex: 1, marginRight: 8 } : { marginBottom: 8 }]}
            placeholder="Search properties..."
            value={searchText}
            onChangeText={handleSearchChange}
          />
          <View style={isTablet ? { width: 200 } : { width: '100%' }}>
            <Picker
              selectedValue={approvalFilter || ''}
              onValueChange={(itemValue) => setApprovalFilter(itemValue === '' ? null : itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="All Approval Statuses" value="" />
              <Picker.Item label="Pending" value="pending" />
              <Picker.Item label="Approved" value="approved" />
              <Picker.Item label="Rejected" value="rejected" />
            </Picker>
          </View>
        </View>
        
        <View style={[styles.actionButtons, { marginTop: isTablet ? 0 : 8 }]}>
          <TouchableOpacity 
            style={[styles.button, styles.exportButton]}
            onPress={() => Alert.alert('Info', 'Export functionality coming soon')}
          >
            <Icon name="file-download" size={16} color="#fff" />
            <Text style={styles.buttonText}>Export</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, styles.addButton]}
            onPress={handleAddProperty}
          >
            <Icon name="add" size={16} color="#fff" />
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Properties List */}
      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#1890ff" />
        </View>
      ) : (
        <FlatList
          data={filteredProperties}
          renderItem={renderPropertyItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
        />
      )}

      {/* Property Form Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isPropertyModalVisible}
        onRequestClose={() => setIsPropertyModalVisible(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalContainer}
        >
          <View style={[styles.modalContent, { width: isTablet ? '80%' : '90%' }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingProperty ? 'Edit Property' : 'Add New Property'}
              </Text>
              <TouchableOpacity onPress={() => setIsPropertyModalVisible(false)}>
                <Icon name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.formContainer}>
              <Text style={styles.inputLabel}>Property Title *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter property title"
                value={formValues.title}
                onChangeText={(text) => setFormValues({...formValues, title: text})}
              />

              <Text style={styles.inputLabel}>Property Type *</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formValues.type}
                  onValueChange={(itemValue) => setFormValues({...formValues, type: itemValue})}
                  style={styles.input}
                >
                  <Picker.Item label="Flat/Apartment" value="Flat/Apartment" />
                  <Picker.Item label="Villa" value="Villa" />
                  <Picker.Item label="Builder Floor" value="Builder Floor" />
                  <Picker.Item label="Plot" value="Plot" />
                  <Picker.Item label="Independent House" value="Independent House" />
                </Picker>
              </View>

              <Text style={styles.inputLabel}>Location *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter location"
                value={formValues.location}
                onChangeText={(text) => setFormValues({...formValues, location: text})}
              />

              <Text style={styles.inputLabel}>Price (₹) *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter price"
                value={formValues.price}
                onChangeText={(text) => setFormValues({...formValues, price: text})}
                keyboardType="numeric"
              />

              <Text style={styles.inputLabel}>Status *</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formValues.status}
                  onValueChange={(itemValue) => setFormValues({...formValues, status: itemValue})}
                  style={styles.input}
                >
                  <Picker.Item label="Available" value="available" />
                  <Picker.Item label="Sold" value="sold" />
                  <Picker.Item label="Rented" value="rented" />
                </Picker>
              </View>

              <Text style={styles.inputLabel}>Bedrooms</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter bedrooms"
                value={formValues.bedrooms}
                onChangeText={(text) => setFormValues({...formValues, bedrooms: text})}
                keyboardType="numeric"
              />

              <Text style={styles.inputLabel}>Bathrooms</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter bathrooms"
                value={formValues.bathrooms}
                onChangeText={(text) => setFormValues({...formValues, bathrooms: text})}
                keyboardType="numeric"
              />

              <Text style={styles.inputLabel}>Area (sq ft)</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter area"
                value={formValues.area}
                onChangeText={(text) => setFormValues({...formValues, area: text})}
                keyboardType="numeric"
              />

              <Text style={styles.inputLabel}>Featured Image</Text>
              <TouchableOpacity style={styles.imageUploadButton} onPress={pickImage}>
                <Icon name="add-photo-alternate" size={24} color="#1890ff" />
                <Text style={styles.imageUploadText}>Upload Image</Text>
              </TouchableOpacity>
              {formValues.featuredImage && (
                <Image 
                  source={{ uri: formValues.featuredImage }} 
                  style={styles.previewImage} 
                />
              )}

              <View style={styles.formActions}>
                <TouchableOpacity 
                  style={[styles.formButton, styles.cancelButton]}
                  onPress={() => setIsPropertyModalVisible(false)}
                >
                  <Text style={styles.formButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.formButton, styles.submitButton]}
                  onPress={handlePropertySubmit}
                >
                  <Text style={styles.formButtonText}>
                    {editingProperty ? 'Update' : 'Add'}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Rejection Reason Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isRejectionModalVisible}
        onRequestClose={() => setIsRejectionModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { width: isTablet ? '60%' : '90%' }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Reject Property</Text>
              <TouchableOpacity onPress={() => setIsRejectionModalVisible(false)}>
                <Icon name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <View style={styles.rejectionFormContainer}>
              <Text style={styles.inputLabel}>Reason for Rejection *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Enter reason for rejection"
                value={rejectionReason}
                onChangeText={setRejectionReason}
                multiline={true}
                numberOfLines={4}
              />

              <View style={styles.formActions}>
                <TouchableOpacity 
                  style={[styles.formButton, styles.cancelButton]}
                  onPress={() => setIsRejectionModalVisible(false)}
                >
                  <Text style={styles.formButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.formButton, styles.rejectButton]}
                  onPress={submitRejection}
                >
                  <Text style={styles.formButtonText}>Reject</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// Fix for the dropdown button and other style improvements

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
  },
  searchContainer: {
    marginBottom: 8,
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#d9d9d9',
    borderRadius: 4,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#d9d9d9', // Fixed typo here (was '#d9 алюминиум9d9')
    borderRadius: 4,
    backgroundColor: '#fff',
    marginBottom: 12,
    overflow: 'hidden', // Added to ensure dropdown doesn't overflow container
  },
  picker: {
    height: 70,
    width: '100%', // Ensure picker takes full width
    backgroundColor: '#fff',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginLeft: 8,
  },
  exportButton: {
    backgroundColor: '#52c41a',
  },
  addButton: {
    backgroundColor: '#1890ff',
  },
  buttonText: {
    color: '#fff',
    marginLeft: 4,
    fontWeight: '500',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 8,
  },
  propertyCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  propertyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  propertyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  tagContainer: {
    flexDirection: 'row',
  },
  statusTag: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  statusTagText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  propertyDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    marginLeft: 8,
    color: '#666',
  },
  approvalSection: {
    marginBottom: 12,
  },
  approvalTag: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  approvalTagText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  rejectionReason: {
    fontSize: 12,
    color: '#f5222d',
    marginTop: 4,
  },
  lastUpdated: {
    marginBottom: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 8,
  },
  lastUpdatedText: {
    fontSize: 12,
    color: '#999',
  },
  actions: {
    marginTop: 8,
  },
  approvalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  standardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  approveButton: {
    backgroundColor: '#52c41a',
  },
  rejectButton: {
    backgroundColor: '#f5222d',
  },
  editButton: {
    backgroundColor: '#1890ff',
  },
  deleteButton: {
    backgroundColor: '#ff4d4f',
  },
  actionButtonText: {
    color: '#fff',
    marginLeft: 4,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    maxHeight: '90%',
    alignSelf: 'center',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  formContainer: {
    flex: 1,
  },
  rejectionFormContainer: {
    paddingVertical: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
    color: '#333',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#d9d9d9',
    borderRadius: 4,
    paddingHorizontal: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingVertical: 8,
  },
  imageUploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#d9d9d9',
    borderRadius: 4,
    marginBottom: 12,
  },
  imageUploadText: {
    marginLeft: 8,
    color: '#1890ff',
    fontWeight: '500',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 4,
    marginBottom: 12,
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  formButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: '#d9d9d9',
  },
  submitButton: {
    backgroundColor: '#1890ff',
  },
  formButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
});