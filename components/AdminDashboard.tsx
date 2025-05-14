// // Admin Dashboard Component for Legacy Land Real Estate
// // This file includes the main admin dashboard UI and related functionality

import React, { useState, useEffect } from 'react';
import { 
  Table, Button, Input, Modal, Form, Select, 
  Tag, Tabs, Spin, message, Upload, Dropdown, Menu, 
  Statistic, Card, Row, Col, DatePicker, Space 
} from 'antd';
import { 
  HomeOutlined, UserOutlined, SettingOutlined, 
  UploadOutlined, BarsOutlined, PlusOutlined,
  EditOutlined, DeleteOutlined, SearchOutlined,
  ExportOutlined, ImportOutlined, FilterOutlined,
  LineChartOutlined, BarChartOutlined, PieChartOutlined
} from '@ant-design/icons';
import { Switch } from 'antd';
import type { UploadProps } from 'antd';
import type { TabsProps } from 'antd';
import type { MenuProps } from 'antd';

// Types
interface Property {
  id: string;
  title: string;
  type: string;
  location: string;
  price: number;
  status: 'available' | 'sold' | 'rented';
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  featuredImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'agent' | 'seller' | 'buyer';
  status: 'active' | 'inactive';
  createdAt: Date;
}

interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  properties: number;
  rating: number;
  status: 'active' | 'inactive';
}

// Mock data - would be fetched from API in real application
const mockProperties: Property[] = [
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

const mockUsers: User[] = [
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

const mockAgents: Agent[] = [
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

// Admin Dashboard Component
const AdminDashboard: React.FC = () => {
  // State
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [properties, setProperties] = useState<Property[]>(mockProperties);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [agents, setAgents] = useState<Agent[]>(mockAgents);
  const [isPropertyModalVisible, setIsPropertyModalVisible] = useState<boolean>(false);
  const [isUserModalVisible, setIsUserModalVisible] = useState<boolean>(false);
  const [isAgentModalVisible, setIsAgentModalVisible] = useState<boolean>(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [propertyForm] = Form.useForm();
  const [userForm] = Form.useForm();
  const [agentForm] = Form.useForm();
  const [searchText, setSearchText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [data, setData] = useState<Property[]>([])
    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get(`https://realestatesite-backend.onrender.com/api/v1/Property/getAll`);
            // Handle the response if needed
            setData(response.data.properties)
        };
        fetchData();
    }, []);
  // Tabs configuration
  const tabItems: TabsProps['items'] = [
    {
      key: 'dashboard',
      label: (
        <span>
          <LineChartOutlined />
          Dashboard
        </span>
      ),
      children: <DashboardTab properties={properties} users={users} data={data} agents={agents} />,
    },
    {
      key: 'properties',
      label: (
        <span>
          <HomeOutlined />
          Properties
        </span>
      ),
      children: (
        <PropertiesTab 
          properties={properties} 
          onEdit={handleEditProperty} 
          onDelete={handleDeleteProperty}
          onAdd={() => {
            setEditingProperty(null);
            setIsPropertyModalVisible(true);
          }}
          searchText={searchText}
          setSearchText={setSearchText}
        />
      ),
    },
    {
      key: 'users',
      label: (
        <span>
          <UserOutlined />
          Users
        </span>
      ),
      children: (
        <UsersTab 
          users={users} 
          onEdit={handleEditUser} 
          onDelete={handleDeleteUser}
          onAdd={() => {
            setEditingUser(null);
            setIsUserModalVisible(true);
          }}
        />
      ),
    },
    {
      key: 'agents',
      label: (
        <span>
          <UserOutlined />
          Agents
        </span>
      ),
      children: (
        <AgentsTab 
          agents={agents} 
          onEdit={handleEditAgent} 
          onDelete={handleDeleteAgent}
          onAdd={() => {
            setEditingAgent(null);
            setIsAgentModalVisible(true);
          }}
        />
      ),
    },
    {
      key: 'settings',
      label: (
        <span>
          <SettingOutlined />
          Settings
        </span>
      ),
      children: <SettingsTab />,
    },
  ];

  // Handle tab change
  const handleTabChange = (activeKey: string) => {
    setActiveTab(activeKey);
  };

  // Property handlers
  function handleEditProperty(property: Property) {
    setEditingProperty(property);
    propertyForm.setFieldsValue({
      title: property.title,
      type: property.type,
      location: property.location,
      price: property.price,
      status: property.status,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      area: property.area,
    });
    setIsPropertyModalVisible(true);
  }

  function handleDeleteProperty(propertyId: string) {
    Modal.confirm({
      title: 'Are you sure you want to delete this property?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        setProperties(properties.filter(property => property.id !== propertyId));
        message.success('Property deleted successfully');
      },
    });
  }

  const handlePropertySubmit = () => {
    propertyForm.validateFields().then((values: Partial<Omit<Property, 'id' | 'createdAt' | 'updatedAt'>>) => {
      setIsLoading(true);
      
      setTimeout(() => {
      if (editingProperty) {
        // Update existing property
        setProperties(properties.map((property: Property) => 
        property.id === editingProperty.id 
          ? { ...property, ...values, updatedAt: new Date() } 
          : property
        ));
        message.success('Property updated successfully');
      } else {
        // Add new property
        const newProperty: Property = {
        id: `prop-${(Math.floor(Math.random() * 1000)).toString().padStart(3, '0')}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...values
        } as Property;
        setProperties([...properties, newProperty]);
        message.success('Property added successfully');
      }
      
      setIsLoading(false);
      setIsPropertyModalVisible(false);
      propertyForm.resetFields();
      }, 1000);
    });
  };

  // User handlers
  function handleEditUser(user: User) {
    setEditingUser(user);
    userForm.setFieldsValue({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    });
    setIsUserModalVisible(true);
  }

  function handleDeleteUser(userId: string) {
    Modal.confirm({
      title: 'Are you sure you want to delete this user?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        setUsers(users.filter(user => user.id !== userId));
        message.success('User deleted successfully');
      },
    });
  }

  const handleUserSubmit = () => {
    userForm.validateFields().then((values: Partial<Omit<User, 'id' | 'createdAt'>>) => {
      setIsLoading(true);
      
      setTimeout(() => {
      if (editingUser) {
        // Update existing user
        setUsers(users.map((user: User) => 
        user.id === editingUser.id 
              ? { ...user, ...values } 
              : user
          ));
          message.success('User updated successfully');
        } else {
          // Add new user
          const newUser: User = {
            id: `user-${(Math.floor(Math.random() * 1000)).toString().padStart(3, '0')}`,
            createdAt: new Date(),
            ...values
          };
          setUsers([...users, newUser]);
          message.success('User added successfully');
        }
        
        setIsLoading(false);
        setIsUserModalVisible(false);
        userForm.resetFields();
      }, 1000);
    });
  };

  // Agent handlers
  function handleEditAgent(agent: Agent) {
    setEditingAgent(agent);
    agentForm.setFieldsValue({
      name: agent.name,
      email: agent.email,
      phone: agent.phone,
      status: agent.status,
      rating: agent.rating,
    });
    setIsAgentModalVisible(true);
  }

  function handleDeleteAgent(agentId: string) {
    Modal.confirm({
      title: 'Are you sure you want to delete this agent?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        setAgents(agents.filter(agent => agent.id !== agentId));
        message.success('Agent deleted successfully');
      },
    });
  }

  const handleAgentSubmit = () => {
    agentForm.validateFields().then(values => {
      setIsLoading(true);
      
      setTimeout(() => {
        if (editingAgent) {
          // Update existing agent
          setAgents(agents.map(agent => 
            agent.id === editingAgent.id 
              ? { ...agent, ...values } 
              : agent
          ));
          message.success('Agent updated successfully');
        } else {
          // Add new agent
          const newAgent: Agent = {
            id: `agent-${(Math.floor(Math.random() * 1000)).toString().padStart(3, '0')}`,
            properties: 0,
            ...values
          };
          setAgents([...agents, newAgent]);
          message.success('Agent added successfully');
        }
        
        setIsLoading(false);
        setIsAgentModalVisible(false);
        agentForm.resetFields();
      }, 1000);
    });
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="logo">
          <HomeOutlined /> Legacy Land Admin
        </div>
        <div className="header-actions">
          <Button type="text" icon={<UserOutlined />}>Admin</Button>
          <Button type="text">Logout</Button>
        </div>
      </header>

      <Tabs 
        activeKey={activeTab} 
        onChange={handleTabChange} 
        type="card"
        className="admin-tabs"
        items={tabItems}
      />
      
      {/* Property Modal */}
      <Modal
        title={editingProperty ? "Edit Property" : "Add New Property"}
        open={isPropertyModalVisible}
        onCancel={() => setIsPropertyModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsPropertyModalVisible(false)}>
            Cancel
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            loading={isLoading} 
            onClick={handlePropertySubmit}
          >
            {editingProperty ? "Update" : "Add"}
          </Button>
        ]}
        width={800}
      >
        <Form
          form={propertyForm}
          layout="vertical"
          name="propertyForm"
        >
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="title"
                label="Property Title"
                rules={[{ required: true, message: 'Please enter property title' }]}
              >
                <Input placeholder="Enter property title" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="type"
                label="Property Type"
                rules={[{ required: true, message: 'Please select property type' }]}
              >
                <Select placeholder="Select property type">
                  <Select.Option value="Flat/Apartment">Flat/Apartment</Select.Option>
                  <Select.Option value="Villa">Villa</Select.Option>
                  <Select.Option value="Builder Floor">Builder Floor</Select.Option>
                  <Select.Option value="Plot">Plot</Select.Option>
                  <Select.Option value="Independent House">Independent House</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="location"
                label="Location"
                rules={[{ required: true, message: 'Please enter location' }]}
              >
                <Input placeholder="Enter location" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="price"
                label="Price (₹)"
                rules={[{ required: true, message: 'Please enter price' }]}
              >
                <Input type="number" placeholder="Enter price" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true, message: 'Please select status' }]}
              >
                <Select placeholder="Select status">
                  <Select.Option value="available">Available</Select.Option>
                  <Select.Option value="sold">Sold</Select.Option>
                  <Select.Option value="rented">Rented</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="bedrooms"
                label="Bedrooms"
              >
                <Input type="number" placeholder="Enter bedrooms" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="bathrooms"
                label="Bathrooms"
              >
                <Input type="number" placeholder="Enter bathrooms" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="area"
                label="Area (sq ft)"
              >
                <Input type="number" placeholder="Enter area" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="featuredImage"
                label="Featured Image"
              >
                <Upload
                  listType="picture-card"
                  maxCount={1}
                  beforeUpload={() => false}
                >
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* User Modal */}
      <Modal
        title={editingUser ? "Edit User" : "Add New User"}
        open={isUserModalVisible}
        onCancel={() => setIsUserModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsUserModalVisible(false)}>
            Cancel
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            loading={isLoading} 
            onClick={handleUserSubmit}
          >
            {editingUser ? "Update" : "Add"}
          </Button>
        ]}
      >
        <Form
          form={userForm}
          layout="vertical"
          name="userForm"
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please enter name' }]}
          >
            <Input placeholder="Enter name" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input placeholder="Enter email" />
          </Form.Item>
          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: 'Please select role' }]}
          >
            <Select placeholder="Select role">
              <Select.Option value="admin">Admin</Select.Option>
              <Select.Option value="agent">Agent</Select.Option>
              <Select.Option value="seller">Seller</Select.Option>
              <Select.Option value="buyer">Buyer</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select status' }]}
          >
            <Select placeholder="Select status">
              <Select.Option value="active">Active</Select.Option>
              <Select.Option value="inactive">Inactive</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Agent Modal */}
      <Modal
        title={editingAgent ? "Edit Agent" : "Add New Agent"}
        open={isAgentModalVisible}
        onCancel={() => setIsAgentModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsAgentModalVisible(false)}>
            Cancel
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            loading={isLoading} 
            onClick={handleAgentSubmit}
          >
            {editingAgent ? "Update" : "Add"}
          </Button>
        ]}
      >
        <Form
          form={agentForm}
          layout="vertical"
          name="agentForm"
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please enter name' }]}
          >
            <Input placeholder="Enter name" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input placeholder="Enter email" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone"
            rules={[{ required: true, message: 'Please enter phone number' }]}
          >
            <Input placeholder="Enter phone number" />
          </Form.Item>
          <Form.Item
            name="rating"
            label="Rating"
            rules={[{ required: true, message: 'Please enter rating' }]}
          >
            <Input type="number" min={0} max={5} step={0.1} placeholder="Enter rating (0-5)" />
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select status' }]}
          >
            <Select placeholder="Select status">
              <Select.Option value="active">Active</Select.Option>
              <Select.Option value="inactive">Inactive</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

// Dashboard Tab Component
const DashboardTab: React.FC<{ 
  data,
  properties: Property[],
  users: User[],
  agents: Agent[]
}> = ({ properties, users, data, agents }) => {
  // Calculate statistics
  const totalProperties = data.length
  const availableProperties = properties.filter(p => p.status === 'available').length;
  const soldProperties = properties.filter(p => p.status === 'sold').length;
  const activeAgents = agents.filter(a => a.status === 'active').length;
  
  // Calculate total value
  const totalValue = properties.reduce((sum, property) => sum + property.price, 0);
  
  return (
    <div className="dashboard-tab">
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Properties"
              value={totalProperties}
              prefix={<HomeOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Available Properties"
              value={availableProperties}
              prefix={<HomeOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Sold Properties"
              value={soldProperties}
              prefix={<HomeOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Active Agents"
              value={activeAgents}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} md={12}>
          <Card title="Total Property Value">
            <Statistic
              value={totalValue}
              prefix="₹"
              formatter={(value) => `${(Number(value) / 10000000).toFixed(2)} Cr`}
            />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Recent Sales">
            <Table
              dataSource={properties.filter(p => p.status === 'sold').slice(0, 5)}
              columns={[
                { title: 'Title', dataIndex: 'title', key: 'title' },
                { title: 'Location', dataIndex: 'location', key: 'location' },
                { 
                  title: 'Price', 
                  dataIndex: 'price', 
                  key: 'price',
                  render: (price) => `₹${(price / 100000).toFixed(2)} L` 
                },
              ]}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card title="Recent Activity">
            <ul className="activity-list">
              <li><strong>Admin:</strong> Updated property "Luxury Apartment in Mumbai" (2 hours ago)</li>
              <li><strong>System:</strong> New user registration - Ankit Joshi (5 hours ago)</li>
              <li><strong>Agent Neha Verma:</strong> Added new property "Penthouse in Hyderabad" (Yesterday)</li>
              <li><strong>System:</strong> Property "Commercial Plot in Delhi" marked as sold (2 days ago)</li>
              <li><strong>Admin:</strong> Added new agent "Suresh Reddy" (3 days ago)</li>
            </ul>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

// Properties Tab Component
const PropertiesTab: React.FC<{ 
  properties: Property[],
  onEdit: (property: Property) => void,
  onDelete: (propertyId: string) => void,
  onAdd: () => void,
  searchText: string,
  setSearchText: (text: string) => void
}> = ({ properties, onEdit, onDelete, onAdd, searchText, setSearchText }) => {
  
  // Filter properties based on search text
  const filteredProperties = properties.filter(
    property => 
      property.title.toLowerCase().includes(searchText.toLowerCase()) ||
      property.location.toLowerCase().includes(searchText.toLowerCase()) ||
      property.type.toLowerCase().includes(searchText.toLowerCase())
  );
  
  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      sorter: (a: Property, b: Property) => a.title.localeCompare(b.title),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      filters: [
        { text: 'Flat/Apartment', value: 'Flat/Apartment' },
        { text: 'Villa', value: 'Villa' },
        { text: 'Builder Floor', value: 'Builder Floor' },
        { text: 'Plot', value: 'Plot' },
        { text: 'Independent House', value: 'Independent House' },
      ],
      onFilter: (value: string, record: Property) => record.type === value,
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Price (₹)',
      dataIndex: 'price',
      key: 'price',
      sorter: (a: Property, b: Property) => a.price - b.price,
      render: (price: number) => `${(price / 100000).toFixed(2)} L`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Available', value: 'available' },
        { text: 'Sold', value: 'sold' },
        { text: 'Rented', value: 'rented' },
      ],
      onFilter: (value: string, record: Property) => record.status === value,
      render: (status: string) => {
        let color = 'green';
        if (status === 'sold') {
          color = 'red';
        } else if (status === 'rented') {
          color = 'blue';
        }
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Last Updated',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      sorter: (a: Property, b: Property) => a.updatedAt.getTime() - b.updatedAt.getTime(),
      render: (date: Date) => date.toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Property) => (
        <Space>
          <Button 
            icon={<EditOutlined />} 
            onClick={() => onEdit(record)}
            size="small"
          />
          <Button 
            icon={<DeleteOutlined />} 
            danger 
            onClick={() => onDelete(record.id)}
            size="small"
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="properties-tab">
      <div className="table-actions">
        <Input
          placeholder="Search properties..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
        <div>
          <Button icon={<ExportOutlined />} style={{ marginRight: 8 }}>Export</Button>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={onAdd}
          >
            Add Property
          </Button>
        </div>
      </div>
      <Table 
        dataSource={filteredProperties} 
        columns={columns} 
        rowKey="id"
        pagination={{ pageSize: 10 }}
        scroll={{ x: true }}
      />
    </div>
  );
};

// Users Tab Component
const UsersTab: React.FC<{ 
  users: User[],
  onEdit: (user: User) => void,
  onDelete: (userId: string) => void,
  onAdd: () => void
}> = ({ users, onEdit, onDelete, onAdd }) => {
  
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: User, b: User) => a.name.localeCompare(b.name),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      filters: [
        { text: 'Admin', value: 'admin' },
        { text: 'Agent', value: 'agent' },
        { text: 'Seller', value: 'seller' },
        { text: 'Buyer', value: 'buyer' },
      ],
      onFilter: (value: string, record: User) => record.role === value,
      render: (role: string) => {
        const colors: Record<string, string> = {
          admin: 'purple',
          agent: 'blue',
          seller: 'green',
          buyer: 'orange'
        };
        
        return <Tag color={colors[role]}>{role.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Active', value: 'active' },
        { text: 'Inactive', value: 'inactive' },
      ],
      onFilter: (value: string, record: User) => record.status === value,
      render: (status: string) => {
        return (
          <Tag color={status === 'active' ? 'green' : 'red'}>
            {status.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: 'Registration Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a: User, b: User) => a.createdAt.getTime() - b.createdAt.getTime(),
      render: (date: Date) => date.toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: User) => (
        <Space>
          <Button 
            icon={<EditOutlined />} 
            onClick={() => onEdit(record)}
            size="small"
          />
          <Button 
            icon={<DeleteOutlined />} 
            danger 
            onClick={() => onDelete(record.id)}
            size="small"
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="users-tab">
      <div className="table-actions">
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={onAdd}
          style={{ marginBottom: 16 }}
        >
          Add User
        </Button>
      </div>
      <Table 
        dataSource={users} 
        columns={columns} 
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

// Agents Tab Component
const AgentsTab: React.FC<{ 
  agents: Agent[],
  onEdit: (agent: Agent) => void,
  onDelete: (agentId: string) => void,
  onAdd: () => void
}> = ({ agents, onEdit, onDelete, onAdd }) => {
  
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: Agent, b: Agent) => a.name.localeCompare(b.name),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Properties',
      dataIndex: 'properties',
      key: 'properties',
      sorter: (a: Agent, b: Agent) => a.properties - b.properties,
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      sorter: (a: Agent, b: Agent) => a.rating - b.rating,
      render: (rating: number) => {
        return (
          <span>
            {rating} / 5
          </span>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Active', value: 'active' },
        { text: 'Inactive', value: 'inactive' },
      ],
      onFilter: (value: string, record: Agent) => record.status === value,
      render: (status: string) => {
        return (
          <Tag color={status === 'active' ? 'green' : 'red'}>
            {status.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Agent) => (
        <Space>
          <Button 
            icon={<EditOutlined />} 
            onClick={() => onEdit(record)}
            size="small"
          />
          <Button 
            icon={<DeleteOutlined />} 
            danger 
            onClick={() => onDelete(record.id)}
            size="small"
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="agents-tab">
      <div className="table-actions">
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={onAdd}
          style={{ marginBottom: 16 }}
        >
          Add Agent
        </Button>
      </div>
      <Table 
        dataSource={agents} 
        columns={columns} 
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

// Settings Tab Component
const SettingsTab: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    form.validateFields().then(() => {
      setLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        message.success('Settings updated successfully');
        setLoading(false);
      }, 1000);
    });
  };

  return (
    <div className="settings-tab">
      <Card title="General Settings">
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            siteName: 'Legacy Land Real Estate',
            siteDescription: 'Find Your Dream Property in India',
            contactEmail: 'admin@legacyland.com',
            contactPhone: '+91 98765 43210',
            autoApprove: false,
            maxFileSize: 5,
            currencySymbol: '₹',
            defaultLanguage: 'en',
            resultsPerPage: 10
          }}
        >
          <Tabs defaultActiveKey="general">
            <Tabs.TabPane tab="General" key="general">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Site Name"
                    name="siteName"
                    rules={[{ required: true, message: 'Please enter site name' }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Site Description"
                    name="siteDescription"
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Contact Email"
                    name="contactEmail"
                    rules={[
                      { required: true, message: 'Please enter contact email' },
                      { type: 'email', message: 'Please enter a valid email' }
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Contact Phone"
                    name="contactPhone"
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
            </Tabs.TabPane>
            <Tabs.TabPane tab="Properties" key="properties">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Auto-approve Property Listings"
                    name="autoApprove"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Max Image Upload Size (MB)"
                    name="maxFileSize"
                  >
                    <Input type="number" min={1} max={20} />
                  </Form.Item>
                </Col>
              </Row>
            </Tabs.TabPane>
            <Tabs.TabPane tab="Display" key="display">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Currency Symbol"
                    name="currencySymbol"
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Default Language"
                    name="defaultLanguage"
                  >
                    <Select>
                      <Select.Option value="en">English</Select.Option>
                      <Select.Option value="hi">Hindi</Select.Option>
                      <Select.Option value="ta">Tamil</Select.Option>
                      <Select.Option value="te">Telugu</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Results Per Page"
                    name="resultsPerPage"
                  >
                    <Select>
                      <Select.Option value={10}>10</Select.Option>
                      <Select.Option value={20}>20</Select.Option>
                      <Select.Option value={50}>50</Select.Option>
                      <Select.Option value={100}>100</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Tabs.TabPane>
          </Tabs>
          
          <div style={{ marginTop: 24, textAlign: 'right' }}>
            <Button style={{ marginRight: 8 }}>Reset</Button>
            <Button type="primary" loading={loading} onClick={handleSubmit}>
              Save Settings
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

// // Add CSS for the admin dashboard
import axios from 'axios';

// Export the component
export default AdminDashboard;