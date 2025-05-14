import React from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Login: undefined;
  // Add other routes here
};

type BuyerRouteProps = {
  children: React.ReactElement;
};

const BuyerRoute: React.FC<BuyerRouteProps> = ({ children }) => {
  const { user } = useAuthStore();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  React.useEffect(() => {
    if (!user || user.role !== 'buyer') {
      navigation.replace('Login');
    }
  }, [user, navigation]);

  if (user && user.role === 'buyer') {
    return children;
  }

  // Return null or loading indicator while redirecting
  return null;
};

export default BuyerRoute;