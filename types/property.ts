export interface Property {
  _id: string;
  sellerId: string;
  title: string;
  description: string;
  price: number | string;
  type: string;
  approval?: string; 
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    latitude: number;
    longitude: number;
  };
  features: {
    bedrooms: number;
    bathrooms: number;
    area?: number;
    parking: boolean;
    furnished: boolean;
  };
  owner: {
    name: string;
    email: string;
    contact: string;
  };
  images?: Array<{ uri: string; type: string; name: string } | string>;
  status: string;
  isNew?: boolean;
  isVerified?: boolean;
  isFeatured?: boolean;
  createdAt?: string;
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  properties: number;
  rating: number;
  status: 'active' | 'inactive';
}

// export interface User {
//   id: string;
//   name: string;
//   email: string;
//   role: 'admin' | 'agent' | 'seller' | 'buyer';
//   status: 'active' | 'inactive';
//   createdAt: Date;
// }

// src/types/user.ts or similar file
export interface User {
  _id: string;
  fullName: string;
  email: string;
  contactNumber: string;
  role: 'admin' | 'agent' | 'seller' | 'buyer';
  status: 'pending' | 'active' | 'inactive'; // Add this line
}

// export interface PropertyFormProps {
//   visible: boolean;
//   onDismiss: () => void;
//   onSubmit: (data: Partial<Property>) => Promise<void>;
//   property?: Partial<Property>; // Optional property for editing existing properties
// }

export interface PropertyFormProps {
  visible: boolean;
  onDismiss: () => void;
  onSubmit: (data: Partial<Property>) => Promise<void>;
  property?: Partial<Property>; // Optional property for editing existing properties
}