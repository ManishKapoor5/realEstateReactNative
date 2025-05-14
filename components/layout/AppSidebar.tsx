import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Building, LayoutDashboard, PersonStanding, Settings, Users } from 'lucide-react-native';

// Define navigation param list
type RootStackParamList = {
  Dashboard: undefined;
  Properties: undefined;
  Users: undefined;
  BuyerTierLimit: undefined;
  Settings: undefined;
};

// Define navigation prop type
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface MenuItem {
  title: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  id: keyof RootStackParamList;
}

const menuItems: MenuItem[] = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    id: 'Dashboard',
  },
  {
    title: 'Properties',
    icon: Building,
    id: 'Properties',
  },
  {
    title: 'Users & Agents',
    icon: Users,
    id: 'Users',
  },
  {
    title: 'Buyer Tier limits',
    icon: PersonStanding,
    id: 'BuyerTierLimit',
  },
  {
    title: 'Settings',
    icon: Settings,
    id: 'Settings',
  },
];

const AppSidebar: React.FC = () => {
  const [activeItem, setActiveItem] = useState<keyof RootStackParamList>('Dashboard');
  const navigation = useNavigation<NavigationProp>();

  const handleNavigation = (id: keyof RootStackParamList) => {
    setActiveItem(id);
    navigation.navigate(id);
  };

  return (
    <View style={styles.sidebar}>
      {/* Sidebar Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Legacy Land</Text>
      </View>

      {/* Sidebar Content */}
      <View style={styles.content}>
        <View style={styles.group}>
          <Text style={styles.groupLabel}>Menu</Text>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.menuItem, activeItem === item.id && styles.menuItemActive]}
              onPress={() => handleNavigation(item.id)}
            >
              <item.icon size={24} color={activeItem === item.id ? '#ffffff' : '#4B5563'} />
              <Text
                style={[
                  styles.menuItemText,
                  activeItem === item.id && styles.menuItemTextActive,
                ]}
              >
                {item.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Sidebar Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2025 Legacy Land</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
    width: 250,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  group: {
    marginBottom: 24,
  },
  groupLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
    fontWeight: '600',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  menuItemActive: {
    backgroundColor: '#3B82F6',
  },
  menuItemText: {
    fontSize: 16,
    color: '#4B5563',
    marginLeft: 12,
  },
  menuItemTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#6B7280',
  },
});

export default AppSidebar;