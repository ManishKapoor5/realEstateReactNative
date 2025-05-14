import { Property, Agent, User } from "@/types/property";

export const mockProperties: Property[] = [
  {
    id: 'prop-001',
    title: 'Luxury Apartment in Mumbai',
    type: 'Flat/Apartment',
    location: 'Mumbai',
    price: 12500000,
    status: 'available',
    bedrooms: 3,
    bathrooms: 2,
    area: 1450,
    createdAt: new Date('2025-03-12'),
    updatedAt: new Date('2025-04-01')
  },
  {
    id: 'prop-002',
    title: 'Villa with Garden in Bangalore',
    type: 'Villa',
    location: 'Bangalore',
    price: 22000000,
    status: 'available',
    bedrooms: 4,
    bathrooms: 3,
    area: 2800,
    createdAt: new Date('2025-02-15'),
    updatedAt: new Date('2025-03-25')
  },
  {
    id: 'prop-003',
    title: 'Commercial Plot in Delhi',
    type: 'Plot',
    location: 'Delhi',
    price: 35000000,
    status: 'sold',
    area: 5000,
    createdAt: new Date('2025-01-20'),
    updatedAt: new Date('2025-04-10')
  },
];

export const mockUsers: User[] = [
  {
    id: 'user-001',
    name: 'Raj Sharma',
    email: 'raj.sharma@example.com',
    role: 'admin',
    status: 'active',
    createdAt: new Date('2024-12-01')
  },
  {
    id: 'user-002',
    name: 'Priya Patel',
    email: 'priya.patel@example.com',
    role: 'agent',
    status: 'active',
    createdAt: new Date('2025-01-15')
  },
  {
    id: 'user-003',
    name: 'Arjun Singh',
    email: 'arjun.singh@example.com',
    role: 'seller',
    status: 'inactive',
    createdAt: new Date('2025-02-20')
  },
];

export const mockAgents: Agent[] = [
  {
    id: 'agent-001',
    name: 'Vivek Kumar',
    email: 'vivek.kumar@legacyland.com',
    phone: '+91 98765 43210',
    properties: 24,
    rating: 4.8,
    status: 'active'
  },
  {
    id: 'agent-002',
    name: 'Neha Verma',
    email: 'neha.verma@legacyland.com',
    phone: '+91 98765 12345',
    properties: 18,
    rating: 4.5,
    status: 'active'
  },
  {
    id: 'agent-003',
    name: 'Suresh Reddy',
    email: 'suresh.reddy@legacyland.com',
    phone: '+91 87654 32109',
    properties: 12,
    rating: 4.2,
    status: 'inactive'
  },
];
