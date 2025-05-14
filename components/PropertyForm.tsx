// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   ActivityIndicator,
//   Platform,
//   ToastAndroid,
//   Alert,
//   Switch,
//   Image,
// } from 'react-native';
// import { Picker, PickerIOS } from '@react-native-picker/picker';
// import { launchImageLibrary } from 'react-native-image-picker';
// import { Property } from '../types/property';
// import { useAuthStore } from '../store/authStore';

// interface PropertyFormProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   userLocation?: { latitude: number; longitude: number } | null;
//   onSuccess?: () => void;
//   onSubmit: (data: Partial<Property>) => void;
// }

// const PropertyForm: React.FC<PropertyFormProps> = ({ open, onOpenChange, userLocation, onSuccess, onSubmit }) => {
//   const [formData, setFormData] = useState({
//     sellerId: '',
//     title: '',
//     description: '',
//     price: '',
//     type: 'apartment',
//     address: '',
//     city: '',
//     state: '',
//     country: '',
//     postalCode: '',
//     bedrooms: '',
//     bathrooms: '',
//     area: '',
//     parking: false,
//     furnished: false,
//     images: [] as Array<{ uri: string; type: string; name: string }>,
//     ownerName: '',
//     ownerContact: '',
//     ownerEmail: '',
//     status: 'available',
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState(false);
//   const { user, isAuthenticated, accessToken, refreshToken } = useAuthStore();

//   useEffect(() => {
//     const checkAuth = async () => {
//       setLoading(true);
//       if (!isAuthenticated) {
//         if (refreshToken) {
//           try {
//             const response = await fetch('https://realestatesite-backend.onrender.com/api/v1/RealEstateUser/refresh-token', {
//               method: 'POST',
//               headers: { 'Content-Type': 'application/json' },
//               body: JSON.stringify({ refreshToken }),
//               credentials: 'include',
//             });
//             if (!response.ok) throw new Error('Token refresh failed');
//           } catch (err) {
//             setError('Your session has expired. Please log in again.');
//             showToast('Error', 'Your session has expired. Please log in again.');
//             return;
//           }
//         } else {
//           showToast('Error', 'Please log in to add a property.');
//           return;
//         }
//       }
//       setLoading(false);
//     };
//     checkAuth();
//   }, [isAuthenticated, refreshToken]);

//   const showToast = (title: string, description: string) => {
//     if (Platform.OS === 'android') {
//       ToastAndroid.showWithGravity(`${title}: ${description}`, ToastAndroid.LONG, ToastAndroid.BOTTOM);
//     } else {
//       Alert.alert(title, description);
//     }
//   };

//   const handleChange = (name: string, value: string | boolean) => {
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const pickImages = () => {
//     launchImageLibrary({ mediaType: 'photo', selectionLimit: 0 }, (response) => {
//       if (response.assets) {
//         const newImages = response.assets.map((asset) => ({
//           uri: asset.uri!,
//           type: asset.type!,
//           name: asset.fileName || `image-${Date.now()}.jpg`,
//         }));
//         setFormData((prev) => ({ ...prev, images: [...prev.images, ...newImages] }));
//       }
//     });
//   };

//   const removeImage = (index: number) => {
//     setFormData((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
//   };

//   const handleSubmit = async () => {
//     setLoading(true);
//     setError('');
//     setSuccess(false);

//     try {
//       if (!userLocation) {
//         throw new Error('Location access is required to add a property. Please allow location access and try again.');
//       }

//       if (!user?._id) {
//         throw new Error('User authentication required.');
//       }

//       const propertyData: Partial<Property> = {
//         sellerId: user._id,
//         title: formData.title,
//         description: formData.description,
//         price: parseFloat(formData.price) || 0,
//         type: formData.type,
//         location: {
//           address: formData.address,
//           city: formData.city,
//           state: formData.state,
//           country: formData.country,
//           postalCode: formData.postalCode,
//           latitude: userLocation.latitude,
//           longitude: userLocation.longitude,
//         },
//         features: {
//           bedrooms: parseInt(formData.bedrooms) || 0,
//           bathrooms: parseInt(formData.bathrooms) || 0,
//           area: parseFloat(formData.area) || 0,
//           parking: formData.parking,
//           furnished: formData.furnished,
//         },
//         owner: {
//           name: formData.ownerName,
//           contact: formData.ownerContact,
//           email: formData.ownerEmail,
//         },
//         status: formData.status,
//         images: formData.images,
//       };

//       const form = new FormData();
//       form.append('sellerId', user._id);
//       form.append('title', formData.title);
//       form.append('description', formData.description);
//       form.append('price', formData.price);
//       form.append('type', formData.type);
//       form.append('location[address]', formData.address);
//       form.append('location[city]', formData.city);
//       form.append('location[state]', formData.state);
//       form.append('location[country]', formData.country);
//       form.append('location[postalCode]', formData.postalCode);
//       form.append('location[latitude]', userLocation.latitude.toString());
//       form.append('location[longitude]', userLocation.longitude.toString());
//       form.append('features[bedrooms]', formData.bedrooms);
//       form.append('features[bathrooms]', formData.bathrooms);
//       form.append('features[area]', formData.area);
//       form.append('features[parking]', formData.parking.toString());
//       form.append('features[furnished]', formData.furnished.toString());
//       form.append('owner[name]', formData.ownerName);
//       form.append('owner[contact]', formData.ownerContact);
//       form.append('owner[email]', formData.ownerEmail);
//       form.append('status', formData.status);

//       formData.images.forEach((img) => {
//         form.append('images', { uri: img.uri, type: img.type, name: img.name } as any);
//       });

//       const response = await fetch('https://realestatesite-backend.onrender.com/api/v1/Property/add', {
//         method: 'POST',
//         headers: { Authorization: `Bearer ${accessToken}` },
//         body: form,
//       });

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => null);
//         throw new Error(errorData?.message || 'Failed to submit property');
//       }

//       const responseData = await response.json();
//       // Update images to URLs if backend returns them
//       propertyData.images = responseData.images || formData.images;

//       setSuccess(true);
//       onSubmit(propertyData);
//       if (onSuccess) {
//         onSuccess();
//       }

//       setFormData({
//         sellerId: '',
//         title: '',
//         description: '',
//         price: '',
//         type: 'apartment',
//         address: '',
//         city: '',
//         state: '',
//         country: '',
//         postalCode: '',
//         bedrooms: '',
//         bathrooms: '',
//         area: '',
//         parking: false,
//         furnished: false,
//         images: [],
//         ownerName: '',
//         ownerContact: '',
//         ownerEmail: '',
//         status: 'available',
//       });

//       onOpenChange(false);
//     } catch (err: any) {
//       setError(err.message || 'Failed to add property');
//       showToast('Error', err.message || 'Failed to add property');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!open) return null;

//   return (
//     <View style={{ flex: 1, backgroundColor: '#fff', padding: 16 }}>
//       <View>
//         <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 16 }}>
//           Add New Property
//         </Text>

//         {error && (
//           <View style={{ backgroundColor: '#fee2e2', padding: 16, borderRadius: 8, marginBottom: 16 }}>
//             <Text style={{ color: '#dc2626' }}>{error}</Text>
//           </View>
//         )}
//         {success && (
//           <View style={{ backgroundColor: '#d1fae5', padding: 16, borderRadius: 8, marginBottom: 16 }}>
//             <Text style={{ color: '#15803d' }}>Property added successfully!</Text>
//           </View>
//         )}
//         {!userLocation && (
//           <View style={{ backgroundColor: '#fef3c7', padding: 16, borderRadius: 8, marginBottom: 16 }}>
//             <Text style={{ color: '#b45309', fontWeight: 'bold' }}>Location access required</Text>
//             <Text style={{ color: '#b45309' }}>
//               Please allow location access to set property coordinates accurately.
//             </Text>
//           </View>
//         )}

//         {/* Basic Information */}
//         <View style={{ marginBottom: 24 }}>
//           <Text style={{ fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 8 }}>
//             Basic Information
//           </Text>
//           <TextInput
//             style={{ borderWidth: 1, borderColor: '#d1d5db', padding: 12, borderRadius: 8, marginBottom: 12 }}
//             placeholder="Title"
//             value={formData.title}
//             onChangeText={(value) => handleChange('title', value)}
//           />
//           <TextInput
//             style={{ borderWidth: 1, borderColor: '#d1d5db', padding: 12, borderRadius: 8, marginBottom: 12 }}
//             placeholder="Price (₹)"
//             value={formData.price}
//             onChangeText={(value) => handleChange('price', value)}
//             keyboardType="numeric"
//           />
//           <TextInput
//             style={{ borderWidth: 1, borderColor: '#d1d5db', padding: 12, borderRadius: 8, marginBottom: 12 }}
//             placeholder="Description"
//             value={formData.description}
//             onChangeText={(value) => handleChange('description', value)}
//             multiline
//             numberOfLines={4}
//           />
//           <View style={{ borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, marginBottom: 12 }}>
//             <Picker
//               selectedValue={formData.type}
//               onValueChange={(value: string) => handleChange('type', value)}
//               style={{ height: 50 }}
//             >
//               <Picker.Item label="Apartment" value="apartment" />
//               <Picker.Item label="House" value="house" />
//               <Picker.Item label="Condo" value="condo" />
//               <Picker.Item label="Villa" value="villa" />
//               <Picker.Item label="Land" value="land" />
//               <Picker.Item label="Commercial" value="commercial" />
//             </Picker>
//           </View>
//           <View style={{ borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, marginBottom: 12 }}>
//             <Picker
//               selectedValue={formData.status}
//               onValueChange={(value: string) => handleChange('status', value)}
//               style={{ height: 50 }}
//             >
//               <Picker.Item label="Available" value="available" />
//               <Picker.Item label="Pending" value="pending" />
//               <Picker.Item label="Sold" value="sold" />
//             </Picker>
//           </View>
//         </View>

//         {/* Location */}
//         <View style={{ marginBottom: 24 }}>
//           <Text style={{ fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 8 }}>Location</Text>
//           <TextInput
//             style={{ borderWidth: 1, borderColor: '#d1d5db', padding: 12, borderRadius: 8, marginBottom: 12 }}
//             placeholder="Address"
//             value={formData.address}
//             onChangeText={(value) => handleChange('address', value)}
//           />
//           <TextInput
//             style={{ borderWidth: 1, borderColor: '#d1d5db', padding: 12, borderRadius: 8, marginBottom: 12 }}
//             placeholder="City"
//             value={formData.city}
//             onChangeText={(value) => handleChange('city', value)}
//           />
//           <TextInput
//             style={{ borderWidth: 1, borderColor: '#d1d5db', padding: 12, borderRadius: 8, marginBottom: 12 }}
//             placeholder="State"
//             value={formData.state}
//             onChangeText={(value) => handleChange('state', value)}
//           />
//           <TextInput
//             style={{ borderWidth: 1, borderColor: '#d1d5db', padding: 12, borderRadius: 8, marginBottom: 12 }}
//             placeholder="Country"
//             value={formData.country}
//             onChangeText={(value) => handleChange('country', value)}
//           />
//           <TextInput
//             style={{ borderWidth: 1, borderColor: '#d1d5db', padding: 12, borderRadius: 8, marginBottom: 12 }}
//             placeholder="Postal Code"
//             value={formData.postalCode}
//             onChangeText={(value) => handleChange('postalCode', value)}
//           />
//         </View>

//         {/* Features */}
//         <View style={{ marginBottom: 24 }}>
//           <Text style={{ fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 8 }}>Features</Text>
//           <TextInput
//             style={{ borderWidth: 1, borderColor: '#d1d5db', padding: 12, borderRadius: 8, marginBottom: 12 }}
//             placeholder="Bedrooms"
//             value={formData.bedrooms}
//             onChangeText={(value) => handleChange('bedrooms', value)}
//             keyboardType="numeric"
//           />
//           <TextInput
//             style={{ borderWidth: 1, borderColor: '#d1d5db', padding: 12, borderRadius: 8, marginBottom: 12 }}
//             placeholder="Bathrooms"
//             value={formData.bathrooms}
//             onChangeText={(value) => handleChange('bathrooms', value)}
//             keyboardType="numeric"
//           />
//           <TextInput
//             style={{ borderWidth: 1, borderColor: '#d1d5db', padding: 12, borderRadius: 8, marginBottom: 12 }}
//             placeholder="Area (sq ft)"
//             value={formData.area}
//             onChangeText={(value) => handleChange('area', value)}
//             keyboardType="numeric"
//           />
//           <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
//             <Switch
//               value={formData.parking}
//               onValueChange={(value) => handleChange('parking', value)}
//             />
//             <Text style={{ marginLeft: 8, color: '#333' }}>Parking Available</Text>
//           </View>
//           <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
//             <Switch
//               value={formData.furnished}
//               onValueChange={(value) => handleChange('furnished', value)}
//             />
//             <Text style={{ marginLeft: 8, color: '#333' }}>Furnished</Text>
//           </View>
//         </View>

//         {/* Images */}
//         <View style={{ marginBottom: 24 }}>
//           <Text style={{ fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 8 }}>Images</Text>
//           <TouchableOpacity
//             onPress={pickImages}
//             style={{ padding: 12, backgroundColor: '#e5e7eb', borderRadius: 8, alignItems: 'center', marginBottom: 12 }}
//           >
//             <Text style={{ color: '#333', fontSize: 16 }}>Pick Images</Text>
//           </TouchableOpacity>
//           {formData.images.length > 0 && (
//             <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
//               {formData.images.map((img, index) => (
//                 <View key={index} style={{ marginRight: 8, marginBottom: 8 }}>
//                   <Image source={{ uri: img.uri }} style={{ width: 100, height: 100, borderRadius: 8 }} />
//                   <TouchableOpacity
//                     onPress={() => removeImage(index)}
//                     style={{ position: 'absolute', top: 4, right: 4, backgroundColor: '#dc2626', borderRadius: 12, padding: 4 }}
//                   >
//                     <Text style={{ color: '#fff', fontSize: 12 }}>X</Text>
//                   </TouchableOpacity>
//                 </View>
//               ))}
//             </View>
//           )}
//         </View>

//         {/* Owner Information */}
//         <View style={{ marginBottom: 24 }}>
//           <Text style={{ fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 8 }}>
//             Owner Information
//           </Text>
//           <TextInput
//             style={{ borderWidth: 1, borderColor: '#d1d5db', padding: 12, borderRadius: 8, marginBottom: 12 }}
//             placeholder="Owner Name"
//             value={formData.ownerName}
//             onChangeText={(value) => handleChange('ownerName', value)}
//           />
//           <TextInput
//             style={{ borderWidth: 1, borderColor: '#d1d5db', padding: 12, borderRadius: 8, marginBottom: 12 }}
//             placeholder="Contact Number"
//             value={formData.ownerContact}
//             onChangeText={(value) => handleChange('ownerContact', value)}
//             keyboardType="phone-pad"
//           />
//           <TextInput
//             style={{ borderWidth: 1, borderColor: '#d1d5db', padding: 12, borderRadius: 8, marginBottom: 12 }}
//             placeholder="Email"
//             value={formData.ownerEmail}
//             onChangeText={(value) => handleChange('ownerEmail', value)}
//             keyboardType="email-address"
//           />
//         </View>

//         {/* Submit Button */}
//         <TouchableOpacity
//           onPress={handleSubmit}
//           disabled={loading}
//           style={{
//             backgroundColor: loading ? '#9ca3af' : '#3b82f6',
//             padding: 16,
//             borderRadius: 8,
//             alignItems: 'center',
//           }}
//         >
//           {loading ? (
//             <ActivityIndicator color="#fff" />
//           ) : (
//             <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>Add Property</Text>
//           )}
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// export default PropertyForm;

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
  ToastAndroid,
  Alert,
  Switch,
  Image,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { launchImageLibrary, ImagePickerResponse } from 'react-native-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Property } from '../types/property';
import { useAuthStore } from '../store/authStore';

interface PropertyFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userLocation?: { latitude: number; longitude: number } | null;
  onSuccess?: () => void;
  onSubmit: (data: Partial<Property>) => void;
  initialData?: Partial<Property>;
  property?: Partial<Property>;  // Add this prop
  isInModal?: boolean;    
}

const { width } = Dimensions.get('window');

const PropertyForm: React.FC<PropertyFormProps> = ({
  open,
  onOpenChange,
  userLocation,
  onSuccess,
  onSubmit,
  initialData,
   isInModal
}) => {
  const [formData, setFormData] = useState({
    sellerId: '',
    title: '',
    description: '',
    price: '',
    type: 'apartment',
    address: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    parking: false,
    furnished: false,
    images: [] as Array<{ uri: string; type: string; name: string }>,
    ownerName: '',
    ownerContact: '',
    ownerEmail: '',
    status: 'available',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { user, isAuthenticated, accessToken, refreshToken } = useAuthStore();

  // Populate form with initial data if provided
  useEffect(() => {
    if (initialData) {
      const populatedData = {
        sellerId: initialData.sellerId || '',
        title: initialData.title || '',
        description: initialData.description || '',
        price: initialData.price ? String(initialData.price) : '',
        type: initialData.type || 'apartment',
        address: initialData.location?.address || '',
        city: initialData.location?.city || '',
        state: initialData.location?.state || '',
        country: initialData.location?.country || '',
        postalCode: initialData.location?.postalCode || '',
        bedrooms: initialData.features?.bedrooms ? String(initialData.features.bedrooms) : '',
        bathrooms: initialData.features?.bathrooms ? String(initialData.features.bathrooms) : '',
        area: initialData.features?.area ? String(initialData.features.area) : '',
        parking: initialData.features?.parking || false,
        furnished: initialData.features?.furnished || false,
        images: initialData.images?.map(img => {
          if (typeof img === 'string') {
            return { uri: img, type: 'image/jpeg', name: `image-${Date.now()}.jpg` };
          } else if (typeof img === 'object' && img !== null) {
            return img;
          }
          return { uri: '', type: 'image/jpeg', name: `image-${Date.now()}.jpg` };
        }) || [],
        ownerName: initialData.owner?.name || '',
        ownerContact: initialData.owner?.contact || '',
        ownerEmail: initialData.owner?.email || '',
        status: initialData.status || 'available',
      };
      setFormData(populatedData);
    }
  }, [initialData, open]);

  // Authenticate user
  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      if (!isAuthenticated) {
        if (refreshToken) {
          try {
            const response = await fetch(
              'https://realestatesite-backend.onrender.com/api/v1/RealEstateUser/refresh-token',
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken }),
                credentials: 'include',
              }
            );
            if (!response.ok) throw new Error('Token refresh failed');
          } catch (err) {
            setError('Your session has expired. Please log in again.');
            showToast('Error', 'Your session has expired. Please log in again.');
            return;
          }
        } else {
          showToast('Error', 'Please log in to add a property.');
          return;
        }
      }
      setLoading(false);
    };
    
    if (open) {
      checkAuth();
    }
  }, [isAuthenticated, refreshToken, open]);

  const showToast = useCallback((title: string, description: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.showWithGravity(
        `${title}: ${description}`,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM
      );
    } else {
      Alert.alert(title, description);
    }
  }, []);

  const handleChange = useCallback((name: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const validateForm = useCallback(() => {
    // Basic validation
    if (!formData.title.trim()) return 'Title is required';
    if (!formData.price.trim()) return 'Price is required';
    if (!formData.description.trim()) return 'Description is required';
    if (!formData.address.trim()) return 'Address is required';
    if (!formData.city.trim()) return 'City is required';
    
    // Ensure numeric fields contain valid numbers
    if (isNaN(parseFloat(formData.price))) return 'Price must be a valid number';
    if (formData.bedrooms && isNaN(parseInt(formData.bedrooms))) 
      return 'Bedrooms must be a valid number';
    if (formData.bathrooms && isNaN(parseInt(formData.bathrooms))) 
      return 'Bathrooms must be a valid number';
    if (formData.area && isNaN(parseFloat(formData.area))) 
      return 'Area must be a valid number';
      
    return null;
  }, [formData]);

  const pickImages = useCallback(() => {
    launchImageLibrary(
      { mediaType: 'photo', selectionLimit: 5, quality: 0.8 }, 
      (response: ImagePickerResponse) => {
        if (response.assets) {
          const newImages = response.assets.map((asset) => ({
            uri: asset.uri!,
            type: asset.type || 'image/jpeg',
            name: asset.fileName || `image-${Date.now()}.jpg`,
          }));
          
          // Limit total images to 10
          const updatedImages = [...formData.images, ...newImages];
          if (updatedImages.length > 10) {
            showToast('Warning', 'Maximum 10 images allowed');
            setFormData((prev) => ({ 
              ...prev, 
              images: updatedImages.slice(0, 10)
            }));
          } else {
            setFormData((prev) => ({ 
              ...prev, 
              images: updatedImages
            }));
          }
        } else if (response.errorMessage) {
          showToast('Error', response.errorMessage);
        }
      }
    );
  }, [formData.images, showToast]);

  const removeImage = useCallback((index: number) => {
    setFormData((prev) => ({ 
      ...prev, 
      images: prev.images.filter((_, i) => i !== index) 
    }));
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Validate form
      const validationError = validateForm();
      if (validationError) {
        throw new Error(validationError);
      }
      
      if (!userLocation && !initialData?.location?.latitude) {
        throw new Error(
          'Location access is required to add a property. Please allow location access and try again.'
        );
      }

      if (!user?._id) {
        throw new Error('User authentication required.');
      }

      // Use location data from initialData if available and userLocation is not
      const latitude = userLocation?.latitude || initialData?.location?.latitude || 0;
      const longitude = userLocation?.longitude || initialData?.location?.longitude || 0;

      const propertyData: Partial<Property> = {
        sellerId: user._id,
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price) || 0,
        type: formData.type,
        location: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          postalCode: formData.postalCode,
          latitude,
          longitude,
        },
        features: {
          bedrooms: parseInt(formData.bedrooms) || 0,
          bathrooms: parseInt(formData.bathrooms) || 0,
          area: parseFloat(formData.area) || 0,
          parking: formData.parking,
          furnished: formData.furnished,
        },
        owner: {
          name: formData.ownerName,
          contact: formData.ownerContact,
          email: formData.ownerEmail,
        },
        status: formData.status,
        images: formData.images,
      };

      const form = new FormData();
      form.append('sellerId', user._id);
      form.append('title', formData.title);
      form.append('description', formData.description);
      form.append('price', formData.price);
      form.append('type', formData.type);
      form.append('location[address]', formData.address);
      form.append('location[city]', formData.city);
      form.append('location[state]', formData.state);
      form.append('location[country]', formData.country);
      form.append('location[postalCode]', formData.postalCode);
      form.append('location[latitude]', latitude.toString());
      form.append('location[longitude]', longitude.toString());
      form.append('features[bedrooms]', formData.bedrooms || '0');
      form.append('features[bathrooms]', formData.bathrooms || '0');
      form.append('features[area]', formData.area || '0');
      form.append('features[parking]', formData.parking.toString());
      form.append('features[furnished]', formData.furnished.toString());
      form.append('owner[name]', formData.ownerName);
      form.append('owner[contact]', formData.ownerContact);
      form.append('owner[email]', formData.ownerEmail);
      form.append('status', formData.status);

      // Only append images that aren't already uploaded (don't have an ID)
      formData.images.forEach((img) => {
        if (img.uri.startsWith('file:') || img.uri.startsWith('content:')) {
          form.append('images', { uri: img.uri, type: img.type, name: img.name } as any);
        }
      });

      const endpoint = initialData?._id 
        ? `https://realestatesite-backend.onrender.com/api/v1/Property/update/${initialData._id}`
        : 'https://realestatesite-backend.onrender.com/api/v1/Property/add';
        
      const method = initialData?._id ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: { Authorization: `Bearer ${accessToken}` },
        body: form,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Failed to ${initialData?._id ? 'update' : 'submit'} property`);
      }

      const responseData = await response.json();
      propertyData.images = responseData.images || formData.images;

      setSuccess(true);
      onSubmit(propertyData);
      if (onSuccess) {
        onSuccess();
      }

      // Reset form data
      setFormData({
        sellerId: '',
        title: '',
        description: '',
        price: '',
        type: 'apartment',
        address: '',
        city: '',
        state: '',
        country: '',
        postalCode: '',
        bedrooms: '',
        bathrooms: '',
        area: '',
        parking: false,
        furnished: false,
        images: [],
        ownerName: '',
        ownerContact: '',
        ownerEmail: '',
        status: 'available',
      });

      // Close form
      setTimeout(() => onOpenChange(false), 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to add property');
      showToast('Error', err.message || 'Failed to add property');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // Reset form state and close
    setError('');
    setSuccess(false);
    onOpenChange(false);
  };

  if (!open) return null;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {initialData?._id ? 'Edit Property' : 'Add New Property'}
            </Text>
            {/* <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity> */}
          </View>

          {error && (
            <View style={styles.alertError}>
              <Text style={styles.alertTextError}>{error}</Text>
            </View>
          )}
          {success && (
            <View style={styles.alertSuccess}>
              <Text style={styles.alertTextSuccess}>
                Property {initialData?._id ? 'updated' : 'added'} successfully!
              </Text>
            </View>
          )}
          {!userLocation && !initialData?.location?.latitude && (
            <View style={styles.alertWarning}>
              <Text style={styles.alertTextWarning}>Location access required</Text>
              <Text style={styles.alertTextWarning}>
                Please allow location access to set property coordinates accurately.
              </Text>
            </View>
          )}

          {/* Form Sections */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Information</Text>
            <TextInput
              style={styles.input}
              placeholder="Title *"
              value={formData.title}
              onChangeText={(value) => handleChange('title', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Price (₹) *"
              value={formData.price}
              onChangeText={(value) => handleChange('price', value)}
              keyboardType="numeric"
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description *"
              value={formData.description}
              onChangeText={(value) => handleChange('description', value)}
              multiline
              numberOfLines={4}
            />
            <Text style={styles.pickerLabel}>Property Type</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.type}
                onValueChange={(value: string) => handleChange('type', value)}
                style={styles.picker}
              >
                <Picker.Item label="Apartment" value="apartment" />
                <Picker.Item label="House" value="house" />
                <Picker.Item label="Condo" value="condo" />
                <Picker.Item label="Villa" value="villa" />
                <Picker.Item label="Land" value="land" />
                <Picker.Item label="Commercial" value="commercial" />
              </Picker>
            </View>
            <Text style={styles.pickerLabel}>Status</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.status}
                onValueChange={(value: string) => handleChange('status', value)}
                style={styles.picker}
              >
                <Picker.Item label="Available" value="available" />
                <Picker.Item label="Pending" value="pending" />
                <Picker.Item label="Sold" value="sold" />
              </Picker>
            </View>
          </View>

          {/* Location */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location</Text>
            <TextInput
              style={styles.input}
              placeholder="Address *"
              value={formData.address}
              onChangeText={(value) => handleChange('address', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="City *"
              value={formData.city}
              onChangeText={(value) => handleChange('city', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="State"
              value={formData.state}
              onChangeText={(value) => handleChange('state', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Country"
              value={formData.country}
              onChangeText={(value) => handleChange('country', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Postal Code"
              value={formData.postalCode}
              onChangeText={(value) => handleChange('postalCode', value)}
            />
          </View>

          {/* Features */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Features</Text>
            <TextInput
              style={styles.input}
              placeholder="Bedrooms"
              value={formData.bedrooms}
              onChangeText={(value) => handleChange('bedrooms', value)}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Bathrooms"
              value={formData.bathrooms}
              onChangeText={(value) => handleChange('bathrooms', value)}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Area (sq ft)"
              value={formData.area}
              onChangeText={(value) => handleChange('area', value)}
              keyboardType="numeric"
            />
            <View style={styles.switchContainer}>
              <Switch
                value={formData.parking}
                onValueChange={(value) => handleChange('parking', value)}
                trackColor={{ false: '#d1d5db', true: '#3b82f6' }}
                thumbColor={formData.parking ? '#fff' : '#f4f4f5'}
              />
              <Text style={styles.switchLabel}>Parking Available</Text>
            </View>
            <View style={styles.switchContainer}>
              <Switch
                value={formData.furnished}
                onValueChange={(value) => handleChange('furnished', value)}
                trackColor={{ false: '#d1d5db', true: '#3b82f6' }}
                thumbColor={formData.furnished ? '#fff' : '#f4f4f5'}
              />
              <Text style={styles.switchLabel}>Furnished</Text>
            </View>
          </View>

          {/* Images */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Images</Text>
            <Text style={styles.helperText}>
              Upload up to 10 images. {formData.images.length}/10 used.
            </Text>
            <TouchableOpacity 
              onPress={pickImages} 
              style={[styles.imageButton, formData.images.length >= 10 && styles.buttonDisabled]}
              disabled={formData.images.length >= 10}
            >
              <Text style={styles.imageButtonText}>
                {formData.images.length >= 10 ? 'Max Images Reached' : 'Pick Images'}
              </Text>
            </TouchableOpacity>
            {formData.images.length > 0 && (
              <View style={styles.imageContainer}>
                {formData.images.map((img, index) => (
                  <View key={index} style={styles.imageWrapper}>
                    <Image source={{ uri: img.uri }} style={styles.image} />
                    <TouchableOpacity
                      onPress={() => removeImage(index)}
                      style={styles.removeImageButton}
                    >
                      <Text style={styles.removeImageText}>X</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Owner Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Owner Information</Text>
            <TextInput
              style={styles.input}
              placeholder="Owner Name"
              value={formData.ownerName}
              onChangeText={(value) => handleChange('ownerName', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Contact Number"
              value={formData.ownerContact}
              onChangeText={(value) => handleChange('ownerContact', value)}
              keyboardType="phone-pad"
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={formData.ownerEmail}
              onChangeText={(value) => handleChange('ownerEmail', value)}
              keyboardType="email-address"
            />
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonRow}>
            {/* <TouchableOpacity
              onPress={handleClose}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity> */}
            
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={loading}
              style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>
                  {initialData?._id ? 'Update Property' : 'Add Property'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#e5e7eb',
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  alertError: {
    backgroundColor: '#fee2e2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  alertTextError: {
    color: '#dc2626',
    fontSize: 14,
  },
  alertSuccess: {
    backgroundColor: '#d1fae5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  alertTextSuccess: {
    color: '#15803d',
    fontSize: 14,
  },
  alertWarning: {
    backgroundColor: '#fef3c7',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  alertTextWarning: {
    color: '#b45309',
    fontSize: 14,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    width: '100%',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerLabel: {
    fontSize: 16,
    color: '#4b5563',
    marginBottom: 4,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  picker: {
    height: Platform.OS === 'ios' ? 150 : 50,
    width: '100%',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  switchLabel: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  helperText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  imageButton: {
    padding: 12,
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonDisabled: {
    backgroundColor: '#9ca3af',
  },
  imageButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  imageWrapper: {
    marginRight: 8,
    marginBottom: 8,
    position: 'relative',
  },
  image: {
    width: width / 4 - 16,
    height: width / 4 - 16,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#dc2626',
    borderRadius: 12,
    padding: 4,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeImageText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  cancelButton: {
    backgroundColor: '#e5e7eb',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#4b5563',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#3b82f6',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginLeft: 8
  },
  submitButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PropertyForm;