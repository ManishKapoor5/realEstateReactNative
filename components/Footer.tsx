import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
//import Icon from 'react-native-vector-icons/Feather';

const Footer: React.FC = () => {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.footer}>
      <View style={styles.container}>
        
        <View style={styles.bottomSection}>
          <Text style={styles.copyright}>
            © 2025 Legacy Land Real Estate. All rights reserved.
          </Text>
          {/* <View style={styles.policyLinks}>
            <TouchableOpacity onPress={() => {}}>
              <Text style={styles.policyLink}>Terms of Use</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {}}>
              <Text style={styles.policyLink}>Privacy Policy</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {}}>
              <Text style={styles.policyLink}>Cookie Policy</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {}}>
              <Text style={styles.policyLink}>Sitemap</Text>
            </TouchableOpacity>
          </View> */}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    backgroundColor: '#111827',
    paddingVertical: 32,
  },
  container: {
    paddingHorizontal: 16,
  },
  topSection: {
    flexDirection: 'column',
    marginBottom: 24,
  },
  companySection: {
    marginBottom: 24,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoText: {
    marginLeft: 8,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  companyDescription: {
    fontSize: 14,
    color: '#9CA3AF',
    maxWidth: 300,
    marginBottom: 16,
  },
  socialContainer: {
    flexDirection: 'row',
  },
  socialButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  linksContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  linkColumn: {
    flex: 1,
    minWidth: 120,
    marginBottom: 16,
  },
  linkTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  linkItem: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#374151',
    marginVertical: 24,
  },
  bottomSection: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  copyright: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 16,
  },
  policyLinks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  policyLink: {
    fontSize: 12,
    color: '#9CA3AF',
    marginHorizontal: 8,
    marginBottom: 8,
  },
});

export default Footer;