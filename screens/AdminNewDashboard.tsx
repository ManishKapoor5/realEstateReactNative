import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  StatusBar, 
  Platform, 
  ScrollView, 
  TouchableOpacity,
  Dimensions,
  Animated,
  Modal
} from 'react-native';
import { Button, TextInput, Card } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Property, User } from '../types/property';
import { useNavigation } from '@react-navigation/native';

// Import the screens that will be used as "outlets"
import Agents from '../screens/Agents';
import SettingsTab from '../components/SettingsTab';
import PropertyLimitConfiguration from '../components/PropertyLimitConfiguration';
import { PropertiesTab } from '../components/PropertiesTab';
import DashboardMetrics from '../components/shared/Dashboard';
import PropertyForm from '../components/PropertyForm';
import axiosInstance from '../services/axiosInstance';
import axios from 'axios';

// Define a type for the stack navigation
type StackParamList = {
  DashboardOverview: undefined;
  Properties: undefined;
  Agents: undefined;
  Settings: undefined;
  UsersAndAgents: undefined;
  Login: undefined;
};

// Define a type for the Header component props
interface HeaderProps {
  onMenuPress: () => void;
  onLogout: () => void;
}

// Header component with proper type definition
const Header: React.FC<HeaderProps> = ({ onMenuPress, onLogout }) => {
  return (
    <View style={headerStyles.container}>
      <TouchableOpacity onPress={onMenuPress}>
        <Icon name="menu" size={24} color="#333" />
      </TouchableOpacity>
      <Text style={headerStyles.title}>Legacy Land</Text>
      <View style={headerStyles.iconContainer}>
        <TouchableOpacity style={headerStyles.iconButton} onPress={onLogout}>
          <Icon name="logout" size={24} color="#333" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const headerStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  iconContainer: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 16,
  },
});

// Dashboard Overview component
const DashboardOverview: React.FC = () => (
  <ScrollView style={styles.contentContainer}>
    <View style={styles.welcomeSection}>
      <Text style={styles.welcomeTitle}>Welcome to your Dashboard</Text>
      <Text style={styles.welcomeSubtitle}>Manage your properties, agents, and settings all in one place</Text>
    </View>
    
    <View style={styles.statsContainer}>
      <View style={styles.statCard}>
        <View style={styles.statIconContainer}>
          <Icon name="home" size={24} color="#3B82F6" />
        </View>
        <Text style={styles.statValue}>24</Text>
        <Text style={styles.statLabel}>Total Properties</Text>
      </View>
      
      <View style={styles.statCard}>
        <View style={styles.statIconContainer}>
          <Icon name="people" size={24} color="#10B981" />
        </View>
        <Text style={styles.statValue}>12</Text>
        <Text style={styles.statLabel}>Active Agents</Text>
      </View>
      
      <View style={styles.statCard}>
        <View style={styles.statIconContainer}>
          <Icon name="trending-up" size={24} color="#F59E0B" />
        </View>
        <Text style={styles.statValue}>8</Text>
        <Text style={styles.statLabel}>Pending Listings</Text>
      </View>
    </View>
  </ScrollView>
);

// Create a stack navigator
const Stack = createStackNavigator<StackParamList>();

// Simplified AdminDashboardNavigator that doesn't require a ref
const AdminDashboardNavigator: React.FC<{activeScreen: keyof StackParamList}> = ({ activeScreen }) => {
  const [data, setData] = useState<Property[]>([]);
  const [agentdatainfo, setAgentDatainfo] = useState<User[]>([])
  const [total, setTotal] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [agentcount, setAgentCount] = useState<number>(0);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axiosInstance.get<{ data: any[] }>('/Property/getAll');
        //const responseagent = await axiosInstance.get<{agentdata : any[]}>('/RealEstateUser/getAllAgentsAndSellers')
        
        setData(response.data.data);
        //setAgentDatainfo(responseagent.data.agentdata)
        
        const availableCount = response.data.data.filter((prop) => prop.status.toLowerCase() === 'available').length;
        const soldCount = response.data.data.filter((prop) => prop.status.toLowerCase() === 'sold').length;
        const agentCount = agentdatainfo.filter((prop) => prop.role.toLowerCase() === 'agent').length;
        
        setTotal(availableCount);
        setCount(soldCount);
        setAgentCount(agentCount);
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };
    
    fetchProperties();
  }, []);

  // Use a key to force re-render when active screen changes
  const renderComponent = () => {
    switch(activeScreen) {
      case 'DashboardOverview':
        return <DashboardMetrics totalValue={total} sold={count} agents={agentcount} available={total-count} properties={total} />;
      case 'Properties':
        return <PropertiesTab />;
      case 'Agents':
        return <Agents />;
      case 'Settings':
        return <SettingsTab />;
      case 'UsersAndAgents':
        return <PropertyLimitConfiguration />;
      default:
        return <DashboardMetrics totalValue={total} sold={count} agents={agentcount} available={total-count} properties={total} />;
    }
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {renderComponent()}
      </View>
    </ScrollView>
  );
};

// Revised SidebarMenu props
interface SidebarMenuProps {
  onNavigate: (screen: keyof StackParamList) => void;
  activeScreen: string;
  closeSidebar: () => void;
  isTablet: boolean;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ 
  onNavigate, 
  activeScreen, 
  closeSidebar, 
  isTablet 
}) => {
  
  const navigateTo = (screen: keyof StackParamList) => {
    onNavigate(screen);
    if (!isTablet) {
      closeSidebar();
    }
  };
  
  const menuItems = [
    { id: 'DashboardOverview', icon: 'dashboard', label: 'Dashboard' },
    { id: 'Properties', icon: 'home', label: 'Properties' },
    { id: 'Agents', icon: 'people', label: 'Agents' },
    { id: 'UsersAndAgents', icon: 'group', label: 'Users & Agents' },
    { id: 'Settings', icon: 'settings', label: 'Settings' },
  ];
  
  return (
    <View style={[
      styles.sidebar,
      isTablet ? styles.tabletSidebar : styles.mobileSidebar
    ]}>
      <View style={styles.sidebarHeader}>
        <Text style={styles.sidebarTitle}>Legacy Land</Text>
        {!isTablet && (
          <TouchableOpacity onPress={closeSidebar}>
            <Icon name="close" size={24} color="#FFF" />
          </TouchableOpacity>
        )}
      </View>
      
      <ScrollView style={styles.sidebarContent}>
        {menuItems.map(item => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.sidebarItem,
              activeScreen === item.id && styles.sidebarItemActive
            ]}
            onPress={() => navigateTo(item.id as keyof StackParamList)}
          >
            <Icon 
              name={item.icon} 
              size={22} 
              color={activeScreen === item.id ? '#3B82F6' : '#9CA3AF'} 
            />
            <Text style={[
              styles.sidebarItemText,
              activeScreen === item.id && styles.sidebarItemTextActive
            ]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

// Revised approach: Use a custom navigation handler instead of ref
const AdminNewDashboard: React.FC = () => {
  const navigation = useNavigation();
  const [propertyFormVisible, setPropertyFormVisible] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [activeScreen, setActiveScreen] = useState<keyof StackParamList>('DashboardOverview');
  const [windowDimensions, setWindowDimensions] = useState(Dimensions.get('window'));
  const [isTablet, setIsTablet] = useState(windowDimensions.width >= 768);
  const [logoutConfirmVisible, setLogoutConfirmVisible] = useState(false);
  
  // Sidebar animation
  const slideAnim = useRef(new Animated.Value(-300)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  
  // Create a custom navigation handler function instead of using ref
  const handleNavigate = (screen: keyof StackParamList) => {
    setActiveScreen(screen);
    // Hide the property form when navigating
    setPropertyFormVisible(false);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      // Clear auth token from AsyncStorage
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userData');
      
      // Show success message
      Toast.show({
        type: 'success',
        text1: 'Logged Out',
        text2: 'You have been successfully logged out.',
      });
      
      // Hide logout confirmation modal
      setLogoutConfirmVisible(false);
      
      // Navigate to login screen
      // @ts-ignore - We know Login exists in our navigation
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Logout error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to log out. Please try again.',
      });
    }
  };

  // Update dimensions when screen size changes
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setWindowDimensions(window);
      setIsTablet(window.width >= 768);
      
      // Auto-show sidebar in tablet mode, hide in mobile mode
      if (window.width >= 768) {
        setSidebarVisible(true);
      } else {
        setSidebarVisible(false);
      }
    });

    // Set initial sidebar visibility based on screen size
    setIsTablet(windowDimensions.width >= 768);
    setSidebarVisible(windowDimensions.width >= 768);

    return () => subscription?.remove();
  }, []);

  // Handle sidebar animation
  useEffect(() => {
    if (sidebarVisible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0.5,
          duration: 250,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -300,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        })
      ]).start();
    }
  }, [sidebarVisible, slideAnim, overlayOpacity]);

  const handlePropertySubmit = async (data: any) => {
    // Handle form submission logic
    try {
      // Add your API call or local storage logic here
      const response = await axiosInstance.post('/Property/create', data);
      
      if (response.status === 200 || response.status === 201) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Property has been added successfully.',
        });
        setPropertyFormVisible(false);
        
        // Refresh property data if we're on properties screen
        if (activeScreen === 'Properties') {
          // You would typically call your fetch properties function here
        }
      } else {
        throw new Error('Failed to add property');
      }
    } catch (error) {
      console.error('Error submitting property:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to add property. Please try again.',
      });
    }
  };

  // Function to toggle sidebar
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  // Calculate main container styles
  const mainContainerStyle = [
    styles.mainContainer,
    isTablet && sidebarVisible && styles.mainContainerWithSidebar
  ];

  // Render logout confirmation modal
  const renderLogoutConfirmation = () => (
    <Modal
      visible={logoutConfirmVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setLogoutConfirmVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Confirm Logout</Text>
          <Text style={styles.modalText}>Are you sure you want to log out?</Text>
          <View style={styles.modalActions}>
            <Button 
              mode="outlined" 
              onPress={() => setLogoutConfirmVisible(false)}
              style={styles.modalCancelButton}
            >
              Cancel
            </Button>
            <Button 
              mode="contained" 
              onPress={handleLogout}
              style={styles.modalConfirmButton}
            >
              Logout
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );

  // Render property form modal with overlay
  const renderPropertyFormModal = () => (
    <Modal
      visible={propertyFormVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setPropertyFormVisible(false)}
    >
      <View style={styles.propertyFormOverlay}>
        <View style={styles.propertyFormContent}>
          <View style={styles.propertyFormHeader}>
            <Text style={styles.propertyFormTitle}>Add New Property</Text>
            <TouchableOpacity 
              onPress={() => setPropertyFormVisible(false)}
              style={styles.propertyFormCloseButton}
            >
              <Icon name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.propertyFormScrollView}>
            <PropertyForm 
              open={propertyFormVisible} 
              onOpenChange={(isOpen) => setPropertyFormVisible(isOpen)} 
              onSubmit={handlePropertySubmit} 
            />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <View style={styles.appContainer}>
        {/* Overlay to close sidebar on tap (mobile only) */}
        {!isTablet && sidebarVisible && (
          <Animated.View 
            style={[
              styles.overlay,
              { opacity: overlayOpacity }
            ]}
            onTouchStart={() => setSidebarVisible(false)}
          />
        )}
        
        {/* Sidebar implementation - always rendered in tablet mode, animated in mobile mode */}
        {isTablet ? (
          sidebarVisible && (
            <SidebarMenu 
              onNavigate={handleNavigate}
              activeScreen={activeScreen}
              closeSidebar={() => setSidebarVisible(false)}
              isTablet={isTablet}
            />
          )
        ) : (
          <Animated.View 
            style={[
              styles.animatedSidebarContainer,
              { transform: [{ translateX: slideAnim }] }
            ]}
          >
            {sidebarVisible && (
              <SidebarMenu 
                onNavigate={handleNavigate}
                activeScreen={activeScreen}
                closeSidebar={() => setSidebarVisible(false)}
                isTablet={isTablet}
              />
            )}
          </Animated.View>
        )}
        
        <ScrollView style={mainContainerStyle}>
          <View style={styles.contentWrapper}>
            {/* Header */}
            <Header 
              onMenuPress={toggleSidebar} 
              onLogout={() => setLogoutConfirmVisible(true)} 
            />
            
            {/* Dashboard header with title and add button */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>
                {activeScreen === 'DashboardOverview' ? 'Dashboard Overview' : 
                 activeScreen === 'Properties' ? 'Property Management' :
                 activeScreen === 'Agents' ? 'Agents Management' :
                 activeScreen === 'Settings' ? 'Application Settings' :
                 activeScreen === 'UsersAndAgents' ? 'Users & Agents' : 'Dashboard'}
              </Text>
              <Button
                mode="contained"
                onPress={() => setPropertyFormVisible(true)}
                style={styles.addButton}
                labelStyle={styles.addButtonLabel}
                icon={windowDimensions.width < 400 ? "plus" : undefined}
              >
                {windowDimensions.width < 400 ? '' : 'Add Property'}
              </Button>
            </View>
            
            {/* This is the equivalent of the <Outlet /> in React Router */}
            <View style={styles.outletContainer}>
              <AdminDashboardNavigator activeScreen={activeScreen} />
            </View>
          </View>
        </ScrollView>
      </View>
      
      {/* Property Form Modal */}
      {renderPropertyFormModal()}
      
      {/* Logout Confirmation Modal */}
      {renderLogoutConfirmation()}
      
      {/* Toast for notifications */}
      <Toast />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  appContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  contentWrapper: {
    flexGrow: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
    zIndex: 998,
  },
  animatedSidebarContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 280,
    zIndex: 999,
  },
  mainContainer: {
    flex: 1,
  },
  mainContainerWithSidebar: {
    marginLeft: 280,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  addButton: {
    borderRadius: 8,
  },
  addButtonLabel: {
    fontSize: 14,
  },
  outletContainer: {
    flex: 1,
  },
  // Modal styles for logout confirmation
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    width: '80%',
    maxWidth: 400,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 24,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalCancelButton: {
    marginRight: 10,
  },
  modalConfirmButton: {
    backgroundColor: '#f44336',
  },
  // Property form modal styles
  propertyFormOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  propertyFormContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    width: '90%',
    maxWidth: 600,
    maxHeight: '90%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  propertyFormHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  propertyFormTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  propertyFormCloseButton: {
    padding: 4,
  },
  propertyFormScrollView: {
    padding: 16,
  },
  // Form card styles
  formCard: {
    margin: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  formScrollView: {
    maxHeight: 400,
  },
  formRow: {
    flexDirection: 'row',
    marginHorizontal: -4,
    marginBottom: 12,
  },
  formColumn: {
    flex: 1,
    paddingHorizontal: 4,
  },
  input: {
    marginBottom: 12,
  },
  textArea: {
    height: 100,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 12,
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  cancelButton: {
    marginRight: 8,
  },
  submitButton: {
    minWidth: 120,
  },
  // Mobile and Tablet Sidebar Styles
  mobileSidebar: {
    width: 280,
    height: '100%',
  },
  tabletSidebar: {
    width: 280,
    height: '100%',
    position: 'relative',
  },
  // Sidebar Styles
  sidebar: {
    backgroundColor: '#1F2937',
    height: '100%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  sidebarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  sidebarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  sidebarContent: {
    flex: 1,
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  sidebarItemActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderLeftWidth: 3,
    borderLeftColor: '#3B82F6',
  },
  sidebarItemText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#9CA3AF',
  },
  sidebarItemTextActive: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  // Dashboard overview styles
  contentContainer: {
    flex: 1,
  },
  welcomeSection: {
    padding: 16,
    marginBottom: 16,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    margin: 4,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  quickActionsSection: {
    padding: 16,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  actionButtonText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
    marginLeft: 8,
  },
});

export default AdminNewDashboard;