import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import axiosInstance from '../services/axiosInstance';

// Cleaned PropertyLocation (no lat/lng)
interface PropertyLocation {
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

interface PropertyFeatures {
  bedrooms: number;
  bathrooms: number;
  area: number;
  parking: boolean;
  furnished: boolean;
}

interface PropertyOwner {
  name: string;
  contact: string;
  email: string;
}

interface Property {
  _id: { $oid: string };
  title: string;
  description: string;
  price: number;
  type: string;
  location: PropertyLocation;
  features: PropertyFeatures;
  images: string[];
  owner: PropertyOwner;
  sellerId: { $oid: string };
  status: string;
  approval: string;
  createdAt: { $date: string };
  updatedAt: { $date: string };
}

type TabType = 'buy' | 'seller' | 'agent';

const propertyTypes: Record<TabType, string[]> = {
  buy: ['apartment', 'villa', 'house', 'plot', 'commercial'],
  seller: ['apartment', 'house', 'pg', 'villa'],
  agent: ['office', 'shop', 'commercial'],
};

interface PropertyTypeButtonsProps {
  type: TabType;
  selectedType: string | null;
  onSelect: (type: string) => void;
}

const PropertyTypeButtons: React.FC<PropertyTypeButtonsProps> = ({ type, selectedType, onSelect }) => (
  <View style={styles.buttonContainer}>
    {propertyTypes[type].map((label) => (
      <TouchableOpacity
        key={label}
        style={[
          styles.typeButton,
          selectedType === label ? styles.typeButtonSelected : styles.typeButtonOutline,
        ]}
        onPress={() => onSelect(label)}
      >
        <Text
          style={[
            styles.typeButtonText,
            selectedType === label ? styles.typeButtonTextSelected : styles.typeButtonTextOutline,
          ]}
        >
          {label.charAt(0).toUpperCase() + label.slice(1)}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

const Hero: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('buy');
  const [searchInput, setSearchInput] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedPropertyType, setSelectedPropertyType] = useState<string | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigation = useNavigation<any>();

  useEffect(() => {
    const fetchProperties = async () => {
      setIsLoading(true);
      try {
        const res = await axiosInstance.get('/Property/getFrontPageAllProperties');
        if (res.data && res.data.data) {
          console.log('Fetched properties:', res.data.data);
          setProperties(res.data.data);
        } else if (Array.isArray(res.data)) {
          setProperties(res.data);
        } else {
          console.error('Unexpected API response format:', res.data);
        }
      } catch (err) {
        console.error('API error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const handleSearch = () => {
    const filteredProperties = properties.filter((property) => {
      try {
        const typeMatch =
          !selectedPropertyType ||
          (property.type && property.type.toLowerCase() === selectedPropertyType.toLowerCase());

        const cityMatch =
          !selectedCity ||
          (property.location &&
            property.location.city &&
            property.location.city.toLowerCase().includes(selectedCity.toLowerCase()));

        const searchMatch =
          !searchInput ||
          (property.title && property.title.toLowerCase().includes(searchInput.toLowerCase())) ||
          (property.description &&
            property.description.toLowerCase().includes(searchInput.toLowerCase())) ||
          (property.location &&
            property.location.address &&
            property.location.address.toLowerCase().includes(searchInput.toLowerCase()));

        const statusMatch = !property.status || property.status === 'available';

        return typeMatch && cityMatch && searchMatch && statusMatch;
      } catch (error) {
        console.error('Error filtering property:', error, property);
        return false;
      }
    });
    console.log('Filtered Properties----->', filteredProperties.length);
    navigation.navigate('PropertyListings', { filteredProperties });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Find Your Dream Property in India</Text>
        <Text style={styles.subtitle}>
          Search from over 10 lakh properties for sale and rent across top cities in India
        </Text>
      </View>

      <View style={styles.card}>
        {/* Tab Bar */}
        <View style={styles.tabList}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'buy' ? styles.tabActive : null]}
            onPress={() => setActiveTab('buy')}
          >
            <Icon name="home" size={16} color={activeTab === 'buy' ? '#FFFFFF' : '#111827'} />
            <Text style={[styles.tabText, activeTab === 'buy' ? styles.tabTextActive : null]}>
              Buy
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'seller' ? styles.tabActive : null]}
            onPress={() => setActiveTab('seller')}
          >
            <Icon
              name="briefcase"
              size={16}
              color={activeTab === 'seller' ? '#FFFFFF' : '#111827'}
            />
            <Text style={[styles.tabText, activeTab === 'seller' ? styles.tabTextActive : null]}>
              Seller
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'agent' ? styles.tabActive : null]}
            onPress={() => setActiveTab('agent')}
          >
            <Icon name="user" size={16} color={activeTab === 'agent' ? '#FFFFFF' : '#111827'} />
            <Text style={[styles.tabText, activeTab === 'agent' ? styles.tabTextActive : null]}>
              Agent
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {(['buy', 'seller', 'agent'] as TabType[]).map((key) => (
          <View
            key={key}
            style={[styles.tabContent, activeTab !== key ? styles.tabContentHidden : null]}
          >
            <View style={styles.searchContainer}>
              <View style={styles.cityInputContainer}>
                <TextInput
                  style={styles.cityInput}
                  placeholder="Select City"
                  value={selectedCity}
                  onChangeText={setSelectedCity}
                />
              </View>
              <View style={styles.searchInputContainer}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search by title, description or address"
                  value={searchInput}
                  onChangeText={setSearchInput}
                />
                <TouchableOpacity
                  style={styles.searchButton}
                  onPress={handleSearch}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <>
                      <Icon name="search" size={20} color="#FFFFFF" />
                      <Text style={styles.searchButtonText}>Search</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </View>
            <PropertyTypeButtons
              type={key}
              selectedType={selectedPropertyType}
              onSelect={setSelectedPropertyType}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F0F9FF',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    maxWidth: 600,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    padding: 8,
  },
  tabList: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 2,
  },
  tabActive: {
    backgroundColor: '#2563EB',
  },
  tabText: {
    fontSize: 16,
    color: '#111827',
    marginLeft: 8,
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  tabContent: {
    paddingHorizontal: 8,
    paddingBottom: 16,
  },
  tabContentHidden: {
    display: 'none',
  },
  searchContainer: {
    flexDirection: 'column',
  },
  cityInputContainer: {
    marginBottom: 12,
  },
  cityInput: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#111827',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#111827',
  },
  searchButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  typeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  typeButtonSelected: {
    backgroundColor: '#2563EB',
  },
  typeButtonOutline: {
    borderColor: '#D1D5DB',
    borderWidth: 1,
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  typeButtonTextSelected: {
    color: '#FFFFFF',
  },
  typeButtonTextOutline: {
    color: '#111827',
  },
});

export default Hero;