import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Switch
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/Feather';

// Define types
import { TierLimit, LimitConfig } from '../types';
import { useLimitConfigStore } from '../store/limitConfigStore';
import { useAuthStore } from '../store/authStore';
import { wrap } from 'lodash';

// Define navigation type
type RootStackParamList = {
  Login: undefined;
  Home: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const PropertyLimitConfiguration: React.FC = () => {
  // Use store hooks at the component level
  const {
    limitConfig,
    isLoading,
    error,
    fetchLimitConfig,
    updateLimitConfig,
    clearError,
  } = useLimitConfigStore();

  const navigation = useNavigation<NavigationProp>();
  const { logout, accessToken } = useAuthStore();
  
  // Local state
  const [buyerTiers, setBuyerTiers] = useState<TierLimit[]>([]);
  const [showLimitExceededNotice, setShowLimitExceededNotice] = useState<boolean>(true);
  const [allowWaitlist, setAllowWaitlist] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Check authentication
  useEffect(() => {
    if (!accessToken) {
      Toast.show({
        type: 'error',
        text1: 'Session expired',
        text2: 'Please log in again',
      });
      logout();
      navigation.navigate('Login');
    }
  }, [accessToken, logout, navigation]);

  // Fetch configuration on component mount
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        await fetchLimitConfig();
      } catch (error) {
        console.error('API fetch failed:', error);
        if (error instanceof Error && 
            (error.message.includes('401') || error.message.includes('Unauthorized'))) {
          Toast.show({
            type: 'error',
            text1: 'Unauthorized',
            text2: 'Please log in again',
          });
          logout();
          navigation.navigate('Login');
        } else {
          // Attempt to load from backup if API fails
          try {
            // AsyncStorage would be better but using localStorage for simplicity in conversion
            const backupConfig = localStorage.getItem('limitConfigBackup');
            if (backupConfig) {
              const parsedConfig: LimitConfig = JSON.parse(backupConfig);
              setBuyerTiers(parsedConfig.tiers);
              setShowLimitExceededNotice(parsedConfig.showLimitExceededNotice);
              setAllowWaitlist(parsedConfig.allowWaitlist);
            }
          } catch (e) {
            console.error('Failed to parse backup config:', e);
          }
        }
      }
    };
    
    fetchConfig();
  }, [fetchLimitConfig, logout, navigation]);

  // Update local state when limitConfig changes
  useEffect(() => {
    if (limitConfig && limitConfig.tiers) {
      setBuyerTiers(limitConfig.tiers);
      setShowLimitExceededNotice(limitConfig.showLimitExceededNotice);
      setAllowWaitlist(limitConfig.allowWaitlist);
    }
  }, [limitConfig]);

  // Handle and display errors from the store
  useEffect(() => {
    if (error) {
      Toast.show({
        type: 'error',
        text1: error,
      });
      clearError();
    }
  }, [error, clearError]);

  // Update a specific tier's property limit
  const updatePropertyLimit = (tierId: string, newLimit: string): void => {
    const limit = parseInt(newLimit);
    if (isNaN(limit) || limit < 0) return;

    setBuyerTiers((tiers) =>
      tiers.map((tier) =>
        tier.id === tierId ? { ...tier, propertyLimit: limit } : tier
      )
    );

    setIsSaved(false);
    setSaveError(null);
  };

  // Save configuration
  const saveConfiguration = async (): Promise<void> => {
    setIsSaving(true);
    setSaveError(null);
    
    try {
      const hasInvalidLimits = buyerTiers.some(
        (tier: TierLimit) => tier.propertyLimit === 0 || tier.propertyLimit > 500
      );
      
      if (hasInvalidLimits) {
        setSaveError('Property limits must be between 1 and 500');
        return;
      }
      
      const updatedConfig: LimitConfig = {
        tiers: buyerTiers,
        showLimitExceededNotice,
        allowWaitlist,
      };
      
      console.log('Saving config:', updatedConfig);
      await updateLimitConfig(updatedConfig);
      // AsyncStorage would be better, using localStorage for simplicity in conversion
      localStorage.setItem('limitConfigBackup', JSON.stringify(updatedConfig));
      
      setIsSaved(true);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Property limit configuration saved successfully',
      });
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error: unknown) {
      let errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to save configuration';
        
      if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
        errorMessage = 'Unauthorized: Please log in again';
        logout();
        navigation.navigate('Login');
      }
      
      setSaveError(errorMessage);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errorMessage,
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Loading state
  if (isLoading || !limitConfig) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4299e1" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Property Viewing Limit Configuration</Text>
          <Text style={styles.subtitle}>
            Control how many properties buyers can view based on their account tier.
          </Text>
        </View>

        <View style={styles.infoBox}>
          <Icon name="info" size={20} color="#4299e1" style={styles.infoIcon} />
          <View>
            <Text style={styles.infoTitle}>Configuration Guide</Text>
            <Text style={styles.infoText}>
              Set the maximum number of properties each buyer tier can view.
              The system will automatically enforce these limits for property viewing.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="users" size={20} color="#666" style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>Buyer Tier Property Limits</Text>
          </View>

          <View style={styles.tierContainer}>
            <View style={styles.tierHeader}>
              <Text style={[styles.headerCell, { flex: 4 }]}>Tier Name</Text>
              <Text style={[styles.headerCell, { flex: 3 }]}>Property Limit</Text>
              <Text style={[styles.headerCell, { flex: 5 }]}>Description</Text>
            </View>

            {buyerTiers && buyerTiers.length > 0 ? (
              buyerTiers.map((tier) => (
                <View key={tier.id} style={styles.tierRow}>
                  <Text style={[styles.tierCell, styles.tierName, { flex: 4 }]}>{tier.name}</Text>
                  <View style={[styles.tierCell, { flex: 3, flexDirection: 'row', alignItems: 'center' }]}>
                    <TextInput
                      style={styles.input}
                      keyboardType="numeric"
                      value={tier.propertyLimit.toString()}
                      onChangeText={(value) => updatePropertyLimit(tier.id, value)}
                    />
                    <Text style={styles.inputLabel}></Text>
                  </View>
                  <Text style={[styles.tierCell, styles.tierDescription, { flex: 5 }]}>{tier.description}</Text>
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No tiers available</Text>
              </View>
            )}
          </View>
        </View>

        {/* Uncomment if needed - Limit Behavior Settings
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="alert-circle" size={20} color="#666" style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>Limit Behavior Settings</Text>
          </View>

          <View style={styles.behaviorContainer}>
            <View style={styles.switchRow}>
              <Switch
                value={showLimitExceededNotice}
                onValueChange={setShowLimitExceededNotice}
                trackColor={{ false: '#d1d5db', true: '#93c5fd' }}
                thumbColor={showLimitExceededNotice ? '#3b82f6' : '#f4f3f4'}
              />
              <View style={styles.switchTextContainer}>
                <Text style={styles.switchLabel}>Show limit exceeded notice</Text>
                <Text style={styles.switchDescription}>
                  Display a notification when buyers reach their property viewing limit
                </Text>
              </View>
            </View>

            <View style={styles.switchRow}>
              <Switch
                value={allowWaitlist}
                onValueChange={setAllowWaitlist}
                trackColor={{ false: '#d1d5db', true: '#93c5fd' }}
                thumbColor={allowWaitlist ? '#3b82f6' : '#f4f3f4'}
              />
              <View style={styles.switchTextContainer}>
                <Text style={styles.switchLabel}>Allow waitlist for additional properties</Text>
                <Text style={styles.switchDescription}>
                  Enable buyers to join a waitlist for properties beyond their limit
                </Text>
              </View>
            </View>
          </View>
        </View>
        */}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
            onPress={saveConfiguration}
            disabled={isSaving}
          >
            {isSaving ? (
              <View style={styles.savingContainer}>
                <ActivityIndicator size="small" color="#fff" />
                <Text style={styles.buttonText}>Saving...</Text>
              </View>
            ) : (
              <View style={styles.savingContainer}>
                <Icon name="save" size={16} color="#fff" style={styles.saveIcon} />
                <Text style={styles.buttonText}>Save Configuration</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {isSaved && (
          <View style={styles.successMessage}>
            <Text style={styles.successText}>
              Property limit configuration saved successfully!
            </Text>
          </View>
        )}

        {saveError && (
          <View style={styles.errorMessage}>
            <Text style={styles.errorText}>{saveError}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  infoBox: {
    backgroundColor: '#ebf5ff',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#bfdbfe',
    
  },
  infoIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1e40af',
    marginBottom: 2,
  },
  infoText: {
    fontSize: 13,
    color: '#1e3a8a',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionIcon: {
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#374151',
  },
  tierContainer: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
  },
  tierHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f3f4f6',
  },
  headerCell: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6b7280',
  },
  tierRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  tierCell: {
    paddingRight: 8,

  },
  tierName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  tierDescription: {
    fontSize: 13,
    color: '#6b7280',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    width: 60,
    textAlign: 'center',
    fontSize: 14,
    color: '#374151',
  },
  inputLabel: {
    fontSize: 13,
    color: '#6b7280',
    marginLeft: 8,
  },
  emptyState: {
    padding: 12,
  },
  emptyText: {
    color: '#6b7280',
  },
  behaviorContainer: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 16,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  switchTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 2,
  },
  switchDescription: {
    fontSize: 13,
    color: '#6b7280',
  },
  buttonContainer: {
    alignItems: 'flex-end',
    marginTop: 24,
  },
  saveButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  savingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  saveIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
  },
  successMessage: {
    backgroundColor: '#ecfdf5',
    padding: 12,
    borderRadius: 6,
    marginTop: 16,
    alignItems: 'center',
  },
  successText: {
    color: '#047857',
  },
  errorMessage: {
    backgroundColor: '#fef2f2',
    padding: 12,
    borderRadius: 6,
    marginTop: 16,
    alignItems: 'center',
  },
  errorText: {
    color: '#b91c1c',
  },
});

export default PropertyLimitConfiguration;