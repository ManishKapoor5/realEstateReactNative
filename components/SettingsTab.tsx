import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

interface Property {
  id: string;
  title: string;
  type: string;
  location: string;
  price: number;
  status: 'available' | 'sold' | 'rented';
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  featuredImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'agent' | 'seller' | 'buyer';
  status: 'active' | 'inactive';
  createdAt: Date;
}

interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  properties: number;
  rating: number;
  status: 'active' | 'inactive';
}

interface FormValues {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  autoApprove: boolean;
  maxFileSize: string;
  currencySymbol: string;
  defaultLanguage: string;
  resultsPerPage: string;
}

const SettingsTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'properties' | 'display'>('general');
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState<FormValues>({
    siteName: 'Legacy Land Real Estate',
    siteDescription: 'Find Your Dream Property in India',
    contactEmail: 'admin@legacyland.com',
    contactPhone: '+91 98765 43210',
    autoApprove: false,
    maxFileSize: '5',
    currencySymbol: '₹',
    defaultLanguage: 'en',
    resultsPerPage: '10',
  });
  const [errors, setErrors] = useState<Partial<FormValues>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<FormValues> = {};
    if (!formValues.siteName) newErrors.siteName = 'Please enter site name';
    if (!formValues.contactEmail) {
      newErrors.contactEmail = 'Please enter contact email';
    } else if (!/\S+@\S+\.\S+/.test(formValues.contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid email';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setLoading(false);
        alert('Settings updated successfully');
      }, 1000);
    }
  };

  const handleReset = () => {
    setFormValues({
      siteName: 'Legacy Land Real Estate',
      siteDescription: 'Find Your Dream Property in India',
      contactEmail: 'admin@legacyland.com',
      contactPhone: '+91 98765 43210',
      autoApprove: false,
      maxFileSize: '5',
      currencySymbol: '₹',
      defaultLanguage: 'en',
      resultsPerPage: '10',
    });
    setErrors({});
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <View style={styles.tabContent}>
            <View style={styles.formRow}>
              <View style={styles.formItem}>
                <Text style={styles.label}>Site Name</Text>
                <TextInput
                  style={[styles.input, errors.siteName && styles.inputError]}
                  value={formValues.siteName}
                  onChangeText={(text) => setFormValues({ ...formValues, siteName: text })}
                  placeholder="Enter site name"
                />
                {errors.siteName && <Text style={styles.errorText}>{errors.siteName}</Text>}
              </View>
              <View style={styles.formItem}>
                <Text style={styles.label}>Site Description</Text>
                <TextInput
                  style={styles.input}
                  value={formValues.siteDescription}
                  onChangeText={(text) => setFormValues({ ...formValues, siteDescription: text })}
                  placeholder="Enter site description"
                />
              </View>
            </View>
            <View style={styles.formRow}>
              <View style={styles.formItem}>
                <Text style={styles.label}>Contact Email</Text>
                <TextInput
                  style={[styles.input, errors.contactEmail && styles.inputError]}
                  value={formValues.contactEmail}
                  onChangeText={(text) => setFormValues({ ...formValues, contactEmail: text })}
                  placeholder="Enter contact email"
                  keyboardType="email-address"
                />
                {errors.contactEmail && <Text style={styles.errorText}>{errors.contactEmail}</Text>}
              </View>
              <View style={styles.formItem}>
                <Text style={styles.label}>Contact Phone</Text>
                <TextInput
                  style={styles.input}
                  value={formValues.contactPhone}
                  onChangeText={(text) => setFormValues({ ...formValues, contactPhone: text })}
                  placeholder="Enter contact phone"
                  keyboardType="phone-pad"
                />
              </View>
            </View>
          </View>
        );
      case 'properties':
        return (
          <View style={styles.tabContent}>
            <View style={styles.formRow}>
              <View style={styles.formItem}>
                <Text style={styles.label}>Auto-approve Property Listings</Text>
                <Switch
                  value={formValues.autoApprove}
                  onValueChange={(value) => setFormValues({ ...formValues, autoApprove: value })}
                />
              </View>
              <View style={styles.formItem}>
                <Text style={styles.label}>Max Image Upload Size (MB)</Text>
                <TextInput
                  style={styles.input}
                  value={formValues.maxFileSize}
                  onChangeText={(text) => setFormValues({ ...formValues, maxFileSize: text })}
                  placeholder="Enter max file size"
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>
        );
      case 'display':
        return (
          <View style={styles.tabContent}>
            <View style={styles.formRow}>
              <View style={styles.formItem}>
                <Text style={styles.label}>Currency Symbol</Text>
                <TextInput
                  style={styles.input}
                  value={formValues.currencySymbol}
                  onChangeText={(text) => setFormValues({ ...formValues, currencySymbol: text })}
                  placeholder="Enter currency symbol"
                />
              </View>
              <View style={styles.formItem}>
                <Text style={styles.label}>Default Language</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={formValues.defaultLanguage}
                    onValueChange={(value) =>
                      setFormValues({ ...formValues, defaultLanguage: value })
                    }
                    style={styles.picker}
                  >
                    <Picker.Item label="English" value="en" />
                    <Picker.Item label="Hindi" value="hi" />
                    <Picker.Item label="Tamil" value="ta" />
                    <Picker.Item label="Telugu" value="te" />
                  </Picker>
                </View>
              </View>
            </View>
            <View style={styles.formRow}>
              <View style={styles.formItem}>
                <Text style={styles.label}>Results Per Page</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={formValues.resultsPerPage}
                    onValueChange={(value) =>
                      setFormValues({ ...formValues, resultsPerPage: value })
                    }
                    style={styles.picker}
                  >
                    <Picker.Item label="10" value="10" />
                    <Picker.Item label="20" value="20" />
                    <Picker.Item label="50" value="50" />
                    <Picker.Item label="100" value="100" />
                  </Picker>
                </View>
              </View>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>General Settings</Text>
        <View style={styles.tabs}>
          {['General', 'Properties', 'Display'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tab,
                activeTab === tab.toLowerCase() && styles.tabActive,
              ]}
              onPress={() => setActiveTab(tab.toLowerCase() as 'general' | 'properties' | 'display')}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab.toLowerCase() && styles.tabTextActive,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {renderTabContent()}
        <View style={styles.formActions}>
          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.saveButton, loading && styles.saveButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.saveButtonText}>Save Settings</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    marginBottom: 16,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#3B82F6',
  },
  tabText: {
    fontSize: 16,
    color: '#6B7280',
  },
  tabTextActive: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  tabContent: {
    marginBottom: 16,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  formItem: {
    flex: 1,
    marginRight: 8,
  },
  label: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 8,
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
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
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
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  resetButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 6,
    marginRight: 8,
  },
  resetButtonText: {
    fontSize: 14,
    color: '#4B5563',
  },
  saveButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#3B82F6',
    borderRadius: 6,
  },
  saveButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  saveButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default SettingsTab;