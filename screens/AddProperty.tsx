// src/screens/AddPropertyScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Switch,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Define the types for our form data
interface LocationData {
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  latitude: string;
  longitude: string;
}

interface FeaturesData {
  bedrooms: string;
  bathrooms: string;
  area: string;
  parking: boolean;
  furnished: boolean;
}

interface PropertyFormData {
  title: string;
  description: string;
  price: string;
  type: string;
  location: LocationData;
  features: FeaturesData;
  images: string[];
  status: string;
}

// Type for navigation
type RootStackParamList = {
  Home: undefined;
  PropertyList: undefined;
  // Add other screens as needed
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

const AddPropertyScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAuthStore();
  
  const [formData, setFormData] = useState<PropertyFormData>({
    title: '',
    description: '',
    price: '',
    type: 'apartment',
    location: {
      address: '',
      city: '',
      state: '',
      country: 'India',
      postalCode: '',
      latitude: '',
      longitude: '',
    },
    features: {
      bedrooms: '',
      bathrooms: '',
      area: '',
      parking: false,
      furnished: false,
    },
    images: [''],
    status: 'available',
  });

  // Handle text input changes
  const handleChange = (value: string, name: string, group?: keyof PropertyFormData) => {
    if (group) {
      setFormData((prev) => ({
        ...prev,
        [group]: {
          ...(prev[group as keyof PropertyFormData] as Record<string, any>),
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle switch toggle changes
  const handleSwitchChange = (value: boolean, name: string, group: keyof PropertyFormData) => {
    setFormData((prev) => ({
      ...prev,
      [group]: {
        ...(prev[group as keyof PropertyFormData] as Record<string, any>),
        [name]: value,
      },
    }));
  };

  // Handle image URL changes
  const handleImageChange = (index: number, value: string) => {
    const updated = [...formData.images];
    updated[index] = value;
    setFormData({ ...formData, images: updated });
  };

  // Add a new image input field
  const addImageField = () => {
    setFormData({ ...formData, images: [...formData.images, ''] });
  };

  // Submit form data to API
  const handleSubmit = async () => {
    if (!user || !user._id) {
      Alert.alert('Error', 'You must be logged in to add a property');
      return;
    }

    const payload = {
      ...formData,
      price: Number(formData.price),
      features: {
        ...formData.features,
        bedrooms: Number(formData.features.bedrooms),
        bathrooms: Number(formData.features.bathrooms),
        area: Number(formData.features.area),
      },
      location: {
        ...formData.location,
        latitude: formData.location.latitude ? Number(formData.location.latitude) : 0,
        longitude: formData.location.longitude ? Number(formData.location.longitude) : 0,
      },
      owner: {
        name: user.fullName,
        contact: user.contactNumber || '',
        email: user.email,
      },
      sellerId: user._id,
    };

    try {
      await axios.post('https://realestatesite-backend.onrender.com/api/v1/Property/add', payload);
      Alert.alert('Success', 'Property added successfully!', [
        { text: 'OK', onPress: () => navigation.navigate('PropertyList') }
      ]);
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to add property');
    }
  };

  // Create location input fields
  const renderLocationInputs = () => {
    return Object.keys(formData.location).map((key) => (
      <TextInput
        key={key}
        style={styles.input}
        value={formData.location[key as keyof LocationData]}
        onChangeText={(value) => handleChange(value, key, 'location')}
        placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
        placeholderTextColor="#999"
      />
    ));
  };

  // Create feature number input fields
  const renderFeatureInputs = () => {
    return ['bedrooms', 'bathrooms', 'area'].map((key) => (
      <TextInput
        key={key}
        style={styles.input}
        value={formData.features[key as 'bedrooms' | 'bathrooms' | 'area']}
        onChangeText={(value) => handleChange(value, key, 'features')}
        placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
        placeholderTextColor="#999"
        keyboardType="numeric"
      />
    ));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Add New Property</Text>
        
        {/* Basic Property Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Details</Text>
          <TextInput
            style={styles.input}
            value={formData.title}
            onChangeText={(value) => handleChange(value, 'title')}
            placeholder="Title"
            placeholderTextColor="#999"
          />
          <TextInput
            style={styles.input}
            value={formData.price}
            onChangeText={(value) => handleChange(value, 'price')}
            placeholder="Price"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            value={formData.type}
            onChangeText={(value) => handleChange(value, 'type')}
            placeholder="Type (apartment, house, etc.)"
            placeholderTextColor="#999"
          />
          <TextInput
            style={styles.textArea}
            value={formData.description}
            onChangeText={(value) => handleChange(value, 'description')}
            placeholder="Description"
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Location */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          {renderLocationInputs()}
        </View>

        {/* Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>
          {renderFeatureInputs()}
          
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Parking</Text>
            <Switch
              value={formData.features.parking}
              onValueChange={(value) => handleSwitchChange(value, 'parking', 'features')}
              trackColor={{ false: '#d1d5db', true: '#10b981' }}
            />
          </View>
          
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Furnished</Text>
            <Switch
              value={formData.features.furnished}
              onValueChange={(value) => handleSwitchChange(value, 'furnished', 'features')}
              trackColor={{ false: '#d1d5db', true: '#10b981' }}
            />
          </View>
        </View>

        {/* Images */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Images</Text>
          {formData.images.map((url, i) => (
            <TextInput
              key={i}
              style={styles.input}
              value={url}
              onChangeText={(value) => handleImageChange(i, value)}
              placeholder={`Image URL ${i + 1}`}
              placeholderTextColor="#999"
            />
          ))}
          <TouchableOpacity onPress={addImageField} style={styles.addButton}>
            <Text style={styles.addButtonText}>+ Add another image</Text>
          </TouchableOpacity>
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#374151',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#f9fafb',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#f9fafb',
    height: 100,
    textAlignVertical: 'top',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    marginBottom: 8,
  },
  switchLabel: {
    fontSize: 16,
    color: '#374151',
  },
  addButton: {
    paddingVertical: 8,
  },
  addButtonText: {
    color: '#3b82f6',
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: '#10b981',
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AddPropertyScreen;