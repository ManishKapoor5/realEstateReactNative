import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import Header from '../components/Header'
import Footer from '../components/Footer'; // Assuming React Native version

// Define Property interface
interface Property {
  id: number;
  title: string;
  description: string;
  location: string;
  price: string;
  pricePerSqFt: string;
  size: string;
  bedrooms: number;
  bathrooms: number;
  propertyType: string;
  images: string[];
  features: string[];
  postedOn: string;
  furnishing: string;
  facing: string;
  floorNo: string;
  carParking: string;
  ownerName: string;
  ownerType: string;
  agencyName: string;
  yearBuilt: number;
  isVerified: boolean;
}

const property: Property = {
  id: 1,
  title: '3 BHK Apartment in DLF Phase 5',
  description:
    'Luxurious 3 BHK apartment with modern amenities in a prime location. The apartment offers spacious rooms with abundant natural light, high-quality fittings, and a beautiful view of the surrounding area. Perfect for families looking for a comfortable living space in a vibrant neighborhood.',
  location: 'DLF Phase 5, Gurugram, Haryana',
  price: '₹1.45 Cr',
  pricePerSqFt: '7,250',
  size: '2000 sq.ft',
  bedrooms: 3,
  bathrooms: 2,
  propertyType: 'Apartment',
  images: [
    'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80',
    'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80',
    'https://images.unsplash.com/photo-1493962853295-0fd70327578a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80',
    'https://images.unsplash.com/photo-1498936178812-4b2e558d2937?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80',
  ],
  features: [
    'Modular Kitchen',
    '24/7 Security',
    'Power Backup',
    'Swimming Pool',
    'Gym',
    "Children's Play Area",
    'Covered Parking',
    'Visitor Parking',
    'Clubhouse',
    'Landscaped Gardens',
  ],
  postedOn: '2 weeks ago',
  furnishing: 'Semi-Furnished',
  facing: 'East',
  floorNo: '8 (Out of 14)',
  carParking: '2 Covered',
  ownerName: 'Rahul Sharma',
  ownerType: 'Individual',
  agencyName: 'Legacy Land Properties',
  yearBuilt: 2020,
  isVerified: true,
};

const PropertyDetails: React.FC = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [liked, setLiked] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'features'>('overview');
  const navigation = useNavigation<any>();
  const { width } = Dimensions.get('window');
  const isLargeScreen = width >= 768;

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.main}>
        <View style={styles.content}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate('PropertyListings')}
          >
            <Icon name="arrow-left" size={16} color="#111827" />
            <Text style={styles.backButtonText}>Back to Listings</Text>
          </TouchableOpacity>

          <View style={[styles.grid, isLargeScreen ? styles.gridLarge : null]}>
            {/* Main Property Section */}
            <View style={[styles.mainSection, isLargeScreen ? styles.mainSectionLarge : null]}>
              <View style={styles.card}>
                {/* Image Carousel */}
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: property.images[currentImage] }}
                    style={styles.mainImage}
                    resizeMode="cover"
                  />
                  <TouchableOpacity
                    style={styles.likeButton}
                    onPress={() => setLiked(!liked)}
                  >
                    <Icon
                      name="heart"
                      size={20}
                      color={liked ? '#EF4444' : '#6B7280'}
                      style={liked ? styles.likedIcon : null}
                    />
                  </TouchableOpacity>
                  <FlatList
                    data={property.images}
                    renderItem={({ item, index }) => (
                      <TouchableOpacity
                        style={[
                          styles.thumbnailContainer,
                          currentImage === index ? styles.thumbnailActive : null,
                        ]}
                        onPress={() => setCurrentImage(index)}
                      >
                        <Image
                          source={{ uri: item }}
                          style={styles.thumbnail}
                          resizeMode="cover"
                        />
                      </TouchableOpacity>
                    )}
                    keyExtractor={(_, index) => index.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.thumbnailList}
                  />
                </View>

                {/* Property Info */}
                <View style={styles.cardContent}>
                  <View style={styles.header}>
                    <View>
                      <Text style={styles.title}>{property.title}</Text>
                      <View style={styles.location}>
                        <Icon name="map-pin" size={16} color="#6B7280" />
                        <Text style={styles.locationText}>{property.location}</Text>
                      </View>
                    </View>
                    <View style={styles.priceContainer}>
                      <Text style={styles.price}>{property.price}</Text>
                      <Text style={styles.pricePerSqFt}>
                        ₹{property.pricePerSqFt}/sq.ft
                      </Text>
                    </View>
                  </View>

                  {/* Quick Info */}
                  <View style={styles.quickInfo}>
                    <View style={styles.infoItem}>
                      <Icon name="external-link" size={20} color="#6B7280" />
                      <View>
                        <Text style={styles.infoValue}>{property.bedrooms}</Text>
                        <Text style={styles.infoLabel}>Bedrooms</Text>
                      </View>
                    </View>
                    <View style={styles.infoItem}>
                      <Icon name="external-link" size={20} color="#6B7280" />
                      <View>
                        <Text style={styles.infoValue}>{property.bathrooms}</Text>
                        <Text style={styles.infoLabel}>Bathrooms</Text>
                      </View>
                    </View>
                    <View style={styles.infoItem}>
                      <Icon name="external-link" size={20} color="#6B7280" />
                      <View>
                        <Text style={styles.infoValue}>{property.size}</Text>
                        <Text style={styles.infoLabel}>Built-up Area</Text>
                      </View>
                    </View>
                    <View style={styles.infoItem}>
                      <Icon name="home" size={20} color="#6B7280" />
                      <View>
                        <Text style={styles.infoValue}>{property.propertyType}</Text>
                        <Text style={styles.infoLabel}>Property Type</Text>
                      </View>
                    </View>
                  </View>

                  {/* Tabs */}
                  <View style={styles.tabList}>
                    <TouchableOpacity
                      style={[
                        styles.tab,
                        activeTab === 'overview' ? styles.tabActive : null,
                      ]}
                      onPress={() => setActiveTab('overview')}
                    >
                      <Text
                        style={[
                          styles.tabText,
                          activeTab === 'overview' ? styles.tabTextActive : null,
                        ]}
                      >
                        Overview
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.tab,
                        activeTab === 'details' ? styles.tabActive : null,
                      ]}
                      onPress={() => setActiveTab('details')}
                    >
                      <Text
                        style={[
                          styles.tabText,
                          activeTab === 'details' ? styles.tabTextActive : null,
                        ]}
                      >
                        Details
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.tab,
                        activeTab === 'features' ? styles.tabActive : null,
                      ]}
                      onPress={() => setActiveTab('features')}
                    >
                      <Text
                        style={[
                          styles.tabText,
                          activeTab === 'features' ? styles.tabTextActive : null,
                        ]}
                      >
                        Features
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Tab Content */}
                  {activeTab === 'overview' && (
                    <View style={styles.tabContent}>
                      <Text style={styles.sectionTitle}>Description</Text>
                      <Text style={styles.description}>{property.description}</Text>
                      <Text style={[styles.sectionTitle, styles.sectionTitleMargin]}>
                        Key Details
                      </Text>
                      <View style={styles.keyDetails}>
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>Property Type:</Text>
                          <Text style={styles.detailValue}>{property.propertyType}</Text>
                        </View>
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>Furnishing:</Text>
                          <Text style={styles.detailValue}>{property.furnishing}</Text>
                        </View>
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>Floor:</Text>
                          <Text style={styles.detailValue}>{property.floorNo}</Text>
                        </View>
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>Facing:</Text>
                          <Text style={styles.detailValue}>{property.facing}</Text>
                        </View>
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>Car Parking:</Text>
                          <Text style={styles.detailValue}>{property.carParking}</Text>
                        </View>
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>Year Built:</Text>
                          <Text style={styles.detailValue}>{property.yearBuilt}</Text>
                        </View>
                      </View>
                    </View>
                  )}
                  {activeTab === 'details' && (
                    <View style={styles.tabContent}>
                      <Text style={styles.sectionTitle}>Property Details</Text>
                      <View style={styles.detailsSection}>
                        <View style={styles.detailColumn}>
                          <Text style={styles.detailSubtitle}>Rooms</Text>
                          <Text style={styles.detailText}>Bedrooms: {property.bedrooms}</Text>
                          <Text style={styles.detailText}>Bathrooms: {property.bathrooms}</Text>
                          <Text style={styles.detailText}>Balconies: 2</Text>
                          <Text style={styles.detailText}>Living Room: 1</Text>
                          <Text style={styles.detailText}>Kitchen: 1</Text>
                        </View>
                        <View style={styles.detailColumn}>
                          <Text style={styles.detailSubtitle}>Area Details</Text>
                          <Text style={styles.detailText}>Super Built-up Area: 2200 sq.ft</Text>
                          <Text style={styles.detailText}>Built-up Area: {property.size}</Text>
                          <Text style={styles.detailText}>Carpet Area: 1800 sq.ft</Text>
                        </View>
                      </View>
                      <View style={styles.additionalInfo}>
                        <Text style={styles.detailSubtitle}>Additional Information</Text>
                        <Text style={styles.detailText}>
                          Water Supply: 24/7 Municipal + Borewell
                        </Text>
                        <Text style={styles.detailText}>
                          Status of Electricity: No/Rare Power Cut
                        </Text>
                        <Text style={styles.detailText}>
                          Status of Water Seepage: No Seepage
                        </Text>
                      </View>
                    </View>
                  )}
                  {activeTab === 'features' && (
                    <View style={styles.tabContent}>
                      <Text style={styles.sectionTitle}>Features & Amenities</Text>
                      <View style={styles.featuresGrid}>
                        {property.features.map((feature, index) => (
                          <View key={index} style={styles.featureItem}>
                            <Icon name="check" size={16} color="#22C55E" />
                            <Text style={styles.featureText}>{feature}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}
                </View>
              </View>
            </View>

            {/* Sidebar Section */}
            <View style={[styles.sidebar, isLargeScreen ? styles.sidebarLarge : null]}>
              {/* Contact Owner */}
              <View style={styles.card}>
                <View style={styles.cardContent}>
                  <View style={styles.contactHeader}>
                    {property.isVerified && (
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>Verified Owner</Text>
                      </View>
                    )}
                    <Text style={styles.cardTitle}>Contact Owner</Text>
                    <Text style={styles.cardSubtitle}>
                      {property.ownerName} • {property.ownerType}
                    </Text>
                  </View>
                  <TouchableOpacity style={styles.actionButton}>
                    <Icon name="phone" size={16} color="#FFFFFF" />
                    <Text style={styles.actionButtonText}>View Phone Number</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.actionButton, styles.actionButtonOutline]}>
                    <Icon name="message-square" size={16} color="#2563EB" />
                    <Text style={[styles.actionButtonText, styles.actionButtonTextOutline]}>
                      Send Message
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Property Overview */}
              <View style={styles.card}>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>Property Overview</Text>
                  <View style={styles.overviewItem}>
                    <Text style={styles.overviewLabel}>Posted on</Text>
                    <View style={styles.overviewValue}>
                      <Icon name="calendar" size={14} color="#111827" />
                      <Text style={styles.overviewValueText}>{property.postedOn}</Text>
                    </View>
                  </View>
                  <View style={styles.overviewItem}>
                    <Text style={styles.overviewLabel}>Property ID</Text>
                    <Text style={styles.overviewValueText}>LL{property.id}82932</Text>
                  </View>
                  <View style={styles.overviewItem}>
                    <Text style={styles.overviewLabel}>Listed by</Text>
                    <Text style={styles.overviewValueText}>{property.agencyName}</Text>
                  </View>
                  <View style={styles.overviewButtons}>
                    <TouchableOpacity
                      style={[styles.overviewButton, styles.overviewButtonOutline]}
                    >
                      <Icon name="share" size={14} color="#111827" />
                      <Text style={styles.overviewButtonText}>Share</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.overviewButton, styles.overviewButtonOutline]}
                    >
                      <Icon name="heart" size={14} color="#111827" />
                      <Text style={styles.overviewButtonText}>Favorite</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Similar Properties */}
              <View style={styles.card}>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>Similar Properties</Text>
                  {Array.from({ length: 3 }).map((_, index) => (
                    <View key={index} style={styles.similarProperty}>
                      <Image
                        source={{
                          uri: `https://images.unsplash.com/photo-148779234325-4df${index + 1}900750${index + 1}?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80`,
                        }}
                        style={styles.similarImage}
                        resizeMode="cover"
                      />
                      <View style={styles.similarInfo}>
                        <Text style={styles.similarTitle}>
                          {index + 2} BHK Apartment in DLF Phase {index + 1}
                        </Text>
                        <Text style={styles.similarPrice}>
                          ₹{((index + 1) * 0.5 + 1).toFixed(2)} Cr
                        </Text>
                        <Text style={styles.similarLocation}>Gurugram, Haryana</Text>
                      </View>
                    </View>
                  ))}
                  <TouchableOpacity
                    style={[styles.actionButton, styles.actionButtonOutline, styles.viewMoreButton]}
                  >
                    <Text
                      style={[styles.actionButtonText, styles.actionButtonTextOutline]}
                    >
                      View More
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  main: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  content: {
    maxWidth: 1200,
    alignSelf: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#111827',
    marginLeft: 8,
  },
  grid: {
    flexDirection: 'column',
  },
  gridLarge: {
    flexDirection: 'row',
  },
  mainSection: {
    flex: 1,
    marginBottom: 24,
  },
  mainSectionLarge: {
    flex: 2,
    marginRight: 24,
  },
  sidebar: {
    flex: 1,
  },
  sidebarLarge: {
    flex: 1,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
    marginBottom: 16,
  },
  imageContainer: {
    position: 'relative',
  },
  mainImage: {
    width: '100%',
    height: 300,
  },
  likeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 8,
  },
  likedIcon: {
    // No equivalent for fill-current in React Native; color change handles it
  },
  thumbnailList: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  thumbnailContainer: {
    width: 64,
    height: 64,
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  thumbnailActive: {
    borderColor: '#2563EB',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  cardContent: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  locationText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  pricePerSqFt: {
    fontSize: 12,
    color: '#6B7280',
  },
  quickInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
    marginBottom: 12,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  infoLabel: {
    fontSize: 10,
    color: '#6B7280',
  },
  tabList: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginRight: 8,
  },
  tabActive: {
    backgroundColor: '#2563EB',
  },
  tabText: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  tabContent: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 8,
  },
  sectionTitleMargin: {
    marginTop: 16,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
  },
  keyDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  detailRow: {
    flexDirection: 'row',
    width: '50%',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
    width: 100,
  },
  detailValue: {
    fontSize: 14,
    color: '#111827',
  },
  detailsSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  detailColumn: {
    flex: 1,
    minWidth: 150,
    marginBottom: 16,
  },
  detailSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#111827',
    marginBottom: 4,
  },
  additionalInfo: {
    marginTop: 16,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#111827',
    marginLeft: 8,
  },
  contactHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  badge: {
    backgroundColor: '#3B82F6',
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  actionButton: {
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  actionButtonOutline: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#2563EB',
  },
  actionButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
    marginLeft: 8,
  },
  actionButtonTextOutline: {
    color: '#2563EB',
  },
  viewMoreButton: {
    marginTop: 16,
  },
  overviewItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  overviewLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  overviewValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  overviewValueText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginLeft: 4,
  },
  overviewButtons: {
    flexDirection: 'row',
    marginTop: 16,
  },
  overviewButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 6,
  },
  overviewButtonOutline: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  overviewButtonText: {
    fontSize: 12,
    color: '#111827',
    marginLeft: 4,
  },
  similarProperty: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  similarImage: {
    width: 80,
    height: 80,
    borderRadius: 4,
    marginRight: 12,
  },
  similarInfo: {
    flex: 1,
  },
  similarTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  similarPrice: {
    fontSize: 12,
    fontWeight: '500',
    color: '#2563EB',
    marginBottom: 4,
  },
  similarLocation: {
    fontSize: 10,
    color: '#6B7280',
  },
});

export default PropertyDetails;