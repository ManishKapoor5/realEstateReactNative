import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Picker as PickerComponent } from '@react-native-picker/picker';
import { MaterialIcons } from '@expo/vector-icons';

// Define a custom type for Picker to ensure JSX compatibility
interface PickerWithItem {
  (props: any): JSX.Element;
  Item: React.ComponentType<any>;
}

// Cast Picker to ensure it's treated as a JSX component with Item
const Picker = PickerComponent as unknown as PickerWithItem;

interface CitySelectorProps {
  onSelect: (value: string) => void;
  defaultValue?: string;
}

const CitySelector: React.FC<CitySelectorProps> = ({ onSelect, defaultValue }) => {
  return (
    <View style={styles.container}>
      <MaterialIcons name="location-pin" size={16} color="#2563EB" style={styles.icon} />
      <Picker
        selectedValue={defaultValue}
        onValueChange={(value: string) => onSelect(value)}
        style={styles.picker}
        dropdownIconColor="#6B7280"
      >
        <Picker.Item label="Select city" value="" enabled={false} />
        <Picker.Item label="Delhi NCR" value="delhi" />
        <Picker.Item label="Mumbai" value="mumbai" />
        <Picker.Item label="Bangalore" value="bangalore" />
        <Picker.Item label="Hyderabad" value="hyderabad" />
        <Picker.Item label="Pune" value="pune" />
        <Picker.Item label="Chennai" value="chennai" />
        <Picker.Item label="Kolkata" value="kolkata" />
        <Picker.Item label="Ahmedabad" value="ahmedabad" />
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: '#FFF',
    paddingHorizontal: 12,
    height: 48,
  },
  icon: {
    marginRight: 8,
  },
  picker: {
    flex: 1,
    color: '#111827',
    fontSize: 16,
  },
});

export default CitySelector;