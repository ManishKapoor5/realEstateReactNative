// // Alternative approach if styled is not working
// import React from 'react';
// import { View, Text } from 'react-native';
// import { useColorScheme } from 'nativewind';

// interface FeatureCardProps {
//   icon: React.FC<{ size?: number; color?: string; strokeWidth?: number }>;
//   title: string;
//   description: string;
// }

// const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description }) => {
//   // Use the style prop directly with Tailwind classes
//   return (
//     <View style={{ 
//       backgroundColor: 'white', 
//       padding: 24, // p-6
//       borderRadius: 12, // rounded-xl
//       borderWidth: 1,
//       borderColor: '#f3f4f6', // border-gray-100
//       shadowColor: '#000',
//       shadowOffset: { width: 0, height: 1 },
//       shadowOpacity: 0.05,
//       shadowRadius: 1,
//       elevation: 1, // shadow-sm
//     }}>
//       <View style={{
//         backgroundColor: '#eff6ff', // bg-blue-50
//         padding: 12, // p-3
//         borderRadius: 8, // rounded-lg
//         marginBottom: 16, // mb-4
//         alignSelf: 'flex-start', // self-start
//       }}>
//         <Icon size={24} color="#3b82f6" strokeWidth={2} />
//       </View>
//       <Text style={{
//         fontSize: 18, // text-lg
//         fontWeight: '600', // font-semibold
//         color: '#1f2937', // text-gray-800
//         marginBottom: 8, // mb-2
//       }}>
//         {title}
//       </Text>
//       <Text style={{
//         color: '#6b7280', // text-gray-500
//         fontSize: 14, // text-sm
//       }}>
//         {description}
//       </Text>
//     </View>
//   );
// };

// export default FeatureCard;

// FeatureCard.tsx
// import React from 'react';
// import { View, Text, StyleSheet } from 'react-native';

// interface FeatureCardProps {
//   icon: React.FC<{ size?: number; color?: string; strokeWidth?: number }>;
//   title: string;
//   description: string;
// }

// const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description }) => {
//   return (
//     <View style={styles.card}>
//       <View style={styles.iconContainer}>
//         <Icon size={24} color="#3b82f6" strokeWidth={2} />
//       </View>
//       <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
//         {title}
//       </Text>
//       <Text style={styles.description} numberOfLines={3} ellipsizeMode="tail">
//         {description}
//       </Text>
//     </View>
//   );
// };

// const theme = {
//   colors: {
//     white: '#ffffff',
//     blue50: '#eff6ff',
//     blue500: '#3b82f6',
//     gray100: '#f3f4f6',
//     gray500: '#6b7280',
//     gray800: '#1f2937',
//   },
//   spacing: {
//     xs: 8,
//     sm: 12,
//     md: 16,
//     lg: 24,
//   },
//   borderRadius: {
//     sm: 8,
//     md: 12,
//   },
// };

// const styles = StyleSheet.create({
//   card: {
//     backgroundColor: theme.colors.white,
//     padding: theme.spacing.lg,
//     borderRadius: theme.borderRadius.md,
//     borderWidth: 1,
//     borderColor: theme.colors.gray100,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 1,
//     elevation: 1,
//   },
//   iconContainer: {
//     backgroundColor: theme.colors.blue50,
//     padding: theme.spacing.sm,
//     borderRadius: theme.borderRadius.sm,
//     marginBottom: theme.spacing.md,
//     alignSelf: 'flex-start',
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: theme.colors.gray800,
//     marginBottom: theme.spacing.xs,
//   },
//   description: {
//     color: theme.colors.gray500,
//     fontSize: 14,
//   },
// });

// export default FeatureCard;

// // FeatureCard.tsx
// import React from 'react';
// import { View, Text, StyleSheet } from 'react-native';

// interface FeatureCardProps {
//   icon: React.FC<{ size?: number; color?: string; strokeWidth?: number }>;
//   title: string;
//   description: string;
// }

// const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description }) => {
//   return (
//     <View style={styles.card}>
//       <View style={styles.iconContainer}>
//         <Icon size={24} color="#3b82f6" strokeWidth={2} />
//       </View>
//       <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
//         {title}
//       </Text>
//       <Text style={styles.description} numberOfLines={3} ellipsizeMode="tail">
//         {description}
//       </Text>
//     </View>
//   );
// };

// const theme = {
//   colors: {
//     white: '#ffffff',
//     blue50: '#eff6ff',
//     blue500: '#3b82f6',
//     gray100: '#f3f4f6',
//     gray500: '#6b7280',
//     gray800: '#1f2937',
//   },
//   spacing: {
//     xs: 8,
//     sm: 12,
//     md: 16,
//     lg: 24,
//   },
//   borderRadius: {
//     sm: 8,
//     md: 12,
//   },
// };

// const styles = StyleSheet.create({
//   card: {
//     backgroundColor: theme.colors.white,
//     padding: theme.spacing.lg,
//     borderRadius: theme.borderRadius.md,
//     borderWidth: 1,
//     borderColor: theme.colors.gray100,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 1,
//     elevation: 1,
//   },
//   iconContainer: {
//     backgroundColor: theme.colors.blue50,
//     padding: theme.spacing.sm,
//     borderRadius: theme.borderRadius.sm,
//     marginBottom: theme.spacing.md,
//     alignSelf: 'flex-start',
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: theme.colors.gray800,
//     marginBottom: theme.spacing.xs,
//   },
//   description: {
//     color: theme.colors.gray500,
//     fontSize: 14,
//   },
// });

// export default FeatureCard;

// FeatureCard.tsx
// import React from 'react';
// import { View, Text, StyleSheet, Pressable, Animated, Platform } from 'react-native';

// interface FeatureCardProps {
//   icon: React.FC<{ size?: number; color?: string; strokeWidth?: number }>;
//   title: string;
//   description: string;
//   accentColor?: string;
// }

// const FeatureCard: React.FC<FeatureCardProps> = ({ 
//   icon: Icon, 
//   title, 
//   description, 
//   accentColor = '#3b82f6' 
// }) => {
//   // Animation value for press feedback
//   const animatedScale = new Animated.Value(1);
  
//   // Press handlers for feedback animation
//   const handlePressIn = () => {
//     Animated.spring(animatedScale, {
//       toValue: 0.97,
//       friction: 8,
//       tension: 100,
//       useNativeDriver: true,
//     }).start();
//   };
  
//   const handlePressOut = () => {
//     Animated.spring(animatedScale, {
//       toValue: 1,
//       friction: 3,
//       tension: 40,
//       useNativeDriver: true,
//     }).start();
//   };

//   const animatedStyle = {
//     transform: [{ scale: animatedScale }]
//   };

//   // Derive lighter shade of accent color for background
//   const iconBgColor = `${accentColor}15`; // 15% opacity
  
//   return (
//     <Pressable
//       onPressIn={handlePressIn}
//       onPressOut={handlePressOut}
//       style={({ pressed }) => [
//         { opacity: pressed && Platform.OS === 'ios' ? 0.9 : 1 }
//       ]}
//     >
//       <Animated.View style={[styles.card, animatedStyle]}>
//         <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
//           <Icon size={24} color={accentColor} strokeWidth={2} />
//         </View>
        
//         <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
//           {title}
//         </Text>
        
//         <Text style={styles.description} numberOfLines={3} ellipsizeMode="tail">
//           {description}
//         </Text>
        
//         <View style={[styles.cardAccent, { backgroundColor: accentColor }]} />
//       </Animated.View>
//     </Pressable>
//   );
// };

// const theme = {
//   colors: {
//     white: '#ffffff',
//     textPrimary: '#0f172a',
//     textSecondary: '#64748b',
//     border: '#e2e8f0',
//     shadow: 'rgba(0, 0, 0, 0.06)',
//   },
//   spacing: {
//     xxs: 4,
//     xs: 8,
//     sm: 12,
//     md: 16,
//     lg: 24,
//   },
//   borderRadius: {
//     xs: 4,
//     sm: 8,
//     md: 12,
//     lg: 16,
//   },
// };

// const styles = StyleSheet.create({
//   card: {
//     backgroundColor: theme.colors.white,
//     padding: theme.spacing.lg,
//     paddingTop: theme.spacing.lg - theme.spacing.xxs,
//     borderRadius: theme.borderRadius.md,
//     borderWidth: 1,
//     borderColor: theme.colors.border,
//     position: 'relative',
//     overflow: 'hidden',
//     ...Platform.select({
//       ios: {
//         shadowColor: theme.colors.shadow,
//         shadowOffset: { width: 0, height: 4 },
//         shadowOpacity: 0.2,
//         shadowRadius: 8,
//       },
//       android: {
//         elevation: 4,
//       },
//     }),
//   },
//   iconContainer: {
//     padding: theme.spacing.sm,
//     borderRadius: theme.borderRadius.sm,
//     marginBottom: theme.spacing.md,
//     alignSelf: 'flex-start',
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: theme.colors.textPrimary,
//     marginBottom: theme.spacing.xs,
//     letterSpacing: 0.2,
//   },
//   description: {
//     color: theme.colors.textSecondary,
//     fontSize: 14,
//     lineHeight: 21,
//   },
//   cardAccent: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     width: '100%',
//     height: 4,
//   },
// });

// export default FeatureCard;

import React from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Platform } from 'react-native';

interface FeatureCardProps {
  icon: React.FC<{ size?: number; color?: string; strokeWidth?: number }>;
  title: string;
  description: string;
  accentColor?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  icon: Icon, 
  title, 
  description, 
  accentColor = '#3b82f6' 
}) => {
  // Animation value for press feedback
  const animatedScale = new Animated.Value(1);
  
  // Press handlers for feedback animation
  const handlePressIn = () => {
    Animated.spring(animatedScale, {
      toValue: 0.97,
      friction: 8,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };
  
  const handlePressOut = () => {
    Animated.spring(animatedScale, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const animatedStyle = {
    transform: [{ scale: animatedScale }]
  };

  // Derive lighter shade of accent color for background
  const iconBgColor = `${accentColor}15`; // 15% opacity
  
  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={({ pressed }) => [
        { opacity: pressed && Platform.OS === 'ios' ? 0.9 : 1 }
      ]}
    >
      <Animated.View style={[styles.card, animatedStyle]}>
        <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
          <Icon size={24} color={accentColor} strokeWidth={2} />
        </View>
        
        <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
          {title}
        </Text>
        
        <Text style={styles.description} numberOfLines={3} ellipsizeMode="tail">
          {description}
        </Text>
        
        <View style={[styles.cardAccent, { backgroundColor: accentColor }]} />
      </Animated.View>
    </Pressable>
  );
};

const theme = {
  colors: {
    white: '#ffffff',
    textPrimary: '#0f172a',
    textSecondary: '#64748b',
    border: '#e2e8f0',
    shadow: 'rgba(0, 0, 0, 0.06)',
  },
  spacing: {
    xxs: 4,
    xs: 8,
    sm: 12,
    md: 16,
    lg: 24,
  },
  borderRadius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
  },
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.white,
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.lg - theme.spacing.xxs,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    position: 'relative',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  iconContainer: {
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.md,
    alignSelf: 'flex-start',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
    letterSpacing: 0.2,
  },
  description: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
  },
  cardAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: 4,
  },
});

export default FeatureCard;