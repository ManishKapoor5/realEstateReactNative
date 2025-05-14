// src/routes/SellerRoute.tsx
import React, { ReactNode, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../store/authStore';
import { StackNavigationProp } from '@react-navigation/stack';
//import { RootStackParamList } from '../navigation/types';

type RootStackParamList = {
  Login: undefined;
  // Add other routes here
};

type SellerRouteProps = {
  children: React.ReactElement;
};

const SellerRoute: React.FC<SellerRouteProps> = ({ children }) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user || user.role !== 'seller') {
      navigation.replace('Login'); // Redirect to Login screen
    }
  }, [user, navigation]);

  if (!user || user.role !== 'seller') {
    return null; // Or a loading spinner while redirecting
  }

  return <>{children}</>;
};

export default SellerRoute;