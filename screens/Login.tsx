import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/Feather';
import { useAuthStore } from '../store/authStore';
import axios from 'axios';
import axiosInstance from '../services/axiosInstance';
import { User } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showApprovalRequest, setShowApprovalRequest] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');
  const [isSendingRequest, setIsSendingRequest] = useState(false);
  const [accountStatus, setAccountStatus] = useState('');
  const [userId, setUserId] = useState('');
  
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { setAuth, isAuthenticated } = useAuthStore();
  
  // Get the redirect path (if any)
  const from = route.params?.from;

  interface LoginResponse {
    _id: string;
    fullName?: string;
    email: string;
    contactNumber?: string;
    role: string;
    status: string;
    tier?: string;
    accessToken: string;
    refreshToken: string;
  }

  useEffect(() => {
    if (isAuthenticated) {
      navigation.replace(from || 'Home');
    }
  }, [navigation, from, isAuthenticated]);

  const handleLogin = async () => {
    setError('');
    setShowApprovalRequest(false);

    if (!email || !password) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please fill in all fields',
      });
      return;
    }

    setIsLoading(true);
    console.log('Login attempt started for:', email);

    try {
      const API_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'https://realestatesite-backend.onrender.com/api/v1';
      const response = await axiosInstance.post<LoginResponse>(`/RealEstateUser/login`, {
        email,
        password,
      });

      const data = response.data;
      console.log('Login response data:', data);

      if (data.status === 'pending') {
        setError('Your account is pending admin approval. You can send a request to expedite the process.');
        setAccountStatus('pending');
        setUserId(data._id);
        setShowApprovalRequest(true);
        Toast.show({
          type: 'info',
          text1: 'Account Pending Approval',
          text2: 'Your account is pending admin approval. You can request approval below.',
          visibilityTime: 500,
        });
        setIsLoading(false);
        return;
      }

      if (data.status === 'inactive') {
        setError('Your account has been deactivated. You can request reactivation below.');
        setAccountStatus('inactive');
        setUserId(data._id);
        setShowApprovalRequest(true);
        Toast.show({
          type: 'error',
          text1: 'Account Inactive',
          text2: 'Your account has been deactivated. You can request reactivation.',
          visibilityTime: 500,
        });
        setIsLoading(false);
        return;
      }

      // Store tokens using AsyncStorage instead of localStorage
      try {
        await AsyncStorage.setItem('accessToken', data.accessToken);
        await AsyncStorage.setItem('refreshToken', data.refreshToken);
      } catch (storageError) {
        console.error('Error storing tokens:', storageError);
        Toast.show({
          type: 'error',
          text1: 'Storage Error',
          text2: 'Failed to store authentication data',
        });
      }

      const userRole = String(data.role || '').toLowerCase() as User['role'];
      console.log('User role (normalized):', userRole);

      const validRoles: User['role'][] = ['buyer', 'seller', 'agent', 'admin'];
      const user: User = {
        _id: data._id,
        fullName: data.fullName || '',
        email: data.email,
        contactNumber: data.contactNumber || '',
        role: validRoles.includes(userRole) ? userRole : 'buyer',
        status: ['pending', 'active', 'inactive'].includes(data.status) ? (data.status as 'pending' | 'active' | 'inactive') : 'pending',
        tier: (['free', 'premium', 'enterprise'].includes(data.tier ?? '') ? data.tier! : 'free') as User['tier'],
      };

      setAuth(data.accessToken, data.refreshToken, user);
      console.log('Auth state set, user role:', userRole);

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'You have successfully logged in!',
      });

      setTimeout(() => {
        if (userRole === 'admin') {
          console.log('Navigating to admin dashboard');
          navigation.navigate('Admin');
        } else if (userRole === 'seller') {
          navigation.navigate('SellerDashboard');
        } else if (userRole === 'agent') {
          navigation.navigate('AgentDashboard');
        } else if (userRole === 'buyer') {
          navigation.navigate('BuyerDashboard');
        } else {
          console.log('Navigating to:', from || 'HomeScreen');
          navigation.navigate(from || 'HomeScreen');
        }
      }, 100);

    } catch (err) {
      console.error('Login Error:', err);

      if (axios.isAxiosError(err)) {
        const errorMessage = err.response?.data?.message || 'Invalid email or password';
        setError(errorMessage);
        Toast.show({
          type: 'error',
          text1: 'Login Failed',
          text2: errorMessage,
        });
      } else {
        setError('An unexpected error occurred. Please try again later.');
        Toast.show({
          type: 'error',
          text1: 'Login Failed',
          text2: 'An unexpected error occurred. Please try again later.',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendApprovalRequest = async () => {
    if (!userId) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'User information is missing. Please try logging in again.',
      });
      return;
    }

    setIsSendingRequest(true);

    try {
      const API_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'https://realestatesite-backend.onrender.com/api/v1';
      const response = await axios.post(`${API_URL}/RealEstateUser/request-approval`, {
        userId,
        email,
        requestType: accountStatus === 'pending' ? 'activation' : 'reactivation',
        message: requestMessage,
      });

      if (response.data.success) {
        Toast.show({
          type: 'success',
          text1: 'Request Sent',
          text2: 'Your approval request has been sent to administrators.',
        });
        setShowApprovalRequest(false);
      } else {
        throw new Error(response.data.message || 'Failed to send request');
      }
    } catch (err) {
      console.error('Approval Request Error:', err);
      if (axios.isAxiosError(err)) {
        Toast.show({
          type: 'error',
          text1: 'Request Failed',
          text2: err.response?.data?.message || 'Failed to send approval request. Please try again later.',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Request Failed',
          text2: 'Failed to send approval request. Please try again later.',
        });
      }
    } finally {
      setIsSendingRequest(false);
    }
  };

  // Use a simple View instead of ScrollView to avoid potential nesting issues
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleContainer}>
            <Icon name="home" size={24} color="#111827" />
            <Text style={styles.cardTitle}>Real Estate CRM</Text>
          </View>
          <Text style={styles.cardDescription}>Enter your credentials to sign in to your account</Text>
        </View>
        <View style={styles.cardContent}>
          {error && (
            <View style={styles.errorContainer}>
              <Icon name="alert-circle" size={20} color="#DC2626" style={styles.errorIcon} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {showApprovalRequest ? (
            <View style={styles.approvalRequestContainer}>
              <View style={styles.approvalCard}>
                <Text style={styles.approvalTitle}>Request Account Approval</Text>
                <Text style={styles.approvalText}>
                  Add a message to administrators explaining why your account should be{' '}
                  {accountStatus === 'pending' ? 'activated' : 'reactivated'}.
                </Text>
                <TextInput
                  style={styles.approvalInput}
                  multiline
                  numberOfLines={4}
                  placeholder="Please explain why you need access to the system..."
                  value={requestMessage}
                  onChangeText={setRequestMessage}
                />
                <View style={styles.approvalButtonContainer}>
                  <TouchableOpacity
                    style={[styles.button, styles.sendButton, (!requestMessage.trim() || isSendingRequest) && styles.buttonDisabled]}
                    onPress={handleSendApprovalRequest}
                    disabled={isSendingRequest || !requestMessage.trim()}
                  >
                    <Icon name="send" size={16} color="#FFFFFF" />
                    <Text style={styles.buttonText}>
                      {isSendingRequest ? 'Sending...' : 'Send Request'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.cancelButton]}
                    onPress={() => setShowApprovalRequest(false)}
                  >
                    <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  editable={!isLoading}
                />
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoComplete="current-password"
                  editable={!isLoading}
                />
              </View>
              <TouchableOpacity
                style={[styles.button, styles.signInButton, isLoading && styles.buttonDisabled]}
                onPress={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.buttonText}>Sign In</Text>
                )}
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.signupLink}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    padding: 16,
    alignItems: 'center',
  },
  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginLeft: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  cardContent: {
    padding: 16,
  },
  errorContainer: {
    backgroundColor: '#FEF2F2',
    padding: 12,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  errorIcon: {
    marginRight: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#DC2626',
    flex: 1,
  },
  approvalRequestContainer: {
    marginBottom: 16,
  },
  approvalCard: {
    backgroundColor: '#EFF6FF',
    padding: 16,
    borderRadius: 8,
  },
  approvalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E3A8A',
    marginBottom: 8,
  },
  approvalText: {
    fontSize: 14,
    color: '#1E3A8A',
    marginBottom: 12,
  },
  approvalInput: {
    backgroundColor: '#FFFFFF',
    borderColor: '#BFDBFE',
    borderWidth: 1,
    borderRadius: 6,
    padding: 12,
    fontSize: 14,
    color: '#111827',
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  approvalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  formContainer: {
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    color: '#111827',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 6,
  },
  signInButton: {
    backgroundColor: '#2563EB',
  },
  sendButton: {
    backgroundColor: '#2563EB',
    flex: 1,
    marginRight: 8,
  },
  cancelButton: {
    backgroundColor: '#E5E7EB',
    flex: 1,
  },
  buttonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
    marginLeft: 8,
  },
  cancelButtonText: {
    color: '#111827',
  },
  buttonDisabled: {
    backgroundColor: '#93C5FD',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    fontSize: 14,
    color: '#6B7280',
  },
  signupLink: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '500',
  },
});

export default Login;