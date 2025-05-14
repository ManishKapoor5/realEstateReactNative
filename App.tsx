import * as Font from 'expo-font';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { StyleSheet, View, Text, ActivityIndicator, SafeAreaView } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Screen/component imports
import Home from './screens/Home';
import PropertyListings from './screens/PropertyListings';
import PropertyDetails from './screens/PropertyDetails';
import Login from './screens/Login';
import Signup from './screens/Signup';
import NotFound from './screens/NotFound';
import ProtectedRoute from './routes/ProtectedRoute';
import BuyerRoute from './routes/BuyerRoute';
import SellerRoute from './routes/SellerRoute';
import BuyerDashboard from './screens/BuyerDashboard';
import SellerDashboard from './screens/SellerDashboard';
import AddPropertyScreen from './screens/AddProperty';
import SearchBox from './components/SearchBox';
import AdminProtectedRoute from './components/common/AdminProtectedRoute';
import AppNavigator from './screens/AdminNewDashboard';
import { PropertiesTab } from './components/PropertiesTab';
import AgentsTab from './screens/Agents';
import SettingsTab from './components/SettingsTab';
import DashboardMetrics from './components/shared/Dashboard';
import AgentDashboard from './screens/AgentDashboard';
import EachPropertyDetails from './components/EachProperty';
import BuyerInquiriesTab from './screens/BuyerInquiry';
import PropertyLimitConfiguration from './components/PropertyLimitConfiguration';
import PropertyDetailPage from './screens/PropertyDetailPage';
import UpgradeTier from './components/UpgradeTier';



//import AdminDashboard from './components/AdminDashboard';

// Interfaces
interface Property {
  id: string;
  title: string;
  type: string;
  location: string;
  price: number;
  status: 'available' | 'sold' | 'pending';
  bedrooms?: number;
  bathrooms?: number;
  area: number;
  createdAt: Date;
  updatedAt: Date;
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

export type RootStackParamList = {
  Index: undefined;
  PropertyListings: undefined;
  PropertyDetails: undefined;
  UserDashboard: undefined;
  AddProperty: undefined;
  Contact: undefined;
  AboutUs: undefined;
  Login: undefined;
  Register: undefined;
  SearchBox: undefined;
  Property: { id: string };
  IndividualProperty: { id: string };
  UpgradeTier: undefined;
  Admin: undefined;
  Properties: undefined;
  Users: undefined;
  BuyerTierLimit: undefined;
  Settings: undefined;
  BuyerDashboard: undefined;
  SellerDashboard: undefined;
  AgentDashboard: undefined;
  NotFound: undefined;
};

// Add navigation types
import { StackNavigationProp } from '@react-navigation/stack';

type SearchBoxNavigationProp = StackNavigationProp<RootStackParamList, 'SearchBox'>;

interface SearchBoxScreenProps {
  navigation: SearchBoxNavigationProp;
}

const mockProperties: Property[] = [
  {
    id: 'prop-001',
    title: 'Luxury Apartment in Mumbai',
    type: 'Flat/Apartment',
    location: 'Mumbai',
    price: 12500000,
    status: 'available',
    bedrooms: 3,
    bathrooms: 2,
    area: 1450,
    createdAt: new Date('2025-03-12'),
    updatedAt: new Date('2025-04-01'),
  },
  {
    id: 'prop-002',
    title: 'Villa with Garden in Bangalore',
    type: 'Villa',
    location: 'Bangalore',
    price: 22000000,
    status: 'available',
    bedrooms: 4,
    bathrooms: 3,
    area: 2800,
    createdAt: new Date('2025-02-15'),
    updatedAt: new Date('2025-03-25'),
  },
  {
    id: 'prop-003',
    title: 'Commercial Plot in Delhi',
    type: 'Plot',
    location: 'Delhi',
    price: 35000000,
    status: 'sold',
    area: 5000,
    createdAt: new Date('2025-01-20'),
    updatedAt: new Date('2025-04-10'),
  },
];

const mockAgents: Agent[] = [
  {
    id: 'agent-001',
    name: 'Vivek Kumar',
    email: 'vivek.kumar@legacyland.com',
    phone: '+91 98765 43210',
    properties: 24,
    rating: 4.8,
    status: 'active',
  },
  {
    id: 'agent-002',
    name: 'Neha Verma',
    email: 'neha.verma@legacyland.com',
    phone: '+91 98765 12345',
    properties: 18,
    rating: 4.5,
    status: 'active',
  },
  {
    id: 'agent-003',
    name: 'Suresh Reddy',
    email: 'suresh.reddy@legacyland.com',
    phone: '+91 87654 32109',
    properties: 12,
    rating: 4.2,
    status: 'inactive',
  },
];

const queryClient = new QueryClient();
const Stack = createStackNavigator<RootStackParamList>();

// Component for Admin Dashboard Metrics
const AdminDashboardMetrics: React.FC = () => (
  <DashboardMetrics
    properties={mockProperties.length}
    available={mockProperties.filter(p => p.status === 'available').length}
    sold={mockProperties.filter(p => p.status === 'sold').length}
    agents={mockAgents.filter(a => a.status === 'active').length}
    totalValue={mockProperties.reduce((sum, p) => sum + p.price, 0)}
  />
);

// Component for BuyerDashboard with BuyerRoute
const ProtectedBuyerDashboard: React.FC = () => (
  <BuyerRoute>
    <BuyerDashboard />
  </BuyerRoute>
);

// Component for SellerDashboard with SellerRoute
const ProtectedSellerDashboard: React.FC = () => (
  <SellerRoute>
    <SellerDashboard />
  </SellerRoute>
);

const AdminDashboardWrapper: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Admin" component={AppNavigator} />
      <Stack.Screen name="Properties" component={PropertiesTab} />
      <Stack.Screen name="Users" component={AgentsTab} />
      <Stack.Screen name="BuyerTierLimit" component={PropertyLimitConfiguration} />
      <Stack.Screen name="Settings" component={SettingsTab} />
    </Stack.Navigator>
  );
};

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <SafeAreaProvider>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066cc" />
          <Text style={styles.loadingText}>Loading Legacy Land...</Text>
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <QueryClientProvider client={queryClient}>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Home" component={Home} />
              <Stack.Screen name="PropertyListings" component={PropertyListings} />
              <Stack.Screen name="PropertyDetails" component={PropertyDetails} />
              <Stack.Screen name="AddProperty" component={AddPropertyScreen} />
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="Register" component={Signup} />
              <Stack.Screen name="SearchBox">
                {({ navigation }: SearchBoxScreenProps) => (
                  <SearchBox onSearchResults={() => navigation.navigate('PropertyListings')} />
                )}
              </Stack.Screen>
              <Stack.Screen
                name="Property"
                component={EachPropertyDetails}
                options={{ headerShown: true, title: 'Property Details' }}
              />
              <Stack.Screen
                name="IndividualProperty"
                component={PropertyDetailPage}
                options={{ headerShown: true, title: 'Property' }}
                getId={({ id }: { id: string }) => id}
              />
              <Stack.Screen name="UpgradeTier" component={UpgradeTier} />
              <Stack.Screen name="Admin" component={AdminDashboardWrapper} />
              <Stack.Screen name="BuyerDashboard" component={ProtectedBuyerDashboard} />
              <Stack.Screen name="SellerDashboard" component={ProtectedSellerDashboard} />
              <Stack.Screen name="AgentDashboard" component={AgentDashboard} />
              <Stack.Screen name="NotFound" component={NotFound} />
            </Stack.Navigator>
            <Toast />
          </NavigationContainer>
        </QueryClientProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    fontSize: 16,
    color: '#333',
    marginTop: 10,
    fontWeight: '600',
  },
});

export default App;