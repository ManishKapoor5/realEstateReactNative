import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { useAuthStore } from '../store/authStore';

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigation = useNavigation<any>();
  const { isAuthenticated, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigation.navigate('Home');
  };

  return (
    <View style={styles.header}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.logoContainer}
          onPress={() => navigation.navigate('Home')}
        >
          <Icon name="home" size={32} color="#2563EB" />
          <Text style={styles.logoText}>Legacy Land Real Estate</Text>
        </TouchableOpacity>

        <View style={styles.actions}>
          {isAuthenticated ? (
            <TouchableOpacity
              style={styles.desktopButton}
              onPress={handleLogout}
            >
              <Icon name="log-out" size={16} color="#111827" />
              <Text style={styles.desktopButtonText}>Logout</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.desktopButton}
              onPress={() => navigation.navigate('Login')}
            >
              <Icon name="user" size={16} color="#111827" />
              <Text style={styles.desktopButtonText}>Login</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.mobileMenuButton}
            onPress={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Icon name="menu" size={24} color="#111827" />
          </TouchableOpacity>
        </View>
      </View>

      {mobileMenuOpen && (
        <View style={styles.mobileMenu}>
          {isAuthenticated ? (
            <MobileNavItem
              title="Logout"
              icon={<Icon name="log-out" size={18} color="#111827" />}
              onClick={handleLogout}
            />
          ) : (
            <MobileNavItem
              title="Login"
              icon={<Icon name="user" size={18} color="#111827" />}
              onClick={() => navigation.navigate('Login')}
            />
          )}
        </View>
      )}
    </View>
  );
};

const MobileNavItem: React.FC<{
  title: string;
  icon?: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}> = ({ title, icon, active = false, onClick }) => (
  <TouchableOpacity
    style={[styles.mobileNavItem, active ? styles.mobileNavItemActive : null]}
    onPress={onClick}
  >
    {icon && <View style={styles.mobileNavIcon}>{icon}</View>}
    <Text
      style={[
        styles.mobileNavText,
        active ? styles.mobileNavTextActive : null,
      ]}
    >
      {title}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 64,
    paddingHorizontal: 16,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    marginLeft: 8,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  desktopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    display: 'none', // Hidden on mobile, shown on larger screens via media queries or logic
  },
  desktopButtonText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
  mobileMenuButton: {
    padding: 8,
  },
  mobileMenu: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
  },
  mobileNavItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  mobileNavItemActive: {
    backgroundColor: '#F3F4F6',
  },
  mobileNavIcon: {
    marginRight: 8,
  },
  mobileNavText: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  mobileNavTextActive: {
    color: '#2563EB',
  },
});

export default Header;