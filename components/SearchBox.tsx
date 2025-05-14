import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { Home, Search, Store } from 'lucide-react-native';

// Extend LucideProps to include color explicitly
interface ExtendedLucideProps {
  size?: number;
  color?: string;
  style?: { marginRight?: number };
}

interface SearchBoxProps {
  onSearchResults: (results: any) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ onSearchResults }) => {
  const [location, setLocation] = useState('Delhi NCR');
  const [propertyType, setPropertyType] = useState('Flat/Apartment');
  const [searchQuery, setSearchQuery] = useState('');
  const [buyRent, setBuyRent] = useState<'Buy' | 'Rent' | 'Commercial'>('Buy');
  const [isLoading, setIsLoading] = useState(false);

  const propertyTypes = ['Flat/Apartment', 'Villa', 'Builder Floor', 'Plot', 'Independent House'];

  const locations = [
    'Delhi NCR',
    'Mumbai',
    'Bangalore',
    'Hyderabad',
    'Chennai',
    'Kolkata',
    'Pune',
  ];

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/properties/search', {
        params: {
          location,
          propertyType,
          searchQuery,
          listingType: buyRent,
        },
      });
      onSearchResults(response.data);
    } catch (error) {
      console.error('Error searching properties:', error);
      alert('Failed to search properties. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, buyRent === 'Buy' && styles.tabActive]}
          onPress={() => setBuyRent('Buy')}
        >
          <Home
            size={20}
            color={buyRent === 'Buy' ? '#FFFFFF' : '#4B5563'}
            style={styles.tabIcon}
            {...({} as ExtendedLucideProps)}
          />
          <Text style={[styles.tabText, buyRent === 'Buy' && styles.tabTextActive]}>Buy</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, buyRent === 'Rent' && styles.tabActive]}
          onPress={() => setBuyRent('Rent')}
        >
          <Home
            size={20}
            color={buyRent === 'Rent' ? '#FFFFFF' : '#4B5563'}
            style={styles.tabIcon}
            {...({} as ExtendedLucideProps)}
          />
          <Text style={[styles.tabText, buyRent === 'Rent' && styles.tabTextActive]}>Rent</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, buyRent === 'Commercial' && styles.tabActive]}
          onPress={() => setBuyRent('Commercial')}
        >
          <Store
            size={20}
            color={buyRent === 'Commercial' ? '#FFFFFF' : '#4B5563'}
            style={styles.tabIcon}
            {...({} as ExtendedLucideProps)}
          />
          <Text style={[styles.tabText, buyRent === 'Commercial' && styles.tabTextActive]}>
            Commercial
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Inputs */}
      <View style={styles.inputsContainer}>
        <View style={styles.locationDropdown}>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={location}
              onValueChange={(value) => setLocation(value)}
              style={styles.picker}
            >
              {locations.map((loc) => (
                <Picker.Item key={loc} label={loc} value={loc} />
              ))}
            </Picker>
          </View>
        </View>
        <View style={styles.searchQuery}>
          <TextInput
            style={styles.input}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search for locality, landmark, project or builder"
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      {/* Property Types */}
      <View style={styles.propertyTypesContainer}>
        {propertyTypes.map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.propertyTypeButton,
              propertyType === type && styles.propertyTypeButtonActive,
            ]}
            onPress={() => setPropertyType(type)}
          >
            <Text
              style={[
                styles.propertyTypeText,
                propertyType === type && styles.propertyTypeTextActive,
              ]}
            >
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Search Button */}
      <TouchableOpacity
        style={[styles.searchButton, isLoading && styles.searchButtonDisabled]}
        onPress={handleSearch}
        disabled={isLoading}
      >
        {isLoading ? (
          <View style={styles.searchButtonContent}>
            <ActivityIndicator size="small" color="#FFFFFF" style={styles.spinner} />
            <Text style={styles.searchButtonText}>Searching...</Text>
          </View>
        ) : (
          <View style={styles.searchButtonContent}>
            <Search
              size={20}
              color="#FFFFFF"
              style={styles.searchIcon}
              {...({} as ExtendedLucideProps)}
            />
            <Text style={styles.searchButtonText}>Search</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    margin: 16,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  tabActive: {
    backgroundColor: '#7C3AED',
  },
  tabIcon: {
    marginRight: 8,
  },
  tabText: {
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  inputsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  locationDropdown: {
    flex: 1,
    marginRight: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
  },
  picker: {
    height: 44,
  },
  searchQuery: {
    flex: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 6,
    padding: 12,
    fontSize: 14,
    color: '#1F2937',
    backgroundColor: '#FFFFFF',
  },
  propertyTypesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  propertyTypeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  propertyTypeButtonActive: {
    backgroundColor: '#7C3AED',
    borderColor: '#7C3AED',
  },
  propertyTypeText: {
    fontSize: 12,
    color: '#4B5563',
  },
  propertyTypeTextActive: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  searchButton: {
    backgroundColor: '#7C3AED',
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
  },
  searchButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  searchButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spinner: {
    marginRight: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default SearchBox;