import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  SafeAreaView
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

// Define Property type
export interface Property {
  id: string;
  title: string;
  type: 'apartment' | 'house' | 'plot';
  // Add other property fields here
}

interface PropertyFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Property>) => void;
  property?: Property;
  initialValues?: Partial<Property>;
}

export const PropertyForm: React.FC<PropertyFormProps> = ({
  visible,
  onClose,
  onSubmit,
  property,
  initialValues,
}) => {
  // Combine initialValues with property data if available
  const defaultValues = {
    title: '',
    type: 'apartment' as const,
    ...initialValues,
    ...property,
  };

  const [formData, setFormData] = useState<Partial<Property>>(defaultValues);

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };
  
  const updateField = <K extends keyof Property>(field: K, value: Property[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <View style={styles.modalContent}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>
                {property ? 'Edit Property' : 'Add New Property'}
              </Text>
            </View>
            
            <ScrollView style={styles.formContainer}>
              <View style={styles.formRow}>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Title</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.title}
                    onChangeText={(text) => updateField('title', text)}
                    placeholder="Enter title"
                  />
                </View>
                
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Type</Text>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={formData.type}
                      onValueChange={(value) => updateField('type', value as Property['type'])}
                      style={styles.picker}
                    >
                      <Picker.Item label="Apartment" value="apartment" />
                      <Picker.Item label="House" value="house" />
                      <Picker.Item label="Plot" value="plot" />
                    </Picker>
                  </View>
                </View>
              </View>
              
              {/* Add more form fields here similar to above */}
            </ScrollView>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]} 
                onPress={onClose}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.button, styles.submitButton]} 
                onPress={handleSubmit}
              >
                <Text style={styles.submitButtonText}>
                  {property ? 'Update' : 'Add'} Property
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginHorizontal: width * 0.05,
    maxHeight: height * 0.8,
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 15,
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  formContainer: {
    maxHeight: height * 0.5,
  },
  formRow: {
    flexDirection: width > 500 ? 'row' : 'column', // Responsive layout
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  formGroup: {
    flex: 1,
    marginRight: width > 500 ? 10 : 0,
    marginBottom: width > 500 ? 0 : 15,
  },
  label: {
    marginBottom: 8,
    fontWeight: '500',
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
    gap: 10,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  submitButton: {
    backgroundColor: '#007AFF',
  },
  cancelButtonText: {
    color: '#333',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: '500',
  },
});