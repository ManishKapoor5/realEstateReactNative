import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Dimensions,
  useWindowDimensions,
  Platform,
  SafeAreaView
} from 'react-native';
import { Badge } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface Location {
  name: string;
  count: number;
  trending?: boolean;
}

const topLocations: Location[] = [
  { name: "Mumbai", count: 12450, trending: true },
  { name: "Delhi NCR", count: 15320, trending: true },
  { name: "Bangalore", count: 9845, trending: true },
  { name: "Pune", count: 7623 },
  { name: "Hyderabad", count: 6890, trending: true },
  { name: "Chennai", count: 5487 },
  { name: "Kolkata", count: 4320 },
  { name: "Ahmedabad", count: 3698 },
];

const LocationList: React.FC = () => {
  const { width } = useWindowDimensions();
  const [numColumns, setNumColumns] = useState(2);
  
  // Determine columns based on screen width
  useEffect(() => {
    // Small phones use 1 column, larger phones use 2
    setNumColumns(width < 350 ? 1 : 2);
  }, [width]);

  const renderItem = ({ item, index }: { item: Location; index: number }) => (
    <TouchableOpacity
      key={index}
      style={[
        styles.card,
        numColumns === 1 ? styles.fullWidthCard : styles.halfWidthCard
      ]}
      activeOpacity={0.8}
    >
      <View style={styles.cardContent}>
        <View style={styles.iconContainer}>
          <Icon name="location-pin" size={20} color="#3B82F6" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.locationName} numberOfLines={1} ellipsizeMode="tail">
            {item.name}
          </Text>
          <Text style={styles.propertyCount}>{item.count} properties</Text>
        </View>
        {item.trending && (
          <Badge
            value="Trending"
            badgeStyle={styles.badge}
            textStyle={styles.badgeText}
            containerStyle={styles.badgeContainer}
          />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Top Locations in India</Text>
          <Text style={styles.subtitle}>Explore properties across the most popular cities</Text>
        </View>
        <FlatList
          data={topLocations}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          numColumns={numColumns}
          key={numColumns.toString()} // Force re-render on column change
          columnWrapperStyle={numColumns > 1 ? styles.columnWrapper : undefined}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingVertical: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 16,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    margin: 6,
    padding: 12,
  },
  fullWidthCard: {
    width: '95%',
    alignSelf: 'center',
  },
  halfWidthCard: {
    flex: 0.5,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  locationName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
  },
  propertyCount: {
    fontSize: 13,
    color: '#6B7280',
  },
  badgeContainer: {
    marginLeft: 6,
  },
  badge: {
    backgroundColor: '#ECFDF5',
    borderColor: '#BBF7D0',
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {
    color: '#15803D',
    fontSize: 11,
  },
});

export default LocationList;