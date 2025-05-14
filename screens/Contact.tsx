// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   Dimensions,
//   Linking,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome'; // Using FontAwesome for social media icons
// import CheckBox from '@react-native-community/checkbox';
// import MapView, { Marker } from 'react-native-maps';
// import Header from '../components/Header'; // Assuming React Native version
// import Footer from '../components/Footer'; // Assuming React Native version

// const Contact: React.FC = () => {
//   const [form, setForm] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     subject: '',
//     message: '',
//     consent: false,
//   });
//   const { width } = Dimensions.get('window');
//   const isLargeScreen = width >= 768;

//   const handleInputChange = (field: keyof typeof form, value: string | boolean) => {
//     setForm((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleSubmit = () => {
//     if (!form.consent) {
//       // Show error (e.g., toast)
//       return;
//     }
//     // Placeholder for submission logic (e.g., axiosInstance.post)
//     console.log('Form submitted:', form);
//   };

//   return (
//     <View style={styles.container}>
//       <Header />
//       <ScrollView contentContainerStyle={styles.main}>
//         {/* Hero Section */}
//         <View style={styles.hero}>
//           <Text style={styles.heroTitle}>Contact Us</Text>
//           <Text style={styles.heroSubtitle}>
//             Have questions about our services? We're here to help and answer any questions you might have.
//           </Text>
//         </View>

//         {/* Contact Form and Info */}
//         <View style={styles.content}>
//           <View style={[styles.grid, isLargeScreen ? styles.gridLarge : null]}>
//             {/* Contact Form */}
//             <View style={[styles.formSection, isLargeScreen ? styles.formSectionLarge : null]}>
//               <View style={styles.card}>
//                 <View style={styles.cardContent}>
//                   <Text style={styles.sectionTitle}>Get in Touch</Text>
//                   <View style={styles.form}>
//                     <View style={styles.formRow}>
//                       <View style={styles.formField}>
//                         <Text style={styles.label}>Your Name</Text>
//                         <TextInput
//                           style={styles.input}
//                           placeholder="Enter your full name"
//                           placeholderTextColor="#9CA3AF"
//                           value={form.name}
//                           onChangeText={(text) => handleInputChange('name', text)}
//                         />
//                       </View>
//                       <View style={styles.formField}>
//                         <Text style={styles.label}>Email Address</Text>
//                         <TextInput
//                           style={styles.input}
//                           placeholder="Enter your email"
//                           placeholderTextColor="#9CA3AF"
//                           keyboardType="email-address"
//                           value={form.email}
//                           onChangeText={(text) => handleInputChange('email', text)}
//                         />
//                       </View>
//                     </View>
//                     <View style={styles.formRow}>
//                       <View style={styles.formField}>
//                         <Text style={styles.label}>Phone Number</Text>
//                         <TextInput
//                           style={styles.input}
//                           placeholder="Enter your phone number"
//                           placeholderTextColor="#9CA3AF"
//                           keyboardType="phone-pad"
//                           value={form.phone}
//                           onChangeText={(text) => handleInputChange('phone', text)}
//                         />
//                       </View>
//                       <View style={styles.formField}>
//                         <Text style={styles.label}>Subject</Text>
//                         <TextInput
//                           style={styles.input}
//                           placeholder="What is this regarding?"
//                           placeholderTextColor="#9CA3AF"
//                           value={form.subject}
//                           onChangeText={(text) => handleInputChange('subject', text)}
//                         />
//                       </View>
//                     </View>
//                     <View style={styles.formField}>
//                       <Text style={styles.label}>Message</Text>
//                       <TextInput
//                         style={[styles.input, styles.textarea]}
//                         placeholder="How can we help you?"
//                         placeholderTextColor="#9CA3AF"
//                         multiline
//                         numberOfLines={6}
//                         value={form.message}
//                         onChangeText={(text) => handleInputChange('message', text)}
//                       />
//                     </View>
//                     <View style={styles.consentContainer}>
//                       <CheckBox
//                         value={form.consent}
//                         onValueChange={(value: string) => handleInputChange('consent', value)}
//                         tintColors={{ true: '#2563EB', false: '#6B7280' }}
//                         style={styles.checkbox}
//                       />
//                       <Text style={styles.consentText}>
//                         I agree to be contacted via email or phone about my query
//                       </Text>
//                     </View>
//                     <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
//                       <Text style={styles.submitButtonText}>Send Message</Text>
//                     </TouchableOpacity>
//                   </View>
//                 </View>
//               </View>
//             </View>

//             {/* Contact Info and Social */}
//             <View style={[styles.infoSection, isLargeScreen ? styles.infoSectionLarge : null]}>
//               {/* Contact Information */}
//               <View style={styles.card}>
//                 <View style={styles.cardContent}>
//                   <Text style={styles.sectionTitle}>Contact Information</Text>
//                   <View style={styles.infoItem}>
//                     <Icon name="map-marker" size={20} color="#2563EB" style={styles.infoIcon} />
//                     <View>
//                       <Text style={styles.infoTitle}>Our Main Office</Text>
//                       <Text style={styles.infoText}>
//                         Legacy Land Real Estate, 123 Business Park,{'\n'}
//                         Andheri East, Mumbai 400069,{'\n'}
//                         Maharashtra, India
//                       </Text>
//                     </View>
//                   </View>
//                   <View style={styles.infoItem}>
//                     <Icon name="phone" size={20} color="#2563EB" style={styles.infoIcon} />
//                     <View>
//                       <Text style={styles.infoTitle}>Phone</Text>
//                       <Text style={styles.infoText}>+91 22 1234 5678</Text>
//                       <Text style={styles.infoText}>Toll-Free: 1800 123 4567</Text>
//                     </View>
//                   </View>
//                   <View style={styles.infoItem}>
//                     <Icon name="envelope" size={20} color="#2563EB" style={styles.infoIcon} />
//                     <View>
//                       <Text style={styles.infoTitle}>Email</Text>
//                       <Text style={styles.infoText}>contact@legacyland.com</Text>
//                       <Text style={styles.infoText}>support@legacyland.com</Text>
//                     </View>
//                   </View>
//                   <View style={styles.infoItem}>
//                     <Icon name="clock-o" size={20} color="#2563EB" style={styles.infoIcon} />
//                     <View>
//                       <Text style={styles.infoTitle}>Working Hours</Text>
//                       <Text style={styles.infoText}>Monday - Friday: 9:00 AM - 6:00 PM</Text>
//                       <Text style={styles.infoText}>Saturday: 10:00 AM - 4:00 PM</Text>
//                       <Text style={styles.infoText}>Sunday: Closed</Text>
//                     </View>
//                   </View>
//                 </View>
//               </View>

//               {/* Connect With Us */}
//               <View style={styles.card}>
//                 <View style={styles.cardContent}>
//                   <Text style={styles.sectionTitle}>Connect With Us</Text>
//                   <View style={styles.socialContainer}>
//                     <TouchableOpacity
//                       style={styles.socialButton}
//                       onPress={() => Linking.openURL('https://facebook.com')}
//                     >
//                       <Icon name="facebook" size={18} color="#111827" />
//                     </TouchableOpacity>
//                     <TouchableOpacity
//                       style={styles.socialButton}
//                       onPress={() => Linking.openURL('https://twitter.com')}
//                     >
//                       <Icon name="twitter" size={18} color="#111827" />
//                     </TouchableOpacity>
//                     <TouchableOpacity
//                       style={styles.socialButton}
//                       onPress={() => Linking.openURL('https://instagram.com')}
//                     >
//                       <Icon name="instagram" size={18} color="#111827" />
//                     </TouchableOpacity>
//                     <TouchableOpacity
//                       style={styles.socialButton}
//                       onPress={() => Linking.openURL('https://linkedin.com')}
//                     >
//                       <Icon name="linkedin" size={18} color="#111827" />
//                     </TouchableOpacity>
//                   </View>
//                 </View>
//               </View>

//               {/* Our Offices */}
//               <View style={styles.card}>
//                 <View style={styles.cardContent}>
//                   <Text style={styles.sectionTitle}>Our Offices</Text>
//                   <View style={styles.infoItem}>
//                     <Icon name="building" size={20} color="#2563EB" style={styles.infoIcon} />
//                     <View>
//                       <Text style={styles.infoTitle}>Mumbai</Text>
//                       <Text style={styles.infoText}>
//                         123 Business Park, Andheri East, Mumbai 400069
//                       </Text>
//                     </View>
//                   </View>
//                   <View style={styles.infoItem}>
//                     <Icon name="building" size={20} color="#2563EB" style={styles.infoIcon} />
//                     <View>
//                       <Text style={styles.infoTitle}>Delhi NCR</Text>
//                       <Text style={styles.infoText}>
//                         456 Corporate Tower, Sector 62, Noida 201301
//                       </Text>
//                     </View>
//                   </View>
//                   <View style={styles.infoItem}>
//                     <Icon name="building" size={20} color="#2563EB" style={styles.infoIcon} />
//                     <View>
//                       <Text style={styles.infoTitle}>Bangalore</Text>
//                       <Text style={styles.infoText}>
//                         789 Tech Park, Whitefield, Bangalore 560066
//                       </Text>
//                     </View>
//                   </View>
//                 </View>
//               </View>
//             </View>
//           </View>
//         </View>

//         {/* Locate Us */}
//         <View style={styles.mapSection}>
//           <Text style={styles.mapTitle}>Locate Us</Text>
//           <View style={styles.mapContainer}>
//             <MapView
//               style={styles.map}
//               initialRegion={{
//                 latitude: 19.082688,
//                 longitude: 72.7411,
//                 latitudeDelta: 0.0922,
//                 longitudeDelta: 0.0421,
//               }}
//             >
//               <Marker
//                 coordinate={{ latitude: 19.082688, longitude: 72.7411 }}
//                 title="Legacy Land Real Estate"
//                 description="123 Business Park, Andheri East, Mumbai"
//               />
//             </MapView>
//           </View>
//         </View>
//       </ScrollView>
//       <Footer />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F9FAFB',
//   },
//   main: {
//     paddingHorizontal: 16,
//     paddingVertical: 24,
//   },
//   hero: {
//     backgroundColor: '#2563EB',
//     paddingVertical: 48,
//     alignItems: 'center',
//   },
//   heroTitle: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#FFFFFF',
//     marginBottom: 8,
//   },
//   heroSubtitle: {
//     fontSize: 16,
//     color: '#EFF6FF',
//     textAlign: 'center',
//     maxWidth: 600,
//   },
//   content: {
//     maxWidth: 1200,
//     alignSelf: 'center',
//     marginBottom: 24,
//   },
//   grid: {
//     flexDirection: 'column',
//   },
//   gridLarge: {
//     flexDirection: 'row',
//   },
//   formSection: {
//     flex: 1,
//     marginBottom: 24,
//   },
//   formSectionLarge: {
//     flex: 2,
//     marginRight: 24,
//   },
//   infoSection: {
//     flex: 1,
//   },
//   infoSectionLarge: {
//     flex: 1,
//   },
//   card: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//     marginBottom: 16,
//   },
//   cardContent: {
//     padding: 16,
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#111827',
//     marginBottom: 16,
//   },
//   form: {
//     flex: 1,
//   },
//   formRow: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     marginBottom: 16,
//   },
//   formField: {
//     flex: 1,
//     minWidth: 150,
//     marginBottom: 16,
//     marginRight: 16,
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#374151',
//     marginBottom: 8,
//   },
//   input: {
//     backgroundColor: '#F9FAFB',
//     borderWidth: 1,
//     borderColor: '#D1D5DB',
//     borderRadius: 6,
//     padding: 12,
//     fontSize: 14,
//     color: '#111827',
//   },
//   textarea: {
//     height: 120,
//     textAlignVertical: 'top',
//   },
//   consentContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   checkbox: {
//     width: 24,
//     height: 24,
//   },
//   consentText: {
//     fontSize: 12,
//     color: '#6B7280',
//     marginLeft: 8,
//     flex: 1,
//   },
//   submitButton: {
//     backgroundColor: '#2563EB',
//     borderRadius: 6,
//     paddingVertical: 12,
//     alignItems: 'center',
//   },
//   submitButtonText: {
//     fontSize: 14,
//     color: '#FFFFFF',
//     fontWeight: '500',
//   },
//   infoItem: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     marginBottom: 16,
//   },
//   infoIcon: {
//     marginTop: 4,
//     marginRight: 12,
//   },
//   infoTitle: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#111827',
//     marginBottom: 4,
//   },
//   infoText: {
//     fontSize: 12,
//     color: '#6B7280',
//     lineHeight: 18,
//   },
//   socialContainer: {
//     flexDirection: 'row',
//   },
//   socialButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     borderWidth: 1,
//     borderColor: '#D1D5DB',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   mapSection: {
//     alignItems: 'center',
//     paddingVertical: 24,
//   },
//   mapTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#111827',
//     marginBottom: 16,
//   },
//   mapContainer: {
//     width: '100%',
//     height: 400,
//     borderRadius: 8,
//     overflow: 'hidden',
//   },
//   map: {
//     flex: 1,
//   },
// });

// export default Contact;