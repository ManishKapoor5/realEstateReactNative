import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { useRoute } from '@react-navigation/native'; // Assuming you're using React Navigation

const NotFound = () => {
  const route = useRoute();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      route.name
    );
  }, [route.name]);

  const handleHomePress = () => {
    // Replace with your navigation logic
    // For example, if using React Navigation:
    // navigation.navigate('Home');
    
    // Fallback to deep linking if navigation not available
    Linking.openURL('your-app-scheme://home');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>404</Text>
        <Text style={styles.subtitle}>Oops! Page not found</Text>
        <TouchableOpacity onPress={handleHomePress}>
          <Text style={styles.link}>Return to Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6', // gray-100 equivalent
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1f2937', // gray-800 equivalent
  },
  subtitle: {
    fontSize: 24,
    color: '#4b5563', // gray-600 equivalent
    marginBottom: 24,
  },
  link: {
    fontSize: 18,
    color: '#3b82f6', // blue-500 equivalent
    textDecorationLine: 'underline',
  },
});

export default NotFound;