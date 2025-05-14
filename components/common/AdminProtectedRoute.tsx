import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';

// Define navigation param list
type RootStackParamList = {
  Login: undefined;
  Unauthorized: undefined;
  [key: string]: undefined | object;
};

// Define navigation prop type
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface ProtectedRouteProps {
  component: React.ComponentType<any>;
  requiredRole?: string;
}

const AdminProtectedRoute: React.FC<ProtectedRouteProps> = ({ component: Component, requiredRole }) => {
  const navigation = useNavigation<NavigationProp>();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const role = await AsyncStorage.getItem('userRole');

        setIsAuthenticated(!!token);
        setUserRole(role);
      } catch (error) {
        console.error('Error checking auth:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  // If not authenticated, navigate to Login
  if (!isAuthenticated) {
    navigation.replace('Login');
    return null;
  }

  // If role is required but user doesn't have it, navigate to Unauthorized
  if (requiredRole && userRole !== requiredRole) {
    navigation.replace('Unauthorized');
    return null;
  }

  // Render the protected component
  return <Component />;
};

export default AdminProtectedRoute;