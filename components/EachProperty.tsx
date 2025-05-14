import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import axiosInstance from '../services/axiosInstance';
import axios from 'axios';
//import { Property } from '../types';

interface Property {
  _id: string;
  title: string;
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    latitude: number;
    longitude: number;
  };
  price: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  size: string;
  images: string | string[];
  status: string;
  features: {
    parking: boolean;
    furnished: boolean;
    bedrooms: number;
    bathrooms: number;
    area?: number;
  };
  propertyType: string;
  type: string;
  owner: {
    name: string;
    email: string;
    contact: string;
  };
  description: string;
  isNew?: boolean;
  isVerified?: boolean;
}

const EachPropertyDetails: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { id } = route.params || {};
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://realestatesite-backend.onrender.com/api/v1/Property/getby/${id}`);
        const data = response.data;

        if (!data.success || !data.property) {
          throw new Error('Property not found or invalid response');
        }

        const apiProperty = data.property;

        const formattedProperty: Property = {
          _id: apiProperty._id || '',
          title: apiProperty.title || '',
          location: {
            address: apiProperty.location?.address || '',
            city: apiProperty.location?.city || '',
            state: apiProperty.location?.state || '',
            country: apiProperty.location?.country || '',
            postalCode: apiProperty.location?.postalCode || '',
            latitude: apiProperty.geo?.coordinates?.[0] || 0,
            longitude: apiProperty.geo?.coordinates?.[1] || 0,
          },
          price: apiProperty.price?.toString() || '0',
          bedrooms: apiProperty.features?.bedrooms || 0,
          bathrooms: apiProperty.features?.bathrooms || 0,
          area: apiProperty.area || apiProperty.size || apiProperty.features?.area?.toString() || '0',
          size: apiProperty.size || apiProperty.area || apiProperty.features?.area?.toString() || '0',
          images: Array.isArray(apiProperty.images) ? apiProperty.images : apiProperty.images ? [apiProperty.images] : [],
          status: apiProperty.status || '',
          features: {
            parking: apiProperty.features?.parking || false,
            furnished: apiProperty.features?.furnished || false,
            bedrooms: apiProperty.features?.bedrooms || 0,
            bathrooms: apiProperty.features?.bathrooms || 0,
            area: apiProperty.features?.area || 0,
          },
          propertyType: apiProperty.type || '',
          type: apiProperty.type || '',
          owner: {
            name: apiProperty.owner?.name || '',
            email: apiProperty.owner?.email || '',
            contact: apiProperty.owner?.contact || '',
          },
          description: apiProperty.description || '',
          isNew: apiProperty.isNew || false,
          isVerified: apiProperty.isVerified || false,
        };

        setProperty(formattedProperty);
        setError(null);
      } catch (err) {
        console.error('Error fetching property:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch property details');
        setProperty(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const getPropertyImages = (property: Property): string[] => {
    if (!property.images) return [];
    if (typeof property.images === 'string') return [property.images];
    return property.images;
  };

  const nextImage = () => {
    if (!property) return;
    const images = getPropertyImages(property);
    if (images.length <= 1) return;
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    if (!property) return;
    const images = getPropertyImages(property);
    if (images.length <= 1) return;
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const maskEmail = (email: string) => {
    const [username, domain] = email.split('@');
    if (!username || !domain) return '***@***';
    return `${username.substring(0, 2)}***@${domain}`;
  };

  const maskPhone = (phone: string) => {
    if (!phone || phone.length < 6) return '******';
    return `${phone.substring(0, 2)}****${phone.substring(phone.length - 2)}`;
  };

  const handleContactClick = () => {
    navigation.navigate('Login', {
      from: `EachPropertyDetails/${id}`,
      message: 'Please login to view contact details',
    });
  };

  const placeholderImage = 'https://via.placeholder.com/600x400';

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Loading property details...</Text>
      </View>
    );
  }

  if (error || !property) {
    return (
      <View style={styles.errorContainer}>
        <View style={styles.errorCard}>
          <Text style={styles.errorTitle}>Unable to load property</Text>
          <Text style={styles.errorText}>{error || 'Property not found'}</Text>
          <TouchableOpacity
            style={styles.errorButton}
            onPress={() => navigation.navigate('AgentDashboard')}
          >
            <Text style={styles.errorButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('AgentDashboard')}
        >
          <Feather name="chevron-left" size={20} color="#2563EB" />
          <Text style={styles.backText}>Back to Properties</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Image Section */}
        <View style={styles.imageCard}>
          <View style={styles.mainImageContainer}>
            {getPropertyImages(property).length > 0 ? (
              <>
                <Image
                  source={{ uri: getPropertyImages(property)[currentImageIndex] || placeholderImage }}
                  style={styles.mainImage}
                  resizeMode="cover"
                  onError={() => console.log('Image load error')}
                />
                {getPropertyImages(property).length > 1 && (
                  <>
                    <TouchableOpacity style={styles.prevButton} onPress={prevImage}>
                      <Feather name="chevron-left" size={24} color="#374151" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.nextButton} onPress={nextImage}>
                      <Feather name="chevron-right" size={24} color="#374151" />
                    </TouchableOpacity>
                  </>
                )}
              </>
            ) : (
              <View style={styles.noImageContainer}>
                <Text style={styles.noImageText}>No images available</Text>
              </View>
            )}
          </View>
          {getPropertyImages(property).length > 1 && (
            <View style={styles.thumbnailContainer}>
              {getPropertyImages(property).map((image, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.thumbnail,
                    currentImageIndex === index && styles.activeThumbnail,
                  ]}
                  onPress={() => setCurrentImageIndex(index)}
                >
                  <Image
                    source={{ uri: image || placeholderImage }}
                    style={styles.thumbnailImage}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Price and Title Section */}
        <View style={styles.priceCard}>
          <Text style={styles.propertyTitle}>{property.title}</Text>
          <View style={styles.locationContainer}>
            <MaterialIcons name="location-pin" size={16} color="#6B7280" />
            <Text style={styles.locationText}>
              {property.location.city}, {property.location.state}
            </Text>
          </View>
          <Text style={styles.priceText}>
            ₹{parseFloat(property.price).toLocaleString('en-IN')}
          </Text>
          <View style={styles.badgesContainer}>
            {property.isVerified && (
              <View style={styles.badgeVerified}>
                <Text style={styles.badgeText}>Verified</Text>
              </View>
            )}
            {property.isNew && (
              <View style={styles.badgeNew}>
                <Text style={styles.badgeText}>New</Text>
              </View>
            )}
          </View>
        </View>

        {/* Property Details Section */}
        <View style={styles.detailsCard}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="home" size={20} color="#2563EB" />
            <Text style={styles.sectionTitle}>Property Details</Text>
          </View>
          <View style={styles.detailsGrid}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Property Type:</Text>
              <Text style={styles.detailValue}>{property.propertyType || 'Residential'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Status:</Text>
              <View
                style={[
                  styles.statusBadge,
                  property.status === 'For Sale'
                    ? styles.statusSale
                    : property.status === 'For Rent'
                    ? styles.statusRent
                    : styles.statusOther,
                ]}
              >
                <Text style={styles.statusText}>{property.status || 'Available'}</Text>
              </View>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Area:</Text>
              <View style={styles.detailValueContainer}>
                <MaterialIcons name="square-foot" size={16} color="#2563EB" />
                <Text style={styles.detailValue}>{property.features.area} sq.ft</Text>
              </View>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Bedrooms:</Text>
              <View style={styles.detailValueContainer}>
                <MaterialIcons name="bed" size={16} color="#2563EB" />
                <Text style={styles.detailValue}>{property.bedrooms}</Text>
              </View>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Bathrooms:</Text>
              <View style={styles.detailValueContainer}>
                <MaterialIcons name="bathtub" size={16} color="#2563EB" />
                <Text style={styles.detailValue}>{property.bathrooms}</Text>
              </View>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Parking:</Text>
              <View style={styles.detailValueContainer}>
                <MaterialIcons name="directions-car" size={16} color="#2563EB" />
                <Text style={styles.detailValue}>
                  {property.features.parking ? 'Available' : 'Not Available'}
                </Text>
              </View>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Furnished:</Text>
              <View style={styles.detailValueContainer}>
                <MaterialIcons name="coffee" size={16} color="#2563EB" />
                <Text style={styles.detailValue}>{property.features.furnished ? 'Yes' : 'No'}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Description Section */}
        <View style={styles.descriptionCard}>
          <Text style={styles.sectionTitle}>Description</Text>
          {property.description.split('\n').map((paragraph, index) => (
            <Text key={index} style={styles.descriptionText}>
              {paragraph}
            </Text>
          ))}
        </View>

        {/* Location Section */}
        <View style={styles.locationCard}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="location-pin" size={20} color="#2563EB" />
            <Text style={styles.sectionTitle}>Location</Text>
          </View>
          <Text style={styles.locationDetail}>{property.location.address}</Text>
          <Text style={styles.locationDetail}>
            {property.location.city}, {property.location.state} {property.location.postalCode}
          </Text>
          <Text style={styles.locationDetail}>{property.location.country}</Text>
          <View style={styles.mapPlaceholder}>
            <Text style={styles.mapPlaceholderText}>Map view would be shown here</Text>
          </View>
        </View>

        {/* Contact Section */}
        <View style={styles.contactCard}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.contactInfo}>
            <Text style={styles.ownerName}>{property.owner.name}</Text>
            <TouchableOpacity style={styles.contactButton} onPress={handleContactClick}>
              <MaterialIcons name="phone" size={20} color="#2563EB" />
              <Text style={styles.contactText}>{maskPhone(property.owner.contact)}</Text>
              <MaterialIcons name="lock" size={16} color="#6B7280" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactButton} onPress={handleContactClick}>
              <MaterialIcons name="email" size={20} color="#2563EB" />
              <Text style={styles.contactText}>{maskEmail(property.owner.email)}</Text>
              <MaterialIcons name="lock" size={16} color="#6B7280" />
            </TouchableOpacity>
            <Text style={styles.contactNote}>
              <MaterialIcons name="lock" size={12} color="#6B7280" /> Login required to view full contact details
            </Text>
          </View>
          <TouchableOpacity style={styles.ctaButton} onPress={handleContactClick}>
            <Text style={styles.ctaButtonText}>View Contact Details</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.returnButton}
            onPress={() => navigation.navigate('AgentDashboard')}
          >
            <Text style={styles.returnButtonText}>Return to property listings</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: 16,
    color: '#2563EB',
    fontWeight: '500',
  },
  content: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    fontSize: 18,
    color: '#6B7280',
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 16,
  },
  errorCard: {
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#DC2626',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#DC2626',
    textAlign: 'center',
    marginBottom: 16,
  },
  errorButton: {
    backgroundColor: '#FEE2E2',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  errorButtonText: {
    fontSize: 16,
    color: '#DC2626',
    fontWeight: '600',
  },
  imageCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  mainImageContainer: {
    height: 384,
    backgroundColor: '#E5E7EB',
    position: 'relative',
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  noImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E5E7EB',
  },
  noImageText: {
    fontSize: 16,
    color: '#6B7280',
  },
  prevButton: {
    position: 'absolute',
    left: 16,
    top: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  nextButton: {
    position: 'absolute',
    right: 16,
    top: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  thumbnailContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#F9FAFB',
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activeThumbnail: {
    borderColor: '#2563EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  priceCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  propertyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  locationText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  priceText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2563EB',
    marginTop: 8,
  },
  badgesContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  badgeVerified: {
    backgroundColor: '#DCFCE7',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginRight: 8,
  },
  badgeNew: {
    backgroundColor: '#DBEAFE',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#111827',
  },
  detailsCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 8,
  },
  detailsGrid: {
    flexDirection: 'column',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 16,
    color: '#6B7280',
    width: 120,
  },
  detailValue: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  detailValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  statusSale: {
    backgroundColor: '#DCFCE7',
  },
  statusRent: {
    backgroundColor: '#DBEAFE',
  },
  statusOther: {
    backgroundColor: '#FEF2F2',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  descriptionCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  descriptionText: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 12,
  },
  locationCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  locationDetail: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 4,
  },
  mapPlaceholder: {
    height: 256,
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  mapPlaceholderText: {
    fontSize: 16,
    color: '#6B7280',
  },
  contactCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  contactInfo: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 16,
    marginTop: 8,
  },
  ownerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    justifyContent: 'space-between',
  },
  contactText: {
    fontSize: 16,
    color: '#6B7280',
    flex: 1,
    marginLeft: 12,
  },
  contactNote: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  ctaButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  ctaButtonText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '600',
  },
  returnButton: {
    marginTop: 12,
    alignItems: 'center',
  },
  returnButtonText: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '500',
  },
});

export default EachPropertyDetails;