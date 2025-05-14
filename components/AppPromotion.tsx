import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';

const { width } = Dimensions.get('window');

const AppPromoSection: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Download Legacy Land Real Estate Mobile App</Text>
        <Text style={styles.subtitle}>and never miss out any update</Text>
        
        <View style={styles.feature}>
          <Text style={styles.checkmark}>✓</Text>
          <Text style={styles.featureText}>
            Get to know about newly posted properties as soon as they are posted
          </Text>
        </View>
        
        <View style={styles.feature}>
          <Text style={styles.checkmark}>✓</Text>
          <Text style={styles.featureText}>
            Manage your properties with ease and get instant alerts about responses
          </Text>
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.storeButton}>
            <Image
              source={{ uri: 'https://via.placeholder.com/120x36' }}
              style={styles.storeImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.storeButton}>
            <Image
              source={{ uri: 'https://via.placeholder.com/120x36' }}
              style={styles.storeImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>
      
      {width >= 768 && (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: 'https://via.placeholder.com/300x500' }}
            style={styles.appImage}
          />
          <View style={styles.downloadBadge}>
            <Text style={styles.downloadIcon}>⬇️</Text>
            <Text style={styles.downloadText}>5M+ Downloads</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF7ED',
    padding: 24,
    borderRadius: 12,
    margin: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  content: {
    maxWidth: 400,
  },
  title: {
    fontSize: width >= 768 ? 24 : 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#4B5563',
    marginBottom: 16,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  checkmark: {
    color: '#2563EB',
    fontWeight: 'bold',
    marginRight: 8,
    fontSize: 16,
  },
  featureText: {
    color: '#374151',
    fontSize: 14,
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 16,
  },
  storeButton: {
    backgroundColor: '#000000',
    borderRadius: 8,
    height: 40,
    width: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  storeImage: {
    height: 32,
    width: 100,
  },
  imageContainer: {
    position: 'relative',
  },
  appImage: {
    width: 200,
    height: 400,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  downloadBadge: {
    position: 'absolute',
    bottom: 16,
    left: '50%',
    transform: [{ translateX: -50 }],
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  downloadIcon: {
    fontSize: 16,
    color: '#2563EB',
    marginRight: 8,
  },
  downloadText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
  },
});

export default AppPromoSection;