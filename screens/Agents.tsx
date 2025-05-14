import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, FlatList, ActivityIndicator,
  StyleSheet, Alert, Modal, ScrollView, Dimensions, Platform, SafeAreaView
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { TextInput } from 'react-native-gesture-handler';
// Dynamic import for ESM compatibility
import * as TabViewModule from 'react-native-tab-view';
const { TabView, TabBar } = TabViewModule;
import { Ionicons } from '@expo/vector-icons';
import axiosInstance from '../services/axiosInstance';
import { useUserStore } from '../store/userStore';

// Get screen dimensions for responsive design
const { width, height } = Dimensions.get('window');

// Types
interface Agent {
  _id: string;
  name: string;
  email: string;
  phone: string;
  properties: number;
  rating: number;
  status: 'active' | 'inactive' | 'pending';
  role: 'agent' | 'seller' | 'admin';
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  role: 'agent' | 'seller' | 'admin';
  rating: number;
  status: 'active' | 'inactive' | 'pending';
}

// Define Tab Route type
interface TabRoute {
  key: string;
  title: string;
}

const AgentsTab: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [filteredAgents, setFilteredAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAgentModalVisible, setIsAgentModalVisible] = useState<boolean>(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    role: 'agent',
    rating: 0,
    status: 'active'
  });
  
  // Tab related state
  const [index, setIndex] = useState(0);
  const [routes] = useState<TabRoute[]>([
    { key: 'all', title: 'All Users' },
    { key: 'pending', title: 'Pending' },
    { key: 'active', title: 'Active' },
    { key: 'inactive', title: 'Inactive' },
  ]);

  useEffect(() => {
    fetchAgents();
  }, []);

  useEffect(() => {
    filterAgentsByTab(routes[index].key);
  }, [agents, index]);

  const fetchAgents = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get('/RealEstateUser/getAllAgentsAndSellers');
      setAgents(response.data.users || []);
      filterAgentsByTab(routes[index].key);
    } catch (err: any) {
      console.error('Error fetching agents and sellers:', err);
      setError('Failed to fetch agents and sellers. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const filterAgentsByTab = (tabKey: string) => {
    if (tabKey === 'all') {
      setFilteredAgents(agents);
    } else {
      setFilteredAgents(agents.filter(agent => agent.status === tabKey));
    }
  };

  const handleApprove = async (agent: Agent) => {
    try {
      setIsLoading(true);
      await axiosInstance.put(
        `/RealEstateUser/approveUser/${agent._id}`,
        { status: 'active' }
      );
      
      // Update local state
      setAgents(agents.map(item => 
        item._id === agent._id ? { ...item, status: 'active' } : item
      ));
      
      Alert.alert('Success', `${agent.role === 'agent' ? 'Agent' : 'Seller'} approved successfully`);
    } catch (err: any) {
      console.error('Error approving user:', err);
      Alert.alert('Error', 'Failed to approve user. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async (agent: Agent) => {
    try {
      setIsLoading(true);
      await axiosInstance.put(
        `/RealEstateUser/rejectUser/${agent._id}`,
        { status: 'inactive' }
      );
      
      // Update local state
      setAgents(agents.map(item => 
        item._id === agent._id ? { ...item, status: 'inactive' } : item
      ));
      
      Alert.alert('Success', `${agent.role === 'agent' ? 'Agent' : 'Seller'} rejected`);
    } catch (err: any) {
      console.error('Error rejecting user:', err);
      Alert.alert('Error', 'Failed to reject user. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePromoteToAdmin = async (userId: string, userName: string) => {
    try {
      const response = await axiosInstance.put(`/RealEstateUser/promote-to-admin/${userId}`);
      
      if (response.data.success) {
        Alert.alert('Success', `${userName} has been promoted to admin`);
        
        // Update local state
        setAgents(agents.map(agent => 
          agent._id === userId ? { ...agent, role: 'admin' } : agent
        ));
      }
    } catch (error: any) {
      console.error("Error promoting user:", error);
      Alert.alert('Error', error.response?.data?.message || "Failed to promote user");
    }
  };

  const handleEdit = (agent: Agent) => {
    setEditingAgent(agent);
    setFormData({
      name: agent.name,
      email: agent.email,
      phone: agent.phone,
      role: agent.role,
      rating: agent.rating,
      status: agent.status
    });
    setIsAgentModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this user?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            try {
              setIsLoading(true);
              await axiosInstance.delete(`/RealEstateUser/deleteUser/${id}`);
              
              // Update local state
              setAgents(agents.filter(agent => agent._id !== id));
              Alert.alert('Success', 'User deleted successfully');
            } catch (err: any) {
              console.error('Error deleting user:', err);
              Alert.alert('Error', 'Failed to delete user. Please try again.');
            } finally {
              setIsLoading(false);
            }
          }
        }
      ]
    );
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      Alert.alert('Validation Error', 'Name is required');
      return false;
    }
    
    if (!formData.email.trim()) {
      Alert.alert('Validation Error', 'Email is required');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Validation Error', 'Please enter a valid email');
      return false;
    }
    
    if (!formData.phone.trim()) {
      Alert.alert('Validation Error', 'Phone number is required');
      return false;
    }
    
    return true;
  };

  const handleAgentSubmit = async () => {
    if (!validateForm()) return;
    
    try {
      setIsLoading(true);

      if (editingAgent) {
        // Update existing agent/seller via API
        const response = await axiosInstance.put(
          `/RealEstateUser/updateUser/${editingAgent._id}`,
          formData
        );
        
        // Update local state
        setAgents(agents.map(agent => 
          agent._id === editingAgent._id ? { ...agent, ...formData } : agent
        ));
        
        Alert.alert('Success', `${editingAgent.role === 'agent' ? 'Agent' : 'Seller'} updated successfully`);
      } else {
        // Add new agent via API
        const response = await axiosInstance.post(
          `/api/v1/RealEstateUser/addUser`,
          { ...formData, properties: 0 }
        );
        
        // Update local state
        setAgents([...agents, response.data.user]);
        Alert.alert('Success', 'User added successfully');
      }

      setIsAgentModalVisible(false);
      setEditingAgent(null);
      resetForm();
    } catch (err: any) {
      console.error('Error submitting user:', err);
      Alert.alert('Error', 'Failed to save user. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'agent',
      rating: 0,
      status: 'active'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#52c41a'; // green
      case 'pending': return '#faad14'; // yellow
      case 'inactive': return '#f5222d'; // red
      default: return '#000000';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'agent': return '#1890ff'; // blue
      case 'seller': return '#722ed1'; // purple
      case 'admin': return '#faad14'; // gold
      default: return '#000000';
    }
  };

  // Define type for TabBar props
  interface TabBarProps {
    navigationState: {
      index: number;
      routes: TabRoute[];
    };
    position: any;
    jumpTo: (key: string) => void;
  }

  // Define type for renderLabel function params
  interface RenderLabelParams {
    route: TabRoute;
    focused: boolean;
    color: string;
  }

  const renderTabBar = (props: TabBarProps) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: '#1890ff' }}
      style={{ backgroundColor: 'white' }}
      labelStyle={{ color: '#000', fontWeight: '500' }}
      renderLabel={({ route, focused }: RenderLabelParams) => {
        let badgeCount = 0;
        if (route.key === 'pending') {
          badgeCount = agents.filter(agent => agent.status === 'pending').length;
        }
        
        return (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ color: focused ? '#1890ff' : '#000', fontSize: width < 350 ? 12 : 14 }}>
              {route.title}
            </Text>
            {badgeCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{badgeCount}</Text>
              </View>
            )}
          </View>
        );
      }}
    />
  );

  const renderScene = ({ route }: { route: TabRoute }) => {
    return (
      <FlatList
        data={filteredAgents}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => renderAgentCard(item)}
        contentContainerStyle={styles.listContent}
        refreshing={isLoading}
        onRefresh={fetchAgents}
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyList}>
              <Text style={styles.emptyText}>No users found</Text>
            </View>
          ) : null
        }
      />
    );
  };

  const renderAgentCard = (agent: Agent) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.nameText}>{agent.name}</Text>
          <View style={styles.roleContainer}>
            <View style={[styles.statusIndicator, { backgroundColor: getRoleColor(agent.role) }]} />
            <Text style={styles.roleText}>{agent.role.toUpperCase()}</Text>
          </View>
        </View>
        <View style={styles.statusContainer}>
          <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(agent.status) }]} />
          <Text style={styles.statusText}>{agent.status.toUpperCase()}</Text>
        </View>
      </View>
      
      <View style={styles.cardBody}>
        <Text style={styles.detailText}>Email: {agent.email}</Text>
        <Text style={styles.detailText}>Phone: {agent.phone}</Text>
        <Text style={styles.detailText}>Properties: {agent.properties}</Text>
        <Text style={styles.detailText}>Rating: {agent.rating} / 5</Text>
      </View>
      
      <View style={styles.cardActions}>
        {agent.status === 'pending' && (
          <View style={styles.actionButtonGroup}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.approveButton]} 
              onPress={() => handleApprove(agent)}
            >
              <Ionicons name="checkmark-circle" size={20} color="white" />
              <Text style={styles.buttonText}>Approve</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.rejectButton]} 
              onPress={() => handleReject(agent)}
            >
              <Ionicons name="close-circle" size={20} color="white" />
              <Text style={styles.buttonText}>Reject</Text>
            </TouchableOpacity>
          </View>
        )}
        
        <View style={styles.actionButtonGroup}>
          {agent.role !== 'admin' && agent.status === 'active' && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.adminButton]} 
              onPress={() => handlePromoteToAdmin(agent._id, agent.name)}
            >
              <Ionicons name="star" size={20} color="white" />
              <Text style={styles.buttonText}>Make Admin</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.editButton]} 
            onPress={() => handleEdit(agent)}
          >
            <Ionicons name="create-outline" size={20} color="white" />
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.deleteButton]} 
            onPress={() => handleDelete(agent._id)}
          >
            <Ionicons name="trash-outline" size={20} color="white" />
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderUserForm = () => (
    <ScrollView style={styles.formContainer}>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={formData.name}
          onChangeText={(text) => setFormData({...formData, name: text})}
          placeholder="Enter name"
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={formData.email}
          onChangeText={(text) => setFormData({...formData, email: text})}
          placeholder="Enter email"
          keyboardType="email-address"
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Phone</Text>
        <TextInput
          style={styles.input}
          value={formData.phone}
          onChangeText={(text) => setFormData({...formData, phone: text})}
          placeholder="Enter phone number"
          keyboardType="phone-pad"
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Role</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.role}
            onValueChange={(itemValue) => setFormData({...formData, role: itemValue as 'agent' | 'seller' | 'admin'})}
            style={styles.picker}
          >
            <Picker.Item label="Agent" value="agent" />
            <Picker.Item label="Seller" value="seller" />
            <Picker.Item label="Admin" value="admin" />
          </Picker>
        </View>
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Rating (0-5)</Text>
        <TextInput
          style={styles.input}
          value={formData.rating.toString()}
          onChangeText={(text) => {
            const rating = parseFloat(text);
            if (!isNaN(rating) && rating >= 0 && rating <= 5) {
              setFormData({...formData, rating});
            }
          }}
          placeholder="Enter rating"
          keyboardType="numeric"
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Status</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.status}
            onValueChange={(itemValue) => setFormData({...formData, status: itemValue as 'active' | 'inactive' | 'pending'})}
            style={styles.picker}
          >
            <Picker.Item label="Active" value="active" />
            <Picker.Item label="Pending" value="pending" />
            <Picker.Item label="Inactive" value="inactive" />
          </Picker>
        </View>
      </View>
    </ScrollView>
  );

  const renderModal = () => (
    <Modal
      visible={isAgentModalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => {
        setIsAgentModalVisible(false);
        setEditingAgent(null);
        resetForm();
      }}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {editingAgent ? `Edit ${editingAgent.role === 'agent' ? 'Agent' : 'Seller'}` : "Add New User"}
            </Text>
            <TouchableOpacity
              onPress={() => {
                setIsAgentModalVisible(false);
                setEditingAgent(null);
                resetForm();
              }}
            >
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>
          
          {renderUserForm()}
          
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => {
                setIsAgentModalVisible(false);
                setEditingAgent(null);
                resetForm();
              }}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.modalButton, styles.submitButton]}
              onPress={handleAgentSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.buttonText}>{editingAgent ? "Update" : "Add"}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  if (isLoading && agents.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1890ff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {error && <Text style={styles.errorText}>{error}</Text>}
      
      <View style={styles.header}>
        <Text style={styles.title}>User Management</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            setEditingAgent(null);
            resetForm();
            setIsAgentModalVisible(true);
          }}
        >
          <Ionicons name="add" size={24} color="white" />
          <Text style={styles.addButtonText}>Add User</Text>
        </TouchableOpacity>
      </View>
      
      {/* TabView for different statuses */}
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width }}
        renderTabBar={renderTabBar}
        style={styles.tabView}
      />
      
      {renderModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1890ff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  addButtonText: {
    color: '#fff',
    marginLeft: 4,
    fontWeight: '500',
  },
  errorText: {
    color: '#f5222d',
    padding: 16,
    textAlign: 'center',
  },
  tabView: {
    flex: 1,
  },
  listContent: {
    padding: 12,
  },
  emptyList: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  badge: {
    backgroundColor: '#ff4d4f',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  nameText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  cardBody: {
    marginBottom: 12,
  },
  detailText: {
    fontSize: 14,
    marginBottom: 4,
    color: '#333',
  },
  cardActions: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  actionButtonGroup: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginLeft: 8,
    marginBottom: 8,
  },
  approveButton: {
    backgroundColor: '#52c41a',
  },
  rejectButton: {
    backgroundColor: '#f5222d',
  },
  adminButton: {
    backgroundColor: '#faad14',
  },
  editButton: {
    backgroundColor: '#1890ff',
  },
  deleteButton: {
    backgroundColor: '#ff4d4f',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '500',
    marginLeft: 4,
    fontSize: width < 350 ? 12 : 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    width: width > 600 ? 500 : width * 0.9,
    maxHeight: height * 0.8,
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  formContainer: {
    maxHeight: height * 0.6,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d9d9d9',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#d9d9d9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  modalButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    minWidth: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: '#d9d9d9',
  },
  submitButton: {
    backgroundColor: '#1890ff',
  },
});

export default AgentsTab;