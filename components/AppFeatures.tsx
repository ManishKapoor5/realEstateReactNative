// import React from 'react';
// import { View, Text, StyleSheet, FlatList } from 'react-native';
// import FeatureCard from './FeatureCard';
// import { MapPinIcon, HomeIcon, ImageIcon, MapIcon } from 'lucide-react-native';

// // Define the Feature interface
// interface Feature {
//   id: string;
//   icon: React.FC<{ size?: number; color?: string; strokeWidth?: number }>;
//   title: string;
//   description: string;
// }

// const AppFeatures: React.FC = () => {
//   const features: Feature[] = [
//     {
//       id: 'verified-listings',
//       icon: HomeIcon,
//       title: 'Verified Listings',
//       description: 'All properties are thoroughly verified to ensure quality and accuracy.',
//     },
//     {
//       id: 'neighborhood-insights',
//       icon: MapPinIcon,
//       title: 'Neighborhood Insights',
//       description: 'Get detailed information about communities, schools, and amenities.',
//     },
//     {
//       id: 'interactive-maps',
//       icon: MapIcon,
//       title: 'Interactive Maps',
//       description: 'Explore available properties with our intuitive map interface.',
//     },
//     {
//       id: 'virtual-tours',
//       icon: ImageIcon,
//       title: 'Virtual Tours',
//       description: 'View properties from the comfort of your home with virtual tours.',
//     },
//   ];

//   if (!features.length) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.title} accessibilityLabel="App Features Title">
//           App Features
//         </Text>
//         <Text style={styles.subtitle}>No features available</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container} accessible>
//       <Text style={styles.title} accessibilityLabel="App Features Title">
//         App Features
//       </Text>
//       <Text style={styles.subtitle}>Discover what sets our app apart</Text>

//       <FlatList
//         data={features}
//         renderItem={({ item }) => (
//           <FeatureCard
//             icon={item.icon}
//             title={item.title}
//             description={item.description}
//           />
//         )}
//         keyExtractor={(item) => item.id}
//         contentContainerStyle={styles.featuresList}
//       />
//     </View>
//   );
// };

// const theme = {
//   colors: {
//     background: '#f9fafb',
//     textPrimary: '#1f2937',
//     textSecondary: '#6b7280',
//   },
// };

// const styles = StyleSheet.create({
//   container: {
//     paddingVertical: 40,
//     paddingHorizontal: 24,
//     backgroundColor: theme.colors.background,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     color: theme.colors.textPrimary,
//     marginBottom: 8,
//   },
//   subtitle: {
//     textAlign: 'center',
//     color: theme.colors.textSecondary,
//     marginBottom: 32,
//   },
//   featuresList: {
//     gap: 16,
//   },
// });

// export default AppFeatures;

// AppFeatures.tsx
// import React from 'react';
// import { View, Text, StyleSheet, FlatList, useWindowDimensions, SafeAreaView, ScrollView } from 'react-native';
// import FeatureCard from './FeatureCard';
// import { MapPinIcon, HomeIcon, ImageIcon, MapIcon } from 'lucide-react-native';

// // Define the Feature interface
// interface Feature {
//   id: string;
//   icon: React.FC<{ size?: number; color?: string; strokeWidth?: number }>;
//   title: string;
//   description: string;
// }

// const AppFeatures: React.FC = () => {
//   const { width } = useWindowDimensions();
  
//   // Determine number of columns based on screen width
//   const getNumColumns = () => {
//     if (width >= 768) return 2; // Tablet and larger: 2 columns
//     return 1; // Phone: 1 column
//   };

//   const features: Feature[] = [
//     {
//       id: 'verified-listings',
//       icon: HomeIcon,
//       title: 'Verified Listings',
//       description: 'All properties are thoroughly verified to ensure quality and accuracy.',
//     },
//     {
//       id: 'neighborhood-insights',
//       icon: MapPinIcon,
//       title: 'Neighborhood Insights',
//       description: 'Get detailed information about communities, schools, and amenities.',
//     },
//     {
//       id: 'interactive-maps',
//       icon: MapIcon,
//       title: 'Interactive Maps',
//       description: 'Explore available properties with our intuitive map interface.',
//     },
//     {
//       id: 'virtual-tours',
//       icon: ImageIcon,
//       title: 'Virtual Tours',
//       description: 'View properties from the comfort of your home with virtual tours.',
//     },
//   ];

//   if (!features.length) {
//     return (
//       <SafeAreaView style={styles.safeArea}>
//         <View style={styles.container}>
//           <Text style={styles.title} accessibilityLabel="App Features Title">
//             App Features
//           </Text>
//           <Text style={styles.subtitle}>No features available</Text>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   // For tablet and larger: use a grid layout with multiple columns
//   if (width >= 768) {
//     return (
//       <SafeAreaView style={styles.safeArea}>
//         <ScrollView>
//           <View style={styles.container} accessible>
//             <Text style={styles.title} accessibilityLabel="App Features Title">
//               App Features
//             </Text>
//             <Text style={styles.subtitle}>Discover what sets our app apart</Text>
            
//             <View style={styles.grid}>
//               {features.map((item) => (
//                 <View style={styles.gridItem} key={item.id}>
//                   <FeatureCard
//                     icon={item.icon}
//                     title={item.title}
//                     description={item.description}
//                   />
//                 </View>
//               ))}
//             </View>
//           </View>
//         </ScrollView>
//       </SafeAreaView>
//     );
//   }

//   // For smaller screens: use a vertical list
//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <View style={styles.container} accessible>
//         <Text style={styles.title} accessibilityLabel="App Features Title">
//           App Features
//         </Text>
//         <Text style={styles.subtitle}>Discover what sets our app apart</Text>

//         <FlatList
//           data={features}
//           renderItem={({ item }) => (
//             <FeatureCard
//               icon={item.icon}
//               title={item.title}
//               description={item.description}
//             />
//           )}
//           keyExtractor={(item) => item.id}
//           contentContainerStyle={styles.featuresList}
//           showsVerticalScrollIndicator={false}
//         />
//       </View>
//     </SafeAreaView>
//   );
// };

// const theme = {
//   colors: {
//     background: '#f9fafb',
//     textPrimary: '#1f2937',
//     textSecondary: '#6b7280',
//   },
//   spacing: {
//     xs: 8,
//     sm: 16,
//     md: 24,
//     lg: 32,
//     xl: 40,
//   },
//   borderRadius: {
//     sm: 8,
//     md: 12,
//     lg: 16,
//   },
// };

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: theme.colors.background,
//   },
//   container: {
//     flex: 1,
//     paddingVertical: theme.spacing.xl,
//     paddingHorizontal: theme.spacing.md,
//     backgroundColor: theme.colors.background,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     color: theme.colors.textPrimary,
//     marginBottom: theme.spacing.xs,
//   },
//   subtitle: {
//     textAlign: 'center',
//     color: theme.colors.textSecondary,
//     marginBottom: theme.spacing.lg,
//   },
//   featuresList: {
//     gap: theme.spacing.md,
//   },
//   grid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     marginHorizontal: -theme.spacing.sm / 2,
//   },
//   gridItem: {
//     width: '50%',
//     paddingHorizontal: theme.spacing.sm / 2,
//     marginBottom: theme.spacing.md,
//   },
// });

// export default AppFeatures;

// AppFeatures.tsx
// import React from 'react';
// import { View, Text, StyleSheet, FlatList, useWindowDimensions, SafeAreaView, ScrollView } from 'react-native';
// import FeatureCard from './FeatureCard';
// import { MapPinIcon, HomeIcon, ImageIcon, MapIcon, BuildingIcon } from 'lucide-react-native';

// // Define the Feature interface
// interface Feature {
//   id: string;
//   icon: React.FC<{ size?: number; color?: string; strokeWidth?: number }>;
//   title: string;
//   description: string;
// }

// const AppFeatures: React.FC = () => {
//   const { width } = useWindowDimensions();
  
//   // Determine number of columns based on screen width
//   const getNumColumns = () => {
//     if (width >= 768) return 2; // Tablet and larger: 2 columns
//     return 1; // Phone: 1 column
//   };

//   const features: Feature[] = [
//     {
//       id: 'verified-listings',
//       icon: BuildingIcon,
//       title: 'Verified Listings',
//       description: 'All properties are thoroughly verified to ensure quality and accuracy.',
//     },
//     {
//       id: 'neighborhood-insights',
//       icon: MapPinIcon,
//       title: 'Neighborhood Insights',
//       description: 'Get detailed information about communities, schools, and amenities.',
//     },
//     {
//       id: 'interactive-maps',
//       icon: MapIcon,
//       title: 'Interactive Maps',
//       description: 'Explore available properties with our intuitive map interface.',
//     },
//     {
//       id: 'virtual-tours',
//       icon: ImageIcon,
//       title: 'Virtual Tours',
//       description: 'View properties from the comfort of your home with virtual tours.',
//     },
//   ];

//   if (!features.length) {
//     return (
//       <SafeAreaView style={styles.safeArea}>
//         <View style={styles.container}>
//           <Text style={styles.title} accessibilityLabel="App Features Title">
//             App Features
//           </Text>
//           <Text style={styles.subtitle}>No features available</Text>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   // For tablet and larger: use a grid layout with multiple columns
//   if (width >= 768) {
//     return (
//       <SafeAreaView style={styles.safeArea}>
//         <ScrollView>
//           <View style={styles.container} accessible>
//             <Text style={styles.title} accessibilityLabel="App Features Title">
//               App Features
//             </Text>
//             <Text style={styles.subtitle}>Discover what sets our app apart</Text>
            
//             <View style={styles.grid}>
//               {features.map((item) => (
//                 <View style={styles.gridItem} key={item.id}>
//                   <FeatureCard
//                     icon={item.icon}
//                     title={item.title}
//                     description={item.description}
//                   />
//                 </View>
//               ))}
//             </View>
//           </View>
//         </ScrollView>
//       </SafeAreaView>
//     );
//   }

//   // For smaller screens: use a vertical list
//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <View style={styles.container} accessible>
//         <Text style={styles.title} accessibilityLabel="App Features Title">
//           App Features
//         </Text>
//         <Text style={styles.subtitle}>Discover what sets our app apart</Text>

//         <FlatList
//           data={features}
//           renderItem={({ item }) => (
//             <FeatureCard
//               icon={item.icon}
//               title={item.title}
//               description={item.description}
//             />
//           )}
//           keyExtractor={(item) => item.id}
//           contentContainerStyle={styles.featuresList}
//           showsVerticalScrollIndicator={false}
//         />
//       </View>
//     </SafeAreaView>
//   );
// };

// const theme = {
//   colors: {
//     background: '#f9fafb',
//     textPrimary: '#1f2937',
//     textSecondary: '#6b7280',
//   },
//   spacing: {
//     xs: 8,
//     sm: 16,
//     md: 24,
//     lg: 32,
//     xl: 40,
//   },
//   borderRadius: {
//     sm: 8,
//     md: 12,
//     lg: 16,
//   },
// };

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: theme.colors.background,
//   },
//   container: {
//     flex: 1,
//     paddingVertical: theme.spacing.xl,
//     paddingHorizontal: theme.spacing.md,
//     backgroundColor: theme.colors.background,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     color: theme.colors.textPrimary,
//     marginBottom: theme.spacing.xs,
//   },
//   subtitle: {
//     textAlign: 'center',
//     color: theme.colors.textSecondary,
//     marginBottom: theme.spacing.lg,
//   },
//   featuresList: {
//     gap: theme.spacing.md,
//   },
//   grid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     marginHorizontal: -theme.spacing.sm / 2,
//   },
//   gridItem: {
//     width: '50%',
//     paddingHorizontal: theme.spacing.sm / 2,
//     marginBottom: theme.spacing.md,
//   },
// });

// export default AppFeatures;

// AppFeatures.tsx
// import React from 'react';
// import { View, Text, StyleSheet, FlatList, useWindowDimensions, SafeAreaView, ScrollView, StatusBar, Platform } from 'react-native';
// // import LinearGradient from 'react-native-linear-gradient';
// import FeatureCard from './FeatureCard';
// import { MapPinIcon, HomeIcon, ImageIcon, MapIcon, BuildingIcon, KeyIcon } from 'lucide-react-native';

// // Define the Feature interface
// interface Feature {
//   id: string;
//   icon: React.FC<{ size?: number; color?: string; strokeWidth?: number }>;
//   title: string;
//   description: string;
// }

// const AppFeatures: React.FC = () => {
//   const { width } = useWindowDimensions();
  
//   // Determine number of columns based on screen width
//   const getNumColumns = () => {
//     if (width >= 768) return 2; // Tablet and larger: 2 columns
//     return 1; // Phone: 1 column
//   };

//   const features: Feature[] = [
//     {
//       id: 'verified-listings',
//       icon: BuildingIcon,
//       title: 'Verified Listings',
//       description: 'All properties are thoroughly verified by our team to ensure quality, accuracy and the best selection for you.',
//     },
//     {
//       id: 'neighborhood-insights',
//       icon: MapPinIcon,
//       title: 'Neighborhood Insights',
//       description: 'Discover detailed information about communities, schools, safety ratings, and local amenities for every listing.',
//     },
//     {
//       id: 'interactive-maps',
//       icon: MapIcon,
//       title: 'Interactive Maps',
//       description: 'Explore available properties with our intuitive map interface featuring customizable filters and real-time updates.',
//     },
//     {
//       id: 'virtual-tours',
//       icon: ImageIcon,
//       title: 'Virtual Tours',
//       description: 'Experience properties remotely with immersive 3D virtual tours and high-quality photo galleries.',
//     },
//     {
//       id: 'instant-booking',
//       icon: KeyIcon,
//       title: 'Instant Booking',
//       description: 'Schedule property viewings with a single tap and receive instant confirmation from property owners.',
//     },
//   ];

//   if (!features.length) {
//     return (
//       <SafeAreaView style={styles.safeArea}>
//         <View style={styles.container}>
//           <Text style={styles.title} accessibilityLabel="App Features Title">
//             App Features
//           </Text>
//           <Text style={styles.subtitle}>No features available</Text>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   const renderHeader = () => (
//     <View style={styles.headerSection}>
//       <Text style={styles.titleAccent}>PREMIUM EXPERIENCE</Text>
//       <Text style={styles.title} accessibilityLabel="App Features Title">
//         Find Your Dream Home
//       </Text>
//       <View style={styles.fancyDivider} />
//       <Text style={styles.subtitle}>
//         Discover unique features that make your property search effortless and enjoyable
//       </Text>
//     </View>
//   );

//   // For tablet and larger: use a grid layout with multiple columns
//   if (width >= 768) {
//     return (
//       <SafeAreaView style={styles.safeArea}>
//         <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
//         <ScrollView showsVerticalScrollIndicator={false} bounces={true}>
//           <View style={styles.container} accessible>
//             {renderHeader()}
            
//             <View style={styles.grid}>
//               {features.map((item) => (
//                 <View style={styles.gridItem} key={item.id}>
//                   <FeatureCard
//                     icon={item.icon}
//                     title={item.title}
//                     description={item.description}
//                     accentColor={
//                       item.id === 'verified-listings' ? theme.colors.primary :
//                       item.id === 'neighborhood-insights' ? theme.colors.secondary :
//                       item.id === 'interactive-maps' ? theme.colors.accent :
//                       theme.colors.primaryDark
//                     }
//                   />
//                 </View>
//               ))}
//             </View>
//           </View>
//         </ScrollView>
//       </SafeAreaView>
//     );
//   }

//   // For smaller screens: use a vertical list
//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
//       <View style={styles.container} accessible>
//         {renderHeader()}

//         <FlatList
//           data={features}
//           renderItem={({ item, index }) => (
//             <FeatureCard
//               icon={item.icon}
//               title={item.title}
//               description={item.description}
//               accentColor={
//                 item.id === 'verified-listings' ? theme.colors.primary :
//                 item.id === 'neighborhood-insights' ? theme.colors.secondary :
//                 item.id === 'interactive-maps' ? theme.colors.accent :
//                 theme.colors.primaryDark
//               }
//             />
//           )}
//           keyExtractor={(item) => item.id}
//           contentContainerStyle={styles.featuresList}
//           showsVerticalScrollIndicator={false}
//           scrollEventThrottle={16}
//         />
//       </View>
//     </SafeAreaView>
//   );
// };

// const theme = {
//   colors: {
//     background: '#f8fafc',
//     backgroundAlt: '#ffffff',
//     primary: '#3b82f6',
//     primaryLight: '#bfdbfe',
//     primaryDark: '#2563eb',
//     secondary: '#10b981',
//     secondaryLight: '#d1fae5',
//     accent: '#8b5cf6',
//     accentLight: '#ddd6fe',
//     textPrimary: '#0f172a',
//     textSecondary: '#64748b',
//     border: '#e2e8f0',
//     shadow: 'rgba(0, 0, 0, 0.1)',
//   },
//   spacing: {
//     xxs: 4,
//     xs: 8,
//     sm: 16,
//     md: 24,
//     lg: 32,
//     xl: 40,
//     xxl: 56,
//   },
//   borderRadius: {
//     sm: 8,
//     md: 12,
//     lg: 16,
//     xl: 24,
//     full: 9999,
//   },
//   fontSizes: {
//     xs: 12,
//     sm: 14,
//     md: 16,
//     lg: 18,
//     xl: 20,
//     xxl: 24,
//     xxxl: 32,
//   },
// };

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: theme.colors.background,
//     paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
//   },
//   container: {
//     flex: 1,
//     paddingVertical: theme.spacing.xl,
//     paddingHorizontal: theme.spacing.md,
//     backgroundColor: theme.colors.background,
//   },
//   headerSection: {
//     marginBottom: theme.spacing.xl,
//     paddingHorizontal: theme.spacing.sm,
//     alignItems: 'center',
//   },
//   titleAccent: {
//     fontSize: theme.fontSizes.md,
//     fontWeight: '600',
//     color: theme.colors.primary,
//     textTransform: 'uppercase',
//     letterSpacing: 1.2,
//     marginBottom: theme.spacing.xs,
//   },
//   title: {
//     fontSize: theme.fontSizes.xxxl,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     color: theme.colors.textPrimary,
//     marginBottom: theme.spacing.sm,
//     letterSpacing: 0.5,
//   },
//   subtitle: {
//     fontSize: theme.fontSizes.md,
//     textAlign: 'center',
//     color: theme.colors.textSecondary,
//     marginBottom: theme.spacing.sm,
//     maxWidth: 400,
//     lineHeight: 22,
//   },
//   featuresList: {
//     paddingHorizontal: theme.spacing.xxs,
//     paddingBottom: theme.spacing.lg,
//     gap: theme.spacing.md,
//   },
//   grid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     marginHorizontal: -theme.spacing.xs,
//   },
//   gridItem: {
//     width: '50%',
//     paddingHorizontal: theme.spacing.xs,
//     marginBottom: theme.spacing.md,
//   },
//   fancyDivider: {
//     height: 4,
//     width: 60,
//     backgroundColor: theme.colors.primary,
//     borderRadius: theme.borderRadius.full,
//     marginVertical: theme.spacing.md,
//     alignSelf: 'center',
//   },
// });

// export default AppFeatures;

// AppFeatures.tsx
import React from 'react';
import { View, Text, StyleSheet, FlatList, useWindowDimensions, SafeAreaView, ScrollView, StatusBar, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FeatureCard from './FeatureCard';
import { MapPinIcon, HomeIcon, ImageIcon, MapIcon, BuildingIcon, KeyIcon } from 'lucide-react-native';

// Define the Feature interface
interface Feature {
  id: string;
  icon: React.FC<{ size?: number; color?: string; strokeWidth?: number }>;
  title: string;
  description: string;
}

const AppFeatures: React.FC = () => {
  const { width } = useWindowDimensions();
  
  // Determine number of columns based on screen width
  const getNumColumns = () => {
    if (width >= 768) return 2; // Tablet and larger: 2 columns
    return 1; // Phone: 1 column
  };

  const features: Feature[] = [
    {
      id: 'verified-listings',
      icon: BuildingIcon,
      title: 'Verified Listings',
      description: 'All properties are thoroughly verified by our team to ensure quality, accuracy and the best selection for you.',
    },
    {
      id: 'neighborhood-insights',
      icon: MapPinIcon,
      title: 'Neighborhood Insights',
      description: 'Discover detailed information about communities, schools, safety ratings, and local amenities for every listing.',
    },
    {
      id: 'interactive-maps',
      icon: MapIcon,
      title: 'Interactive Maps',
      description: 'Explore available properties with our intuitive map interface featuring customizable filters and real-time updates.',
    },
    {
      id: 'virtual-tours',
      icon: ImageIcon,
      title: 'Virtual Tours',
      description: 'Experience properties remotely with immersive 3D virtual tours and high-quality photo galleries.',
    },
    {
      id: 'instant-booking',
      icon: KeyIcon,
      title: 'Instant Booking',
      description: 'Schedule property viewings with a single tap and receive instant confirmation from property owners.',
    },
  ];

  if (!features.length) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.title} accessibilityLabel="App Features Title">
            App Features
          </Text>
          <Text style={styles.subtitle}>No features available</Text>
        </View>
      </SafeAreaView>
    );
  }

  const renderHeader = () => (
    <View style={styles.headerSection}>
      <Text style={styles.titleAccent}>PREMIUM EXPERIENCE</Text>
      <Text style={styles.title} accessibilityLabel="App Features Title">
        Find Your Dream Home
      </Text>
      <View style={styles.fancyDivider} />
      <Text style={styles.subtitle}>
        Discover unique features that make your property search effortless and enjoyable
      </Text>
    </View>
  );

  // For tablet and larger screens with more space: possibly use 3 columns
  if (width >= 1024) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
        <ScrollView showsVerticalScrollIndicator={false} bounces={true}>
          <View style={[styles.container, { paddingHorizontal: theme.spacing.lg }]} accessible>
            {renderHeader()}
            
            <View style={styles.grid}>
              {features.map((item) => (
                <View style={[styles.gridItem, { width: '33.33%' }]} key={item.id}>
                  <FeatureCard
                    icon={item.icon}
                    title={item.title}
                    description={item.description}
                    accentColor={
                      item.id === 'verified-listings' ? theme.colors.primary :
                      item.id === 'neighborhood-insights' ? theme.colors.secondary :
                      item.id === 'interactive-maps' ? theme.colors.accent :
                      item.id === 'virtual-tours' ? theme.colors.primaryDark :
                      theme.colors.secondary
                    }
                  />
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
  
  // For regular tablets: use a grid layout with 2 columns
  else if (width >= 768) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
        <ScrollView showsVerticalScrollIndicator={false} bounces={true}>
          <View style={styles.container} accessible>
            {renderHeader()}
            
            <View style={styles.grid}>
              {features.map((item) => (
                <View style={styles.gridItem} key={item.id}>
                  <FeatureCard
                    icon={item.icon}
                    title={item.title}
                    description={item.description}
                    accentColor={
                      item.id === 'verified-listings' ? theme.colors.primary :
                      item.id === 'neighborhood-insights' ? theme.colors.secondary :
                      item.id === 'interactive-maps' ? theme.colors.accent :
                      theme.colors.primaryDark
                    }
                  />
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // For smaller screens: use a vertical list
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      <View style={styles.container} accessible>
        {renderHeader()}

        <FlatList
          data={features}
          renderItem={({ item, index }) => (
            <FeatureCard
              icon={item.icon}
              title={item.title}
              description={item.description}
              accentColor={
                item.id === 'verified-listings' ? theme.colors.primary :
                item.id === 'neighborhood-insights' ? theme.colors.secondary :
                item.id === 'interactive-maps' ? theme.colors.accent :
                theme.colors.primaryDark
              }
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.featuresList}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
        />
      </View>
    </SafeAreaView>
  );
};

const theme = {
  colors: {
    background: '#f8fafc',
    backgroundAlt: '#ffffff',
    primary: '#3b82f6',
    primaryLight: '#bfdbfe',
    primaryDark: '#2563eb',
    secondary: '#10b981',
    secondaryLight: '#d1fae5',
    accent: '#8b5cf6',
    accentLight: '#ddd6fe',
    textPrimary: '#0f172a',
    textSecondary: '#64748b',
    border: '#e2e8f0',
    shadow: 'rgba(0, 0, 0, 0.1)',
  },
  spacing: {
    xxs: 4,
    xs: 8,
    sm: 16,
    md: 24,
    lg: 32,
    xl: 40,
    xxl: 56,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.background,
  },
  headerSection: {
    marginBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.sm,
    alignItems: 'center',
  },
  titleAccent: {
    fontSize: theme.fontSizes.md,
    fontWeight: '600',
    color: theme.colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: theme.spacing.xs,
  },
  title: {
    fontSize: theme.fontSizes.xxxl,
    fontWeight: 'bold',
    textAlign: 'center',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: theme.fontSizes.md,
    textAlign: 'center',
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
    maxWidth: 400,
    lineHeight: 22,
  },
  featuresList: {
    paddingHorizontal: theme.spacing.xxs,
    paddingBottom: theme.spacing.lg,
    gap: theme.spacing.xl, // Increased gap between cards in the list view
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -theme.spacing.xs,
  },
  gridItem: {
    width: '50%',
    paddingHorizontal: theme.spacing.xs,
    marginBottom: theme.spacing.xl, // Increased spacing between grid items
  },
  fancyDivider: {
    height: 4,
    width: 60,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.full,
    marginVertical: theme.spacing.md,
    alignSelf: 'center',
  },
});

export default AppFeatures;