// src/navigation/ProtectedRoute.tsx
import React from 'react';
import { useAuthStore } from '../store/authStore';
import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';

interface ProtectedRouteProps {
  children: React.ReactElement;
  allowedRoles?: string[];
  fallbackRoute?: string;
  unauthorizedRoute?: string;
}

/**
 * A wrapper component that protects routes/screens based on authentication and role permissions
 * 
 * @param children - The screen component to render if authorized
 * @param allowedRoles - Optional array of roles that are allowed to access this route
 * @param fallbackRoute - Route to navigate to if user is not authenticated (defaults to 'Login')
 * @param unauthorizedRoute - Route to navigate to if user doesn't have required role (defaults to 'Home')
 */
const ProtectedRoute = ({
  children,
  allowedRoles,
  fallbackRoute = 'Login',
  unauthorizedRoute = 'Home',
}: ProtectedRouteProps) => {
  const { user } = useAuthStore();
  const navigation = useNavigation<NavigationProp<ParamListBase>>();

  React.useEffect(() => {
    // If user is not authenticated, redirect to login
    if (!user) {
      navigation.navigate(fallbackRoute);
      return;
    }

    // If roles are specified, check if user has required role
    if (allowedRoles && allowedRoles.length > 0) {
      const userRole = user.role?.toLowerCase() || '';
      const hasPermission = allowedRoles.some(
        role => role.toLowerCase() === userRole
      );

      console.log(
        `Role check: User role: ${userRole}, Allowed roles: ${allowedRoles.join(', ')}, ` +
        `Has permission: ${hasPermission}`
      );

      // If user doesn't have required role, redirect to unauthorized or home
      if (!hasPermission) {
        navigation.navigate(unauthorizedRoute);
      }
    }
  }, [user, allowedRoles, navigation, fallbackRoute, unauthorizedRoute]);

  // If user is authenticated and has required role (or no role required)
  // then render children only if checks pass
  if (
    !user || 
    (allowedRoles && allowedRoles.length > 0 && 
     !(user.role && allowedRoles.some(role => role.toLowerCase() === user.role?.toLowerCase())))
  ) {
    // Return null while navigation is happening
    return null;
  }

  return children;
};

export default ProtectedRoute;