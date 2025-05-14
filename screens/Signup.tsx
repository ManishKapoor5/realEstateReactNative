import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const Signup = () => {
  const navigation = useNavigation<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [approvalMessage, setApprovalMessage] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    contactNumber: '',
    role: 'buyer',
  });

  const API_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'https://realestatesite-backend.onrender.com';
  const requiresApproval = ['seller', 'agent'].includes(formData.role);

  const handleSubmit = async () => {
    setError('');

    if (requiresApproval && !approvalMessage.trim()) {
      setError('Please provide a message for administrators');
      Alert.alert("Error", "Please provide a message for administrators");
      return;
    }

    const payload = {
      ...formData,
      contactNumber: Number(formData.contactNumber),
      status: requiresApproval ? 'pending' : 'active',
    };

    try {
      setIsLoading(true);
      const response = await axios.post(`${API_URL}/RealEstateUser/signup`, payload);

      if (requiresApproval && response.data) {
        const userId = response.data._id;

        try {
          await axios.post(`${API_URL}/RealEstateUser/request-approval`, {
            userId,
            email: formData.email,
            requestType: 'activation',
            message: approvalMessage,
          });

          Alert.alert(
            "Registration Successful",
            `Your ${formData.role} account has been created. An approval request has been sent.`
          );
        } catch {
          Alert.alert(
            "Partial Success",
            "Account created, but approval request failed. Please login and request manually."
          );
        }
      } else {
        Alert.alert("Success", "Account created successfully!");
      }

      navigation.navigate('Login');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Signup failed';
      setError(message);
      Alert.alert("Signup Failed", message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Create an Account</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={formData.fullName}
        onChangeText={(text) => setFormData({ ...formData, fullName: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={formData.email}
        onChangeText={(text) => setFormData({ ...formData, email: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        keyboardType="phone-pad"
        value={formData.contactNumber}
        onChangeText={(text) => setFormData({ ...formData, contactNumber: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={formData.password}
        onChangeText={(text) => setFormData({ ...formData, password: text })}
      />

      <View style={styles.dropdownContainer}>
        <Text style={styles.label}>Select Role</Text>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => Alert.alert("Select Role", "Use a Picker component in production")}
        >
          <Text>{formData.role}</Text>
        </TouchableOpacity>
        {/* Replace above with Picker for production use */}
      </View>

      {requiresApproval && (
        <View>
          <Text style={styles.note}>
            {formData.role === 'seller'
              ? "Seller accounts require approval. Please explain your plans."
              : "Agent accounts require approval. Share your credentials and experience."}
          </Text>
          <TextInput
            style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
            multiline
            placeholder="Message for Administrators"
            value={approvalMessage}
            onChangeText={setApprovalMessage}
          />
        </View>
      )}

      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={isLoading}>
        {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Create Account</Text>}
      </TouchableOpacity>

      <Text style={styles.loginLink}>
        Already have an account?{' '}
        <Text onPress={() => navigation.navigate('Login')} style={styles.link}>Log in</Text>
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  error: {
    color: '#dc2626',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    borderColor: '#d1d5db',
    borderWidth: 1,
    borderRadius: 6,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#3b82f6',
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  loginLink: {
    marginTop: 20,
    textAlign: 'center',
  },
  link: {
    color: '#3b82f6',
    fontWeight: '500',
  },
  note: {
    backgroundColor: '#e0f2fe',
    padding: 10,
    borderRadius: 6,
    color: '#0369a1',
    marginBottom: 10,
  },
  dropdownContainer: {
    marginBottom: 10,
  },
  dropdown: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  label: {
    marginBottom: 4,
    fontWeight: '500',
  },
});

export default Signup;