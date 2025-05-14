// import React, { useState, useEffect, useCallback } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   TextInput,
//   FlatList,
//   Image,
//   Modal,
//   ActivityIndicator,
//   StyleSheet,
//   Dimensions,
//   ScrollView,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useNavigation } from '@react-navigation/native';
// import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import Icon from 'react-native-vector-icons/Feather';
// import axiosInstance from '../services/axiosInstance';
// import Header from '../components/Header';
// import { useLimitConfigStore } from '../store/limitConfigStore';
// import  usePropertyStore  from '../store/propertyStore';
// import { useAuthStore } from '../store/authStore';

// // Navigation types
// type RootStackParamList = {
//   Login: undefined;
//   IndividualProperty: { propertyId: string };
//   UpgradeTier: { tierId: string };
//   BuyerDashboard: undefined;
// };

// type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// // Types based on provided MongoDB structure
// interface User {
//   _id: string;
//   fullName: string;
//   email: string;
//   contactNumber: string | number;
//   role: 'admin' | 'agent' | 'seller' | 'buyer';
//   status: 'pending' | 'active' | 'inactive';
//   isVerified: boolean;
//   tier?: 'free' | 'standard' | 'premium' | 'enterprise' | 'agent';
// }

// interface Property {
//   _id: string;
//   title: string;
//   description: string;
//   price: number;
//   type: string;
//   location: {
//     address: string;
//     city: string;
//     state: string;
//     country: string;
//     postalCode: string;
//     latitude: number;
//     longitude: number;
//   };
//   features: {
//     bedrooms: number;
//     bathrooms: number;
//     area?: number;
//     parking: boolean;
//     furnished: boolean;
//   };
//   owner: {
//     name: string;
//     email: string;
//     contact: string;
//   };
//   images: string[];
//   status: string;
//   approval?: string;
//   sellerId?: string;
//   createdAt?: string;
// }

// interface PropertyView {
//   propertyId: string;
//   viewedAt: Date;
// }

// interface Notification {
//   id: number;
//   message: string;
//   read: boolean;
// }

// // Property store interface
// interface PropertyStore {
//   viewedProperties: PropertyView[];
//   favoriteProperties: string[];
//   setViewedProperties: (views: PropertyView[]) => void;
//   setFavoriteProperties: (favorites: string[]) => void;
//   reset: () => void;
// }

// // Mock user data with tier
// const mockUser: User = {
//   _id: '6800af9dd05f2945ddeb6f46',
//   fullName: 'Ethen Hunt',
//   email: 'ethenhunt@gmail.com',
//   contactNumber: 7677326761,
//   role: 'buyer',
//   status: 'active',
//   isVerified: true,
//   tier: 'free',
// };

// const { width, height } = Dimensions.get('window');
// const isTablet = width >= 768;

// export default function BuyerDashboard() {
//   const [user, setUser] = useState<User>(mockUser);
//   const [properties, setProperties] = useState<Property[]>([]);
//   const [favorites, setFavorites] = useState<string[]>([]);
//   const [activeTab, setActiveTab] = useState<'browse' | 'favorites' | 'profile'>('browse');
//   const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
//   const [filters, setFilters] = useState({
//     priceMin: 0,
//     priceMax: 1000000000,
//     bedrooms: 0,
//     bathrooms: 0,
//     propertyType: 'all',
//   });
//   const [showFilters, setShowFilters] = useState(false);
//   const [notifications, setNotifications] = useState<Notification[]>([
//     { id: 1, message: 'New property matching your search criteria', read: false },
//     { id: 2, message: 'Price drop on property in your favorites', read: false },
//   ]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [showLimitModal, setShowLimitModal] = useState(false);
//   const [selectedPropertyForView, setSelectedPropertyForView] = useState<Property | null>(null);

//   const { limitConfig, getTierById, getUserPropertyLimit, fetchLimitConfig } = useLimitConfigStore();
//   const navigation = useNavigation<NavigationProp>();

//   const viewedProperties = usePropertyStore((state: PropertyStore) => state.viewedProperties);
//   const setViewedProperties = usePropertyStore((state: PropertyStore) => state.setViewedProperties);
//   const favoriteProperties = usePropertyStore((state: PropertyStore) => state.favoriteProperties);
//   const setFavoriteProperties = usePropertyStore((state: PropertyStore) => state.setFavoriteProperties);
//   const reset = usePropertyStore((state: PropertyStore) => state.reset);

//   // Logout function
//   const logout = useCallback(() => {
//     localStorage.removeItem('jwt_token');
//     localStorage.removeItem('accessToken');
//     localStorage.removeItem('refreshToken');
//     localStorage.removeItem('property-storage');
//     reset();
//     navigation.replace('Login');
//   }, [reset, navigation]);

//   // Check for missing token on mount
//   useEffect(() => {
//     const token = useAuthStore.getState().accessToken;
//     if (!token) {
//       logout();
//     }
//   }, [logout]);

//   // Axios interceptor for 401 errors
//   useEffect(() => {
//     const interceptor = axiosInstance.interceptors.response.use(
//       (response) => response,
//       (error) => {
//         if (error.response?.status === 401) {
//           const isTokenExpired =
//             error.response.data?.message?.toLowerCase().includes('token expired') ||
//             error.response.data?.error?.toLowerCase().includes('token expired');
//           if (isTokenExpired) {
//             logout();
//           }
//         }
//         return Promise.reject(error);
//       }
//     );

//     return () => {
//       axiosInstance.interceptors.response.eject(interceptor);
//     };
//   }, [logout]);

//   // User property limit logic
//   const userPropertyLimit = getUserPropertyLimit(user.tier || 'free');
//   const remainingViews = userPropertyLimit - (Array.isArray(viewedProperties) ? viewedProperties.length : 0);
//   const hasReachedLimit = remainingViews <= 0;

//   // Initialize limit config
//   useEffect(() => {
//     useLimitConfigStore.getState().initialize();
//   }, []);

//   // Fetch data
//   const fetchData = useCallback(async () => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       await fetchLimitConfig();
//       const response = await axiosInstance.get('/Property/getAll');
//       if (response.data?.data) {
//         setProperties(response.data.data);
//       }
//     } catch (error) {
//       console.error('Error fetching data:', error);
//       setError('Failed to load data. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   }, [fetchLimitConfig]);

//   useEffect(() => {
//     fetchData();
//     return () => {};
//   }, [fetchData]);

//   // Toggle favorite
//   const toggleFavorite = useCallback(
//     (propertyId: string) => {
//       setFavoriteProperties(
//         favoriteProperties.includes(propertyId)
//           ? favoriteProperties.filter((id: string) => id !== propertyId)
//           : [...favoriteProperties, propertyId]
//       );
//     },
//     [favoriteProperties, setFavoriteProperties]
//   );

//   // Format price
//   const formatPrice = useCallback((price: number) => {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       maximumFractionDigits: 0,
//     }).format(price);
//   }, []);

//   // Check if property is new
//   const isNewProperty = useCallback((createdAt?: string) => {
//     if (!createdAt) return false;
//     const createdDate = new Date(createdAt);
//     const now = new Date();
//     const diffTime = Math.abs(now.getTime() - createdDate.getTime());
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//     return diffDays <= 7;
//   }, []);

//   // Clear filters
//   const clearFilters = useCallback(() => {
//     setFilters({
//       priceMin: 0,
//       priceMax: 1000000000,
//       bedrooms: 0,
//       bathrooms: 0,
//       propertyType: 'all',
//     });
//     setSearchQuery('');
//   }, []);

//   // Check if property has been viewed
//   const hasViewedProperty = useCallback(
//     (propertyId: string) => {
//       return viewedProperties.some((view: PropertyView) => view.propertyId === propertyId);
//     },
//     [viewedProperties]
//   );

//   // Handle view property
//   const handleViewProperty = useCallback(
//     (property: Property) => {
//       if (hasViewedProperty(property._id)) {
//         console.log(`View details for property ${property._id}`);
//         navigation.navigate('IndividualProperty', { id: property._id });
//         return;
//       }
//       if (hasReachedLimit) {
//         setSelectedPropertyForView(property);
//         setShowLimitModal(true);
//         return;
//       }
//       const newView: PropertyView = {
//         propertyId: property._id,
//         viewedAt: new Date(),
//       };
//       setViewedProperties([...viewedProperties, newView]);
//       console.log(`View details for property ${property._id}`);
//       navigation.navigate('IndividualProperty', { propertyId: property._id });
//     },
//     [hasReachedLimit, hasViewedProperty, viewedProperties, setViewedProperties, navigation]
//   );

//   const handleUpgradeTier = () => {
//     console.log('Navigate to tier upgrade page');
//     const tierId = user.tier || 'free';
//     navigation.navigate('UpgradeTier', { tierId });
//     setShowLimitModal(false);
//   };

//   const handleJoinWaitlist = () => {
//     if (selectedPropertyForView) {
//       console.log(`Add user to waitlist for property ${selectedPropertyForView._id}`);
//       const newNotification: Notification = {
//         id: Date.now(),
//         message: `You've been added to the waitlist for ${selectedPropertyForView.title}`,
//         read: false,
//       };
//       setNotifications((prev) => [newNotification, ...prev]);
//     }
//     setShowLimitModal(false);
//     setSelectedPropertyForView(null);
//   };

//   const markNotificationAsRead = useCallback((notificationId: number) => {
//     setNotifications((prev) =>
//       prev.map((notification) =>
//         notification.id === notificationId ? { ...notification, read: true } : notification
//       )
//     );
//   }, []);

//   const filteredProperties = properties.filter((property) => {
//     if (property.price < filters.priceMin || property.price > filters.priceMax) return false;
//     if (filters.bedrooms > 0 && property.features.bedrooms < filters.bedrooms) return false;
//     if (filters.bathrooms > 0 && property.features.bathrooms < filters.bathrooms) return false;
//     if (filters.propertyType !== 'all' && property.type.toLowerCase() !== filters.propertyType.toLowerCase()) return false;

//     if (searchQuery) {
//       const query = searchQuery.toLowerCase();
//       const locationString = `${property.location.address} ${property.location.city} ${property.location.state} ${property.location.country}`.toLowerCase();
//       return (
//         property.title.toLowerCase().includes(query) ||
//         property.description.toLowerCase().includes(query) ||
//         locationString.includes(query) ||
//         property.type.toLowerCase().includes(query)
//       );
//     }
//     return true;
//   });

//   const renderPropertyItem = ({ item }: { item: Property }) => (
//     <TouchableOpacity
//       style={styles.propertyCard}
//       onPress={() => handleViewProperty(item)}
//       activeOpacity={0.8}
//     >
//       <View style={styles.propertyImageContainer}>
//         {item.images && item.images.length > 0 ? (
//           <Image
//             source={{ uri: item.images[0] }}
//             style={styles.propertyImage}
//             resizeMode="cover"
//           />
//         ) : (
//           <View style={styles.noImageContainer}>
//             <Text style={styles.noImageText}>No Image Available</Text>
//           </View>
//         )}
//         {/* <TouchableOpacity
//           style={styles.favoriteButton}
//           onPress={() => toggleFavorite(item._id)}
//         >
//           <Icon
//             name="heart"
//             size={20}
//             color={ FavoriteProperties.includes(item._id) ? '#EF4444' : '#9CA3AF'}
//           />
//         </TouchableOpacity> */}
//         {isNewProperty(item.createdAt) && (
//           <View style={styles.newBadge}>
//             <Text style={styles.badgeText}>New</Text>
//           </View>
//         )}
//         {item.approval === 'approved' && (
//           <View style={styles.verifiedBadge}>
//             <Icon name="check" size={12} color="#FFF" style={styles.badgeIcon} />
//             <Text style={styles.badgeText}>Verified</Text>
//           </View>
//         )}
//         {hasViewedProperty(item._id) && (
//           <View style={styles.viewedBadge}>
//             <Text style={styles.badgeText}>Viewed</Text>
//           </View>
//         )}
//       </View>
//       <View style={styles.propertyDetails}>
//         <View style={styles.propertyHeader}>
//           <Text style={styles.propertyTitle} numberOfLines={1}>
//             {item.title}
//           </Text>
//           <Text style={styles.propertyPrice}>{formatPrice(item.price)}</Text>
//         </View>
//         <View style={styles.locationContainer}>
//           <Icon name="map-pin" size={16} color="#6B7280" style={styles.locationIcon} />
//           <Text style={styles.locationText} numberOfLines={1}>
//             {item.location.city}, {item.location.state}
//           </Text>
//         </View>
//         <View style={styles.featuresContainer}>
//           <Text style={styles.featureText}>{item.features.bedrooms} beds</Text>
//           <Text style={styles.featureText}>{item.features.bathrooms} baths</Text>
//           {item.features.area && (
//             <Text style={styles.featureText}>{item.features.area} sqft</Text>
//           )}
//         </View>
//         <TouchableOpacity
//           style={[
//             styles.viewButton,
//             hasViewedProperty(item._id)
//               ? styles.viewedButton
//               : hasReachedLimit
//               ? styles.disabledButton
//               : styles.activeButton,
//           ]}
//           onPress={() => handleViewProperty(item)}
//         >
//           <Text style={styles.viewButtonText}>
//             {hasViewedProperty(item._id) ? 'View Again' : 'View Details'}
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </TouchableOpacity>
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       <Header />

//       <View style={styles.main}>
//         {/* View limit indicator */}
//         <View style={styles.limitIndicator}>
//           <View style={styles.limitHeader}>
//             <Text style={styles.limitTitle}>Property Views</Text>
//             <Text style={styles.limitSubtitle}>
//               {remainingViews > 0
//                 ? `You have ${remainingViews} property views remaining this month`
//                 : "You've reached your property viewing limit this month"}
//             </Text>
//           </View>
//           <View style={styles.limitProgressContainer}>
//             <View style={styles.progressBar}>
//               <View
//                 style={[
//                   styles.progressFill,
//                   {
//                     width: `${Math.min(100, (viewedProperties.length / userPropertyLimit) * 100)}%`,
//                   },
//                 ]}
//               />
//             </View>
//             <Text style={styles.progressText}>
//               {viewedProperties.length}/{userPropertyLimit}
//             </Text>
//           </View>
//           <TouchableOpacity style={styles.upgradeButton} onPress={handleUpgradeTier}>
//             <Text style={styles.upgradeButtonText}>Upgrade Tier</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Mobile tab navigation */}
//         <View style={styles.tabContainer}>
//           <TouchableOpacity
//             style={styles.tabButton}
//             onPress={() => setActiveTab('browse')}
//           >
//             <Icon
//               name="home"
//               size={20}
//               color={activeTab === 'browse' ? '#2563EB' : '#6B7280'}
//             />
//             <Text
//               style={[
//                 styles.tabText,
//                 activeTab === 'browse' && styles.activeTabText,
//               ]}
//             >
//               Browse
//             </Text>
//           </TouchableOpacity>
//           {/* <TouchableOpacity
//             style={styles.tabButton}
//             onPress={() => setActiveTab('favorites')}
//           >
//             <Icon
//               name="heart"
//               size={20}
//               color={activeTab === 'favorites' ? '#2563EB' : '#6B7280'}
//             />
//             <Text
//               style={[
//                 styles.tabText,
//                 activeTab === 'favorites' && styles.activeTabText,
//               ]}
//             >
//               Favorites
//             </Text>
//           </TouchableOpacity> */}
//           <TouchableOpacity
//             style={styles.tabButton}
//             onPress={() => setActiveTab('profile')}
//           >
//             <Icon
//               name="user"
//               size={20}
//               color={activeTab === 'profile' ? '#2563EB' : '#6B7280'}
//             />
//             <Text
//               style={[
//                 styles.tabText,
//                 activeTab === 'profile' && styles.activeTabText,
//               ]}
//             >
//               Profile
//             </Text>
//           </TouchableOpacity>
//         </View>

//         {activeTab === 'browse' && (
//           <ScrollView style={styles.tabContent}>
//             <View style={styles.browseHeader}>
//               <Text style={styles.sectionTitle}>Browse Properties</Text>
//               <View style={styles.viewModeContainer}>
//                 <TouchableOpacity
//                   style={[
//                     styles.viewModeButton,
//                     viewMode === 'grid' && styles.activeViewMode,
//                   ]}
//                   onPress={() => setViewMode('grid')}
//                 >
//                   <Icon name="grid" size={20} color={viewMode === 'grid' ? '#2563EB' : '#6B7280'} />
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   style={[
//                     styles.viewModeButton,
//                     viewMode === 'map' && styles.activeViewMode,
//                   ]}
//                   onPress={() => setViewMode('map')}
//                 >
//                   <Icon name="map" size={20} color={viewMode === 'map' ? '#2563EB' : '#6B7280'} />
//                 </TouchableOpacity>
//               </View>
//             </View>
//             <View style={styles.searchContainer}>
//               <View style={styles.searchInputContainer}>
//                 <Icon name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
//                 <TextInput
//                   style={styles.searchInput}
//                   placeholder="Search by location, property type, keywords..."
//                   value={searchQuery}
//                   onChangeText={setSearchQuery}
//                 />
//               </View>
//               <TouchableOpacity
//                 style={styles.filterButton}
//                 onPress={() => setShowFilters(!showFilters)}
//               >
//                 <Icon name="filter" size={20} color="#374151" />
//                 <Text style={styles.filterButtonText}>Filters</Text>
//                 <Icon
//                   name={showFilters ? 'chevron-up' : 'chevron-down'}
//                   size={16}
//                   color="#374151"
//                 />
//               </TouchableOpacity>
//             </View>
//             {showFilters && (
//               <View style={styles.filtersContainer}>
//                 <View style={styles.filterRow}>
//                   <View style={styles.filterItem}>
//                     <Text style={styles.filterLabel}>Price Range</Text>
//                     <View style={styles.priceInputs}>
//                       <View style={styles.priceInputContainer}>
//                         <Text style={styles.currencySymbol}>₹</Text>
//                         <TextInput
//                           style={styles.priceInput}
//                           placeholder="Min"
//                           keyboardType="numeric"
//                           value={filters.priceMin ? filters.priceMin.toString() : ''}
//                           onChangeText={(text) =>
//                             setFilters({ ...filters, priceMin: Number(text) || 0 })
//                           }
//                         />
//                       </View>
//                       <View style={styles.priceInputContainer}>
//                         <Text style={styles.currencySymbol}>₹</Text>
//                         <TextInput
//                           style={styles.priceInput}
//                           placeholder="Max"
//                           keyboardType="numeric"
//                           value={filters.priceMax ? filters.priceMax.toString() : ''}
//                           onChangeText={(text) =>
//                             setFilters({ ...filters, priceMax: Number(text) || 1000000000 })
//                           }
//                         />
//                       </View>
//                     </View>
//                   </View>
//                   <View style={styles.filterItem}>
//                     <Text style={styles.filterLabel}>Bedrooms</Text>
//                     <View style={styles.selectContainer}>
//                       <TextInput
//                         style={styles.selectInput}
//                         value={
//                           filters.bedrooms === 0
//                             ? 'Any'
//                             : `${filters.bedrooms}+`
//                         }
//                         editable={false}
//                       />
//                       <Icon name="chevron-down" size={16} color="#374151" />
//                     </View>
//                   </View>
//                 </View>
//                 <View style={styles.filterRow}>
//                   <View style={styles.filterItem}>
//                     <Text style={styles.filterLabel}>Bathrooms</Text>
//                     <View style={styles.selectContainer}>
//                       <TextInput
//                         style={styles.selectInput}
//                         value={
//                           filters.bathrooms === 0
//                             ? 'Any'
//                             : `${filters.bathrooms}+`
//                         }
//                         editable={false}
//                       />
//                       <Icon name="chevron-down" size={16} color="#374151" />
//                     </View>
//                   </View>
//                   <View style={styles.filterItem}>
//                     <Text style={styles.filterLabel}>Property Type</Text>
//                     <View style={styles.selectContainer}>
//                       <TextInput
//                         style={styles.selectInput}
//                         value={
//                           filters.propertyType === 'all'
//                             ? 'All Types'
//                             : filters.propertyType.charAt(0).toUpperCase() +
//                               filters.propertyType.slice(1)
//                         }
//                         editable={false}
//                       />
//                       <Icon name="chevron-down" size={16} color="#374151" />
//                     </View>
//                   </View>
//                 </View>
//                 <View style={styles.filterActions}>
//                   <TouchableOpacity style={styles.resetButton} onPress={clearFilters}>
//                     <Text style={styles.resetButtonText}>Reset</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity
//                     style={styles.applyButton}
//                     onPress={() => setShowFilters(false)}
//                   >
//                     <Text style={styles.applyButtonText}>Apply Filters</Text>
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             )}
//             {isLoading ? (
//               <View style={styles.loadingContainer}>
//                 <ActivityIndicator size="large" color="#2563EB" />
//               </View>
//             ) : error ? (
//               <View style={styles.errorContainer}>
//                 <Text style={styles.errorText}>{error}</Text>
//                 <TouchableOpacity style={styles.tryAgainButton} onPress={fetchData}>
//                   <Text style={styles.tryAgainButtonText}>Try Again</Text>
//                 </TouchableOpacity>
//               </View>
//             ) : filteredProperties.length === 0 ? (
//               <View style={styles.emptyContainer}>
//                 <Icon name="search" size={48} color="#D1D5DB" />
//                 <Text style={styles.emptyTitle}>No properties found</Text>
//                 <Text style={styles.emptySubtitle}>
//                   Try adjusting your filters or search criteria
//                 </Text>
//                 <TouchableOpacity style={styles.clearFiltersButton} onPress={clearFilters}>
//                   <Text style={styles.clearFiltersButtonText}>Clear Filters</Text>
//                 </TouchableOpacity>
//               </View>
//             ) : viewMode === 'grid' ? (
//               <FlatList
//                 data={filteredProperties}
//                 renderItem={renderPropertyItem}
//                 keyExtractor={(item) => item._id}
//                 contentContainerStyle={styles.propertyList}
//                 numColumns={isTablet ? 2 : 1}
//               />
//             ) : (
//               <View style={styles.mapPlaceholder}>
//                 <Icon name="map" size={48} color="#6B7280" />
//                 <Text style={styles.mapPlaceholderText}>
//                   Map view would be implemented here
//                 </Text>
//                 <Text style={styles.mapPlaceholderSubtitle}>
//                   Using latitude/longitude from property data
//                 </Text>
//               </View>
//             )}
//           </ScrollView>
//         )}

//         {activeTab === 'favorites' && (
//           <ScrollView style={styles.tabContent}>
//             <Text style={styles.sectionTitle}>My Favorites</Text>
//             {favoriteProperties.length === 0 ? (
//               <View style={styles.emptyContainer}>
//                 {/* <Icon name="heart" size={48} color="#D1D5DB" /> */}
//                 <Text style={styles.emptyTitle}>No favorites yet</Text>
//                 <Text style={styles.emptySubtitle}>
//                   Browse properties and add some to your favorites
//                 </Text>
//                 <TouchableOpacity
//                   style={styles.browseButton}
//                   onPress={() => setActiveTab('browse')}
//                 >
//                   <Text style={styles.browseButtonText}>Browse Properties</Text>
//                 </TouchableOpacity>
//               </View>
//             ) : (
//               <FlatList
//                 data={properties.filter((p) => favoriteProperties.includes(p._id))}
//                 renderItem={renderPropertyItem}
//                 keyExtractor={(item) => item._id}
//                 contentContainerStyle={styles.propertyList}
//                 numColumns={isTablet ? 2 : 1}
//               />
//             )}
//           </ScrollView>
//         )}

//         {activeTab === 'profile' && (
//           <ScrollView style={styles.tabContent}>
//             <Text style={styles.sectionTitle}>Profile</Text>
//             <View style={styles.profileContainer}>
//               <View style={styles.profileSection}>
//                 <Text style={styles.profileSectionTitle}>Personal Information</Text>
//                 <View style={styles.profileItem}>
//                   <Text style={styles.profileLabel}>Full Name</Text>
//                   <Text style={styles.profileValue}>{user.fullName}</Text>
//                 </View>
//                 <View style={styles.profileItem}>
//                   <Text style={styles.profileLabel}>Email</Text>
//                   <Text style={styles.profileValue}>{user.email}</Text>
//                 </View>
//                 <View style={styles.profileItem}>
//                   <Text style={styles.profileLabel}>Contact Number</Text>
//                   <Text style={styles.profileValue}>{user.contactNumber}</Text>
//                 </View>
//                 <View style={styles.profileItem}>
//                   <Text style={styles.profileLabel}>Account Status</Text>
//                   <Text style={styles.profileValue}>{user.status}</Text>
//                 </View>
//                 <View style={styles.profileItem}>
//                   <Text style={styles.profileLabel}>Membership Tier</Text>
//                   <Text style={styles.profileValue}>{user.tier}</Text>
//                 </View>
//               </View>
//               <View style={styles.profileSection}>
//                 <Text style={styles.profileSectionTitle}>Notifications</Text>
//                 {notifications.length === 0 ? (
//                   <View style={styles.emptyNotifications}>
//                     <Icon name="bell" size={48} color="#D1D5DB" />
//                     <Text style={styles.emptyNotificationsText}>No notifications</Text>
//                   </View>
//                 ) : (
//                   <View style={styles.notificationsContainer}>
//                     {notifications.map((notification) => (
//                       <View
//                         key={notification.id}
//                         style={[
//                           styles.notificationItem,
//                           notification.read
//                             ? styles.readNotification
//                             : styles.unreadNotification,
//                         ]}
//                       >
//                         <View style={styles.notificationContent}>
//                           <Icon name="bell" size={20} color="#6B7280" style={styles.notificationIcon} />
//                           <Text
//                             style={[
//                               styles.notificationText,
//                               notification.read && styles.readNotificationText,
//                             ]}
//                           >
//                             {notification.message}
//                           </Text>
//                         </View>
//                         {!notification.read && (
//                           <TouchableOpacity
//                             onPress={() => markNotificationAsRead(notification.id)}
//                           >
//                             <Text style={styles.markAsReadText}>Mark as read</Text>
//                           </TouchableOpacity>
//                         )}
//                       </View>
//                     ))}
//                   </View>
//                 )}
//               </View>
//               <TouchableOpacity
//                 style={styles.editProfileButton}
//                 onPress={() => console.log('Navigate to edit profile page')}
//               >
//                 <Text style={styles.editProfileButtonText}>Edit Profile</Text>
//               </TouchableOpacity>
//             </View>
//           </ScrollView>
//         )}

//         {/* Limit Reached Modal */}
//         <Modal
//           visible={showLimitModal}
//           transparent
//           animationType="slide"
//           onRequestClose={() => setShowLimitModal(false)}
//         >
//           <View style={styles.modalOverlay}>
//             <View style={styles.modalContainer}>
//               <View style={styles.modalHeader}>
//                 <View style={styles.modalTitleContainer}>
//                   <Icon name="alert-circle" size={24} color="#F59E0B" style={styles.modalIcon} />
//                   <Text style={styles.modalTitle}>View Limit Reached</Text>
//                 </View>
//                 <TouchableOpacity onPress={() => setShowLimitModal(false)}>
//                   <Icon name="x" size={20} color="#6B7280" />
//                 </TouchableOpacity>
//               </View>
//               <Text style={styles.modalText}>
//                 You've reached your monthly property view limit for the {user.tier} tier. Upgrade
//                 your tier to view more properties or join the waitlist for this property.
//               </Text>
//               {selectedPropertyForView && (
//                 <Text style={styles.modalPropertyText}>
//                   Property: {selectedPropertyForView.title}
//                 </Text>
//               )}
//               <View style={styles.modalActions}>
//                 {/* <TouchableOpacity style={styles.joinWaitlistButton} onPress={handleJoinWaitlist}>
//                   <Text style={styles.joinWaitlistButtonText}>Join Waitlist</Text>
//                 </TouchableOpacity> */}
//                 <TouchableOpacity style={styles.upgradeTierButton} onPress={handleUpgradeTier}>
//                   <Text style={styles.upgradeTierButtonText}>Upgrade Tier</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </View>
//         </Modal>
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F9FAFB',
//   },
//   main: {
//     flex: 1,
//     padding: 16,
//   },
//   limitIndicator: {
//     backgroundColor: '#FFF',
//     padding: 16,
//     borderRadius: 8,
//     marginBottom: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   limitHeader: {
//     marginBottom: 8,
//   },
//   limitTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#111827',
//   },
//   limitSubtitle: {
//     fontSize: 14,
//     color: '#6B7280',
//     marginTop: 4,
//   },
//   limitProgressContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   progressBar: {
//     flex: 1,
//     height: 6,
//     backgroundColor: '#E5E7EB',
//     borderRadius: 3,
//     overflow: 'hidden',
//     marginRight: 8,
//   },
//   progressFill: {
//     height: '100%',
//     backgroundColor: '#2563EB',
//   },
//   progressText: {
//     fontSize: 12,
//     fontWeight: '500',
//     color: '#374151',
//   },
//   upgradeButton: {
//     backgroundColor: '#2563EB',
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 8,
//     alignSelf: 'flex-end',
//   },
//   upgradeButtonText: {
//     color: '#FFF',
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   tabContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     backgroundColor: '#FFF',
//     padding: 8,
//     borderRadius: 8,
//     marginBottom: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   tabButton: {
//     flex: 1,
//     alignItems: 'center',
//     paddingVertical: 8,
//   },
//   tabText: {
//     fontSize: 12,
//     color: '#6B7280',
//     marginTop: 4,
//   },
//   activeTabText: {
//     color: '#2563EB',
//     fontWeight: '600',
//   },
//   tabContent: {
//     flex: 1,
//   },
//   browseHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   sectionTitle: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: '#111827',
//   },
//   viewModeContainer: {
//     flexDirection: 'row',
//   },
//   viewModeButton: {
//     padding: 8,
//     borderRadius: 8,
//     marginLeft: 8,
//   },
//   activeViewMode: {
//     backgroundColor: '#DBEAFE',
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     marginBottom: 16,
//   },
//   searchInputContainer: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#FFF',
//     borderWidth: 1,
//     borderColor: '#D1D5DB',
//     borderRadius: 8,
//     paddingHorizontal: 12,
//   },
//   searchIcon: {
//     marginRight: 8,
//   },
//   searchInput: {
//     flex: 1,
//     fontSize: 16,
//     color: '#111827',
//     paddingVertical: 10,
//   },
//   filterButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#F3F4F6',
//     padding: 10,
//     borderRadius: 8,
//     marginLeft: 8,
//   },
//   filterButtonText: {
//     fontSize: 16,
//     color: '#374151',
//     marginHorizontal: 4,
//   },
//   filtersContainer: {
//     backgroundColor: '#FFF',
//     padding: 16,
//     borderRadius: 8,
//     marginBottom: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   filterRow: {
//     flexDirection: isTablet ? 'row' : 'column',
//     marginBottom: 16,
//   },
//   filterItem: {
//     flex: 1,
//     marginRight: isTablet ? 16 : 0,
//     marginBottom: isTablet ? 0 : 16,
//   },
//   filterLabel: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#374151',
//     marginBottom: 8,
//   },
//   priceInputs: {
//     flexDirection: 'row',
//   },
//   priceInputContainer: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#D1D5DB',
//     borderRadius: 8,
//     marginRight: 8,
//   },
//   currencySymbol: {
//     fontSize: 16,
//     color: '#6B7280',
//     paddingHorizontal: 8,
//   },
//   priceInput: {
//     flex: 1,
//     fontSize: 16,
//     color: '#111827',
//     paddingVertical: 10,
//   },
//   selectContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#D1D5DB',
//     borderRadius: 8,
//     paddingHorizontal: 12,
//   },
//   selectInput: {
//     flex: 1,
//     fontSize: 16,
//     color: '#111827',
//     paddingVertical: 10,
//   },
//   filterActions: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//   },
//   resetButton: {
//     backgroundColor: '#E5E7EB',
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 8,
//     marginRight: 8,
//   },
//   resetButtonText: {
//     fontSize: 14,
//     color: '#374151',
//   },
//   applyButton: {
//     backgroundColor: '#2563EB',
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 8,
//   },
//   applyButtonText: {
//     fontSize: 14,
//     color: '#FFF',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 32,
//   },
//   errorContainer: {
//     backgroundColor: '#FEF2F2',
//     padding: 24,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   errorText: {
//     fontSize: 16,
//     color: '#DC2626',
//     marginBottom: 16,
//   },
//   tryAgainButton: {
//     backgroundColor: '#2563EB',
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 8,
//   },
//   tryAgainButtonText: {
//     fontSize: 14,
//     color: '#FFF',
//   },
//   emptyContainer: {
//     backgroundColor: '#FFF',
//     padding: 24,
//     borderRadius: 8,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   emptyTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#111827',
//     marginTop: 8,
//   },
//   emptySubtitle: {
//     fontSize: 14,
//     color: '#6B7280',
//     marginTop: 4,
//     textAlign: 'center',
//   },
//   clearFiltersButton: {
//     backgroundColor: '#2563EB',
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 8,
//     marginTop: 16,
//   },
//   clearFiltersButtonText: {
//     fontSize: 14,
//     color: '#FFF',
//   },
//   propertyList: {
//     paddingBottom: 16,
//   },
//   propertyCard: {
//     backgroundColor: '#FFF',
//     borderRadius: 8,
//     marginBottom: 16,
//     marginHorizontal: isTablet ? 8 : 0,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     elevation: 2,
//     width: isTablet ? width / 2 - 24 : width - 32,
//   },
//   propertyImageContainer: {
//     height: 192,
//     borderTopLeftRadius: 8,
//     borderTopRightRadius: 8,
//     overflow: 'hidden',
//     position: 'relative',
//   },
//   propertyImage: {
//     width: '100%',
//     height: '100%',
//   },
//   noImageContainer: {
//     flex: 1,
//     backgroundColor: '#E5E7EB',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   noImageText: {
//     fontSize: 14,
//     color: '#6B7280',
//   },
//   favoriteButton: {
//     position: 'absolute',
//     top: 8,
//     right: 8,
//     backgroundColor: '#FFF',
//     borderRadius: 16,
//     padding: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   newBadge: {
//     position: 'absolute',
//     top: 8,
//     left: 8,
//     backgroundColor: '#22C55E',
//     paddingVertical: 4,
//     paddingHorizontal: 8,
//     borderRadius: 12,
//   },
//   verifiedBadge: {
//     position: 'absolute',
//     bottom: 8,
//     left: 8,
//     backgroundColor: '#F59E0B',
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 4,
//     paddingHorizontal: 8,
//     borderRadius: 12,
//   },
//   viewedBadge: {
//     position: 'absolute',
//     bottom: 8,
//     right: 8,
//     backgroundColor: '#2563EB',
//     paddingVertical: 4,
//     paddingHorizontal: 8,
//     borderRadius: 12,
//   },
//   badgeText: {
//     fontSize: 12,
//     color: '#FFF',
//     fontWeight: '500',
//   },
//   badgeIcon: {
//     marginRight: 4,
//   },
//   propertyDetails: {
//     padding: 16,
//   },
//   propertyHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//     marginBottom: 8,
//   },
//   propertyTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#111827',
//     flex: 1,
//   },
//   propertyPrice: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#2563EB',
//   },
//   locationContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   locationIcon: {
//     marginRight: 4,
//   },
//   locationText: {
//     fontSize: 14,
//     color: '#6B7280',
//     flex: 1,
//   },
//   featuresContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     marginBottom: 12,
//   },
//   featureText: {
//     fontSize: 14,
//     color: '#6B7280',
//     marginRight: 12,
//   },
//   viewButton: {
//     paddingVertical: 10,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   activeButton: {
//     backgroundColor: '#2563EB',
//   },
//   viewedButton: {
//     backgroundColor: '#DBEAFE',
//   },
//   disabledButton: {
//     backgroundColor: '#D1D5DB',
//   },
//   viewButtonText: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: '#FFF',
//   },
//   mapPlaceholder: {
//     backgroundColor: '#FFF',
//     borderRadius: 8,
//     height: 384,
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   mapPlaceholderText: {
//     fontSize: 16,
//     color: '#6B7280',
//     marginTop: 8,
//   },
//   mapPlaceholderSubtitle: {
//     fontSize: 14,
//     color: '#6B7280',
//     marginTop: 4,
//   },
//   browseButton: {
//     backgroundColor: '#2563EB',
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 8,
//     marginTop: 16,
//   },
//   browseButtonText: {
//     fontSize: 14,
//     color: '#FFF',
//   },
//   profileContainer: {
//     backgroundColor: '#FFF',
//     borderRadius: 8,
//     padding: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   profileSection: {
//     marginBottom: 24,
//   },
//   profileSectionTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#111827',
//     marginBottom: 16,
//   },
//   profileItem: {
//     marginBottom: 16,
//   },
//   profileLabel: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#374151',
//     marginBottom: 4,
//   },
//   profileValue: {
//     fontSize: 16,
//     color: '#111827',
//   },
//   emptyNotifications: {
//     alignItems: 'center',
//     paddingVertical: 16,
//   },
//   emptyNotificationsText: {
//     fontSize: 14,
//     color: '#6B7280',
//     marginTop: 8,
//   },
//   notificationsContainer: {
//     marginBottom: 16,
//   },
//   notificationItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 8,
//   },
//   readNotification: {
//     backgroundColor: '#F9FAFB',
//   },
//   unreadNotification: {
//     backgroundColor: '#EFF6FF',
//   },
//   notificationContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//   },
//   notificationIcon: {
//     marginRight: 8,
//   },
//   notificationText: {
//     fontSize: 14,
//     color: '#111827',
//     flex: 1,
//   },
//   readNotificationText: {
//     color: '#6B7280',
//   },
//   markAsReadText: {
//     fontSize: 14,
//     color: '#2563EB',
//   },
//   editProfileButton: {
//     backgroundColor: '#2563EB',
//     paddingVertical: 10,
//     paddingHorizontal: 16,
//     borderRadius: 8,
//     alignSelf: 'flex-end',
//   },
//   editProfileButtonText: {
//     fontSize: 14,
//     color: '#FFF',
//     fontWeight: '500',
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContainer: {
//     backgroundColor: '#FFF',
//     borderRadius: 8,
//     padding: 16,
//     width: '90%',
//     maxWidth: 400,
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   modalTitleContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   modalIcon: {
//     marginRight: 8,
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#111827',
//   },
//   modalText: {
//     fontSize: 14,
//     color: '#6B7280',
//     marginBottom: 16,
//   },
//   modalPropertyText: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: '#111827',
//     marginBottom: 16,
//   },
//   modalActions: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//   },
//   joinWaitlistButton: {
//     backgroundColor: '#E5E7EB',
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 8,
//     marginRight: 8,
//   },
//   joinWaitlistButtonText: {
//     fontSize: 14,
//     color: '#374151',
//   },
//   upgradeTierButton: {
//     backgroundColor: '#2563EB',
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 8,
//   },
//   upgradeTierButtonText: {
//     fontSize: 14,
//     color: '#FFF',
//   },
// });

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  Modal,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Feather';
import axiosInstance from '../services/axiosInstance';
import Header from '../components/Header';
import { useLimitConfigStore } from '../store/limitConfigStore';
import usePropertyStore from '../store/propertyStore';
import { useAuthStore } from '../store/authStore';

// Navigation types
type RootStackParamList = {
  Login: undefined;
  IndividualProperty: { id: string }; // Changed from propertyId to id
  UpgradeTier: { tierId: string };
  BuyerDashboard: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Types based on provided MongoDB structure
interface User {
  _id: string;
  fullName: string;
  email: string;
  contactNumber: string | number;
  role: 'admin' | 'agent' | 'seller' | 'buyer';
  status: 'pending' | 'active' | 'inactive';
  isVerified: boolean;
  tier?: 'free' | 'standard' | 'premium' | 'enterprise' | 'agent';
}

interface Property {
  _id: string;
  title: string;
  description: string;
  price: number;
  type: string;
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    latitude: number;
    longitude: number;
  };
  features: {
    bedrooms: number;
    bathrooms: number;
    area?: number;
    parking: boolean;
    furnished: boolean;
  };
  owner: {
    name: string;
    email: string;
    contact: string;
  };
  images: string[];
  status: string;
  approval?: string;
  sellerId?: string;
  createdAt?: string;
}

interface PropertyView {
  propertyId: string;
  viewedAt: Date;
}

interface Notification {
  id: number;
  message: string;
  read: boolean;
}

// Property store interface
interface PropertyStore {
  viewedProperties: PropertyView[];
  favoriteProperties: string[];
  setViewedProperties: (views: PropertyView[]) => void;
  setFavoriteProperties: (favorites: string[]) => void;
  reset: () => void;
}

// Mock user data with tier
const mockUser: User = {
  _id: '6800af9dd05f2945ddeb6f46',
  fullName: 'Ethen Hunt',
  email: 'ethenhunt@gmail.com',
  contactNumber: 7677326761,
  role: 'buyer',
  status: 'active',
  isVerified: true,
  tier: 'free',
};

const { width, height } = Dimensions.get('window');
const isTablet = width >= 768;

export default function BuyerDashboard() {
  const [user, setUser] = useState<User>(mockUser);
  const [properties, setProperties] = useState<Property[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'browse' | 'favorites' | 'profile'>('browse');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [filters, setFilters] = useState({
    priceMin: 0,
    priceMax: 1000000000,
    bedrooms: 0,
    bathrooms: 0,
    propertyType: 'all',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, message: 'New property matching your search criteria', read: false },
    { id: 2, message: 'Price drop on property in your favorites', read: false },
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [selectedPropertyForView, setSelectedPropertyForView] = useState<Property | null>(null);

  const { limitConfig, getTierById, getUserPropertyLimit, fetchLimitConfig } = useLimitConfigStore();
  const navigation = useNavigation<NavigationProp>();

  const viewedProperties = usePropertyStore((state: PropertyStore) => state.viewedProperties);
  const setViewedProperties = usePropertyStore((state: PropertyStore) => state.setViewedProperties);
  const favoriteProperties = usePropertyStore((state: PropertyStore) => state.favoriteProperties);
  const setFavoriteProperties = usePropertyStore((state: PropertyStore) => state.setFavoriteProperties);
  const reset = usePropertyStore((state: PropertyStore) => state.reset);

  // Logout function
  const logout = useCallback(() => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('property-storage');
    reset();
    navigation.replace('Login');
  }, [reset, navigation]);

  // Check for missing token on mount
  useEffect(() => {
    const token = useAuthStore.getState().accessToken;
    if (!token) {
      logout();
    }
  }, [logout]);

  // Axios interceptor for 401 errors
  useEffect(() => {
    const interceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          const isTokenExpired =
            error.response.data?.message?.toLowerCase().includes('token expired') ||
            error.response.data?.error?.toLowerCase().includes('token expired');
          if (isTokenExpired) {
            logout();
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.response.eject(interceptor);
    };
  }, [logout]);

  // User property limit logic
  const userPropertyLimit = getUserPropertyLimit(user.tier || 'free');
  const remainingViews = userPropertyLimit - (Array.isArray(viewedProperties) ? viewedProperties.length : 0);
  const hasReachedLimit = remainingViews <= 0;

  // Initialize limit config
  useEffect(() => {
    useLimitConfigStore.getState().initialize();
  }, []);

  // Fetch data
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await fetchLimitConfig();
      const response = await axiosInstance.get('/Property/getAll');
      if (response.data?.data) {
        console.log('Fetched properties:', response.data.data); // Debug log
        setProperties(response.data.data);
      } else {
        setError('No properties found.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [fetchLimitConfig]);

  useEffect(() => {
    fetchData();
    return () => {};
  }, [fetchData]);

  // Toggle favorite
  const toggleFavorite = useCallback(
    (propertyId: string) => {
      setFavoriteProperties(
        favoriteProperties.includes(propertyId)
          ? favoriteProperties.filter((id: string) => id !== propertyId)
          : [...favoriteProperties, propertyId]
      );
    },
    [favoriteProperties, setFavoriteProperties]
  );

  // Format price
  const formatPrice = useCallback((price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  }, []);

  // Check if property is new
  const isNewProperty = useCallback((createdAt?: string) => {
    if (!createdAt) return false;
    const createdDate = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - createdDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  }, []);

  // Clear filters
  const clearFilters = useCallback(() => {
    setFilters({
      priceMin: 0,
      priceMax: 1000000000,
      bedrooms: 0,
      bathrooms: 0,
      propertyType: 'all',
    });
    setSearchQuery('');
  }, []);

  // Check if property has been viewed
  const hasViewedProperty = useCallback(
    (propertyId: string) => {
      return viewedProperties.some((view: PropertyView) => view.propertyId === propertyId);
    },
    [viewedProperties]
  );

  // Handle view property
  const handleViewProperty = useCallback(
    (property: Property) => {
      console.log('Attempting to view property:', property._id); // Debug log
      if (hasViewedProperty(property._id)) {
        console.log(`Navigating to IndividualProperty with id: ${property._id}`);
        navigation.navigate('IndividualProperty', { id: property._id });
        return;
      }
      if (hasReachedLimit) {
        console.log('View limit reached, showing modal');
        setSelectedPropertyForView(property);
        setShowLimitModal(true);
        return;
      }
      const newView: PropertyView = {
        propertyId: property._id,
        viewedAt: new Date(),
      };
      setViewedProperties([...viewedProperties, newView]);
      console.log(`Navigating to IndividualProperty with id: ${property._id}`);
      navigation.navigate('IndividualProperty', { id: property._id });
    },
    [hasReachedLimit, hasViewedProperty, viewedProperties, setViewedProperties, navigation]
  );

  const handleUpgradeTier = () => {
    console.log('Navigating to UpgradeTier page');
    const tierId = user.tier || 'free';
    navigation.navigate('UpgradeTier', { tierId });
    setShowLimitModal(false);
  };

  const handleJoinWaitlist = () => {
    if (selectedPropertyForView) {
      console.log(`Adding user to waitlist for property ${selectedPropertyForView._id}`);
      const newNotification: Notification = {
        id: Date.now(),
        message: `You've been added to the waitlist for ${selectedPropertyForView.title}`,
        read: false,
      };
      setNotifications((prev) => [newNotification, ...prev]);
    }
    setShowLimitModal(false);
    setSelectedPropertyForView(null);
  };

  const markNotificationAsRead = useCallback((notificationId: number) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId ? { ...notification, read: true } : notification
      )
    );
  }, []);

  const filteredProperties = properties.filter((property) => {
    if (property.price < filters.priceMin || property.price > filters.priceMax) return false;
    if (filters.bedrooms > 0 && property.features.bedrooms < filters.bedrooms) return false;
    if (filters.bathrooms > 0 && property.features.bathrooms < filters.bathrooms) return false;
    if (filters.propertyType !== 'all' && property.type.toLowerCase() !== filters.propertyType.toLowerCase()) return false;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const locationString = `${property.location.address} ${property.location.city} ${property.location.state} ${property.location.country}`.toLowerCase();
      return (
        property.title.toLowerCase().includes(query) ||
        property.description.toLowerCase().includes(query) ||
        locationString.includes(query) ||
        property.type.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const renderPropertyItem = ({ item }: { item: Property }) => (
    <TouchableOpacity
      style={styles.propertyCard}
      onPress={() => handleViewProperty(item)}
      activeOpacity={0.8}
    >
      <View style={styles.propertyImageContainer}>
        {item.images && item.images.length > 0 ? (
          <Image
            source={{ uri: item.images[0] }}
            style={styles.propertyImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.noImageContainer}>
            <Text style={styles.noImageText}>No Image Available</Text>
          </View>
        )}
        {isNewProperty(item.createdAt) && (
          <View style={styles.newBadge}>
            <Text style={styles.badgeText}>New</Text>
          </View>
        )}
        {item.approval === 'approved' && (
          <View style={styles.verifiedBadge}>
            <Icon name="check" size={12} color="#FFF" style={styles.badgeIcon} />
            <Text style={styles.badgeText}>Verified</Text>
          </View>
        )}
        {hasViewedProperty(item._id) && (
          <View style={styles.viewedBadge}>
            <Text style={styles.badgeText}>Viewed</Text>
          </View>
        )}
      </View>
      <View style={styles.propertyDetails}>
        <View style={styles.propertyHeader}>
          <Text style={styles.propertyTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.propertyPrice}>{formatPrice(item.price)}</Text>
        </View>
        <View style={styles.locationContainer}>
          <Icon name="map-pin" size={16} color="#6B7280" style={styles.locationIcon} />
          <Text style={styles.locationText} numberOfLines={1}>
            {item.location.city}, {item.location.state}
          </Text>
        </View>
        <View style={styles.featuresContainer}>
          <Text style={styles.featureText}>{item.features.bedrooms} beds</Text>
          <Text style={styles.featureText}>{item.features.bathrooms} baths</Text>
          {item.features.area && (
            <Text style={styles.featureText}>{item.features.area} sqft</Text>
          )}
        </View>
        <TouchableOpacity
          style={[
            styles.viewButton,
            hasViewedProperty(item._id)
              ? styles.viewedButton
              : hasReachedLimit
              ? styles.disabledButton
              : styles.activeButton,
          ]}
          onPress={() => handleViewProperty(item)}
        >
          <Text style={styles.viewButtonText}>
            {hasViewedProperty(item._id) ? 'View Again' : 'View Details'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header />

      <View style={styles.main}>
        {/* View limit indicator */}
        <View style={styles.limitIndicator}>
          <View style={styles.limitHeader}>
            <Text style={styles.limitTitle}>Property Views</Text>
            <Text style={styles.limitSubtitle}>
              {remainingViews > 0
                ? `You have ${remainingViews} property views remaining this month`
                : "You've reached your property viewing limit this month"}
            </Text>
          </View>
          <View style={styles.limitProgressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.min(100, (viewedProperties.length / userPropertyLimit) * 100)}%`,
                  },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {viewedProperties.length}/{userPropertyLimit}
            </Text>
          </View>
          <TouchableOpacity style={styles.upgradeButton} onPress={handleUpgradeTier}>
            <Text style={styles.upgradeButtonText}>Upgrade Tier</Text>
          </TouchableOpacity>
        </View>

        {/* Mobile tab navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={styles.tabButton}
            onPress={() => setActiveTab('browse')}
          >
            <Icon
              name="home"
              size={20}
              color={activeTab === 'browse' ? '#2563EB' : '#6B7280'}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === 'browse' && styles.activeTabText,
              ]}
            >
              Browse
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tabButton}
            onPress={() => setActiveTab('profile')}
          >
            <Icon
              name="user"
              size={20}
              color={activeTab === 'profile' ? '#2563EB' : '#6B7280'}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === 'profile' && styles.activeTabText,
              ]}
            >
              Profile
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'browse' && (
          <ScrollView style={styles.tabContent}>
            <View style={styles.browseHeader}>
              <Text style={styles.sectionTitle}>Browse Properties</Text>
              <View style={styles.viewModeContainer}>
                <TouchableOpacity
                  style={[
                    styles.viewModeButton,
                    viewMode === 'grid' && styles.activeViewMode,
                  ]}
                  onPress={() => setViewMode('grid')}
                >
                  <Icon name="grid" size={20} color={viewMode === 'grid' ? '#2563EB' : '#6B7280'} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.viewModeButton,
                    viewMode === 'map' && styles.activeViewMode,
                  ]}
                  onPress={() => setViewMode('map')}
                >
                  <Icon name="map" size={20} color={viewMode === 'map' ? '#2563EB' : '#6B7280'} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.searchContainer}>
              <View style={styles.searchInputContainer}>
                <Icon name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search by location, property type, keywords..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
              <TouchableOpacity
                style={styles.filterButton}
                onPress={() => setShowFilters(!showFilters)}
              >
                <Icon name="filter" size={20} color="#374151" />
                <Text style={styles.filterButtonText}>Filters</Text>
                <Icon
                  name={showFilters ? 'chevron-up' : 'chevron-down'}
                  size={16}
                  color="#374151"
                />
              </TouchableOpacity>
            </View>
            {showFilters && (
              <View style={styles.filtersContainer}>
                <View style={styles.filterRow}>
                  <View style={styles.filterItem}>
                    <Text style={styles.filterLabel}>Price Range</Text>
                    <View style={styles.priceInputs}>
                      <View style={styles.priceInputContainer}>
                        <Text style={styles.currencySymbol}>₹</Text>
                        <TextInput
                          style={styles.priceInput}
                          placeholder="Min"
                          keyboardType="numeric"
                          value={filters.priceMin ? filters.priceMin.toString() : ''}
                          onChangeText={(text) =>
                            setFilters({ ...filters, priceMin: Number(text) || 0 })
                          }
                        />
                      </View>
                      <View style={styles.priceInputContainer}>
                        <Text style={styles.currencySymbol}>₹</Text>
                        <TextInput
                          style={styles.priceInput}
                          placeholder="Max"
                          keyboardType="numeric"
                          value={filters.priceMax ? filters.priceMax.toString() : ''}
                          onChangeText={(text) =>
                            setFilters({ ...filters, priceMax: Number(text) || 1000000000 })
                          }
                        />
                      </View>
                    </View>
                  </View>
                  <View style={styles.filterItem}>
                    <Text style={styles.filterLabel}>Bedrooms</Text>
                    <View style={styles.selectContainer}>
                      <TextInput
                        style={styles.selectInput}
                        value={
                          filters.bedrooms === 0
                            ? 'Any'
                            : `${filters.bedrooms}+`
                        }
                        editable={false}
                      />
                      <Icon name="chevron-down" size={16} color="#374151" />
                    </View>
                  </View>
                </View>
                <View style={styles.filterRow}>
                  <View style={styles.filterItem}>
                    <Text style={styles.filterLabel}>Bathrooms</Text>
                    <View style={styles.selectContainer}>
                      <TextInput
                        style={styles.selectInput}
                        value={
                          filters.bathrooms === 0
                            ? 'Any'
                            : `${filters.bathrooms}+`
                        }
                        editable={false}
                      />
                      <Icon name="chevron-down" size={16} color="#374151" />
                    </View>
                  </View>
                  <View style={styles.filterItem}>
                    <Text style={styles.filterLabel}>Property Type</Text>
                    <View style={styles.selectContainer}>
                      <TextInput
                        style={styles.selectInput}
                        value={
                          filters.propertyType === 'all'
                            ? 'All Types'
                            : filters.propertyType.charAt(0).toUpperCase() +
                              filters.propertyType.slice(1)
                        }
                        editable={false}
                      />
                      <Icon name="chevron-down" size={16} color="#374151" />
                    </View>
                  </View>
                </View>
                <View style={styles.filterActions}>
                  <TouchableOpacity style={styles.resetButton} onPress={clearFilters}>
                    <Text style={styles.resetButtonText}>Reset</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.applyButton}
                    onPress={() => setShowFilters(false)}
                  >
                    <Text style={styles.applyButtonText}>Apply Filters</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2563EB" />
              </View>
            ) : error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.tryAgainButton} onPress={fetchData}>
                  <Text style={styles.tryAgainButtonText}>Try Again</Text>
                </TouchableOpacity>
              </View>
            ) : filteredProperties.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Icon name="search" size={48} color="#D1D5DB" />
                <Text style={styles.emptyTitle}>No properties found</Text>
                <Text style={styles.emptySubtitle}>
                  Try adjusting your filters or search criteria
                </Text>
                <TouchableOpacity style={styles.clearFiltersButton} onPress={clearFilters}>
                  <Text style={styles.clearFiltersButtonText}>Clear Filters</Text>
                </TouchableOpacity>
              </View>
            ) : viewMode === 'grid' ? (
              <FlatList
                data={filteredProperties}
                renderItem={renderPropertyItem}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.propertyList}
                numColumns={isTablet ? 2 : 1}
              />
            ) : (
              <View style={styles.mapPlaceholder}>
                <Icon name="map" size={48} color="#6B7280" />
                <Text style={styles.mapPlaceholderText}>
                  Map view would be implemented here
                </Text>
                <Text style={styles.mapPlaceholderSubtitle}>
                  Using latitude/longitude from property data
                </Text>
              </View>
            )}
          </ScrollView>
        )}

        {activeTab === 'profile' && (
          <ScrollView style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Profile</Text>
            <View style={styles.profileContainer}>
              <View style={styles.profileSection}>
                <Text style={styles.profileSectionTitle}>Personal Information</Text>
                <View style={styles.profileItem}>
                  <Text style={styles.profileLabel}>Full Name</Text>
                  <Text style={styles.profileValue}>{user.fullName}</Text>
                </View>
                <View style={styles.profileItem}>
                  <Text style={styles.profileLabel}>Email</Text>
                  <Text style={styles.profileValue}>{user.email}</Text>
                </View>
                <View style={styles.profileItem}>
                  <Text style={styles.profileLabel}>Contact Number</Text>
                  <Text style={styles.profileValue}>{user.contactNumber}</Text>
                </View>
                <View style={styles.profileItem}>
                  <Text style={styles.profileLabel}>Account Status</Text>
                  <Text style={styles.profileValue}>{user.status}</Text>
                </View>
                <View style={styles.profileItem}>
                  <Text style={styles.profileLabel}>Membership Tier</Text>
                  <Text style={styles.profileValue}>{user.tier}</Text>
                </View>
              </View>
              <View style={styles.profileSection}>
                <Text style={styles.profileSectionTitle}>Notifications</Text>
                {notifications.length === 0 ? (
                  <View style={styles.emptyNotifications}>
                    <Icon name="bell" size={48} color="#D1D5DB" />
                    <Text style={styles.emptyNotificationsText}>No notifications</Text>
                  </View>
                ) : (
                  <View style={styles.notificationsContainer}>
                    {notifications.map((notification) => (
                      <View
                        key={notification.id}
                        style={[
                          styles.notificationItem,
                          notification.read
                            ? styles.readNotification
                            : styles.unreadNotification,
                        ]}
                      >
                        <View style={styles.notificationContent}>
                          <Icon name="bell" size={20} color="#6B7280" style={styles.notificationIcon} />
                          <Text
                            style={[
                              styles.notificationText,
                              notification.read && styles.readNotificationText,
                            ]}
                          >
                            {notification.message}
                          </Text>
                        </View>
                        {!notification.read && (
                          <TouchableOpacity
                            onPress={() => markNotificationAsRead(notification.id)}
                          >
                            <Text style={styles.markAsReadText}>Mark as read</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    ))}
                  </View>
                )}
              </View>
              <TouchableOpacity
                style={styles.editProfileButton}
                onPress={() => console.log('Navigate to edit profile page')}
              >
                <Text style={styles.editProfileButtonText}>Edit Profile</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}

        {/* Limit Reached Modal */}
        <Modal
          visible={showLimitModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowLimitModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <View style={styles.modalTitleContainer}>
                  <Icon name="alert-circle" size={24} color="#F59E0B" style={styles.modalIcon} />
                  <Text style={styles.modalTitle}>View Limit Reached</Text>
                </View>
                <TouchableOpacity onPress={() => setShowLimitModal(false)}>
                  <Icon name="x" size={20} color="#6B7280" />
                </TouchableOpacity>
              </View>
              <Text style={styles.modalText}>
                You've reached your monthly property view limit for the {user.tier} tier. Upgrade
                your tier to view more properties or join the waitlist for this property.
              </Text>
              {selectedPropertyForView && (
                <Text style={styles.modalPropertyText}>
                  Property: {selectedPropertyForView.title}
                </Text>
              )}
              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.upgradeTierButton} onPress={handleUpgradeTier}>
                  <Text style={styles.upgradeTierButtonText}>Upgrade Tier</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

// Styles remain unchanged
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  main: {
    flex: 1,
    padding: 16,
  },
  limitIndicator: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  limitHeader: {
    marginBottom: 8,
  },
  limitTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  limitSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  limitProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
    marginRight: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2563EB',
  },
  progressText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
  upgradeButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-end',
  },
  upgradeButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFF',
    padding: 8,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  tabText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  activeTabText: {
    color: '#2563EB',
    fontWeight: '600',
  },
  tabContent: {
    flex: 1,
  },
  browseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  viewModeContainer: {
    flexDirection: 'row',
  },
  viewModeButton: {
    padding: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  activeViewMode: {
    backgroundColor: '#DBEAFE',
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    paddingVertical: 10,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    padding: 10,
    borderRadius: 8,
    marginLeft: 8,
  },
  filterButtonText: {
    fontSize: 16,
    color: '#374151',
    marginHorizontal: 4,
  },
  filtersContainer: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  filterRow: {
    flexDirection: isTablet ? 'row' : 'column',
    marginBottom: 16,
  },
  filterItem: {
    flex: 1,
    marginRight: isTablet ? 16 : 0,
    marginBottom: isTablet ? 0 : 16,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  priceInputs: {
    flexDirection: 'row',
  },
  priceInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    marginRight: 8,
  },
  currencySymbol: {
    fontSize: 16,
    color: '#6B7280',
    paddingHorizontal: 8,
  },
  priceInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    paddingVertical: 10,
  },
  selectContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  selectInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    paddingVertical: 10,
  },
  filterActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  resetButton: {
    backgroundColor: '#E5E7EB',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  resetButtonText: {
    fontSize: 14,
    color: '#374151',
  },
  applyButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  applyButtonText: {
    fontSize: 14,
    color: '#FFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorContainer: {
    backgroundColor: '#FEF2F2',
    padding: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#DC2626',
    marginBottom: 16
  },
  tryAgainButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  tryAgainButtonText: {
    fontSize: 14,
    color: '#FFF',
  },
  emptyContainer: {
    backgroundColor: '#FFF',
    padding: 24,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginTop: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  clearFiltersButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  clearFiltersButtonText: {
    fontSize: 14,
    color: '#FFF',
  },
  propertyList: {
    paddingBottom: 16,
  },
  propertyCard: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginBottom: 16,
    marginHorizontal: isTablet ? 8 : 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    width: isTablet ? width / 2 - 24 : width - 32,
  },
  propertyImageContainer: {
    height: 192,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  propertyImage: {
    width: '100%',
    height: '100%',
  },
  noImageContainer: {
    flex: 1,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    fontSize: 14,
    color: '#6B7280',
  },
  newBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#22C55E',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: '#F59E0B',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  viewedBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: '#2563EB',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    color: '#FFF',
    fontWeight: '500',
  },
  badgeIcon: {
    marginRight: 4,
  },
  propertyDetails: {
    padding: 16,
  },
  propertyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  propertyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  propertyPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2563EB',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationIcon: {
    marginRight: 4,
  },
  locationText: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 14,
    color: '#6B7280',
    marginRight: 12,
  },
  viewButton: {
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#2563EB',
  },
  viewedButton: {
    backgroundColor: '#DBEAFE',
  },
  disabledButton: {
    backgroundColor: '#D1D5DB',
  },
  viewButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFF',
  },
  mapPlaceholder: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    height: 384,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  mapPlaceholderText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 8,
  },
  mapPlaceholderSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  browseButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  browseButtonText: {
    fontSize: 14,
    color: '#FFF',
  },
  profileContainer: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  profileSection: {
    marginBottom: 24,
  },
  profileSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  profileItem: {
    marginBottom: 16,
  },
  profileLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  profileValue: {
    fontSize: 16,
    color: '#111827',
  },
  emptyNotifications: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  emptyNotificationsText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
  },
  notificationsContainer: {
    marginBottom: 16,
  },
  notificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  readNotification: {
    backgroundColor: '#F9FAFB',
  },
  unreadNotification: {
    backgroundColor: '#EFF6FF',
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  notificationIcon: {
    marginRight: 8,
  },
  notificationText: {
    fontSize: 14,
    color: '#111827',
    flex: 1,
  },
  readNotificationText: {
    color: '#6B7280',
  },
  markAsReadText: {
    fontSize: 14,
    color: '#2563EB',
  },
  editProfileButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-end',
  },
  editProfileButtonText: {
    fontSize: 14,
    color: '#FFF',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 16,
    width: '90%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalIcon: {
    marginRight: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  modalText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  modalPropertyText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  upgradeTierButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  upgradeTierButtonText: {
    fontSize: 14,
    color: '#FFF',
  },
});