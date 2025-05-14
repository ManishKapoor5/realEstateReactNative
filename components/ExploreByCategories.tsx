import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Building, Home, MapPin, Tag } from 'lucide-react-native';

// Extend LucideProps to include color explicitly
interface ExtendedLucideProps {
  size?: number;
  color?: string;
}

interface Category {
  title: string;
  description: string;
  icon: React.ReactNode;
  properties: number;
  color: string;
}

const categories: Category[] = [
  {
    title: 'Luxury Homes',
    description: 'Exclusive properties for premium living experience',
    icon: <Home size={32} color="#000" {...({} as ExtendedLucideProps)} />,
    properties: 245,
    color: '#D1FAE5',
  },
  {
    title: 'Ready to Move',
    description: 'Properties available for immediate possession',
    icon: <Building size={32} color="#000" {...({} as ExtendedLucideProps)} />,
    properties: 1245,
    color: '#DBEAFE',
  },
  {
    title: 'Budget Homes',
    description: 'Affordable options without compromising on quality',
    icon: <Tag size={32} color="#000" {...({} as ExtendedLucideProps)} />,
    properties: 845,
    color: '#FEEBC8',
  },
  {
    title: 'Premium Locations',
    description: 'Properties in the most sought-after neighborhoods',
    icon: <MapPin size={32} color="#000" {...({} as ExtendedLucideProps)} />,
    properties: 567,
    color: '#EDE9FE',
  },
];

const ExploreByCategories: React.FC = () => {
  const renderCategory = ({ item }: { item: Category }) => (
    <Card style={[styles.card, { shadowOpacity: 0.1, shadowRadius: 4 }]}>
      <CardHeader style={[styles.cardHeader, { backgroundColor: item.color }]}>
        <View style={styles.iconContainer}>
          {item.icon}
        </View>
        <CardTitle style={styles.cardTitle}>{item.title}</CardTitle>
        <CardDescription style={styles.cardDescription}>
          {item.description}
        </CardDescription>
      </CardHeader>
      <CardContent style={styles.cardContent}>
        <Text style={styles.propertiesText}>
          {item.properties} properties available
        </Text>
        
      </CardContent>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Explore by Categories</Text>
        <Text style={styles.subtitle}>
          Find the perfect property based on your specific requirements
        </Text>
      </View>
      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 48,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    maxWidth: 320,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  listContent: {
    paddingBottom: 16,
  },
  card: {
    flex: 1,
    margin: 8,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    elevation: 2,
  },
  cardHeader: {
    padding: 24,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  cardDescription: {
    fontSize: 14,
    color: '#4B5563',
  },
  cardContent: {
    padding: 24,
    paddingTop: 16,
  },
  propertiesText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  button: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
});

export default ExploreByCategories;