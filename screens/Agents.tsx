// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   FlatList,
//   ActivityIndicator,
//   Alert,
//   useWindowDimensions,
//   SafeAreaView,
//   Modal,
//   KeyboardAvoidingView,
//   Platform
// } from 'react-native';
// import { TextInput } from 'react-native-gesture-handler';
// import Icon from 'react-native-vector-icons/AntDesign';
// import { Picker } from '@react-native-picker/picker';
// import axiosInstance from '../services/axiosInstance';

// // Types
// interface Agent {
//   _id: string;
//   name: string;
//   email: string;
//   phone: string;
//   properties: number;
//   rating: number;
//   status: 'active' | 'inactive' | 'pending';
//   role: 'agent' | 'seller' | 'admin';
// }

// interface FormValues {
//   name: string;
//   email: string;
//   phone: string;
//   role: 'agent' | 'seller' | 'admin';
//   rating: number;
//   status: 'active' | 'inactive' | 'pending';
// }

// const AgentsTab: React.FC = () => {
//   const [isAgentModalVisible, setIsAgentModalVisible] = useState<boolean>(false);
//   const [formValues, setFormValues] = useState<FormValues>({
//     name: '',
//     email: '',
//     phone: '',
//     role: 'agent',
//     rating: 0,
//     status: 'active'
//   });
//   const [agents, setAgents] = useState<Agent[]>([]);
//   const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [currentTab, setCurrentTab] = useState<string>('all'); // 'all', 'pending', 'active', 'inactive'
//   const { width } = useWindowDimensions();
  
//   // Fetch agents from API on mount
//   useEffect(() => {
//     fetchAgents();
//   }, []);

//   const fetchAgents = async () => {
//     try {
//       setIsLoading(true);
//       const response = await axiosInstance.get('/RealEstateUser/getAllAgentsAndSellers');
//       console.log('API agents/sellers data:', response.data);
//       setAgents(response.data.users || []);
//     } catch (err: any) {
//       console.error('Error fetching agents and sellers:', err);
//       setError('Failed to fetch agents and sellers. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handle approval of pending agent/seller
//   const handleApprove = async (record: Agent) => {
//     try {
//       setIsLoading(true);
//       await axiosInstance.put(
//         `/RealEstateUser/approveUser/${record._id}`,
//         { status: 'active' }
//       );
      
//       // Update local state
//       setAgents(agents.map(agent => 
//         agent._id === record._id ? { ...agent, status: 'active' } : agent
//       ));
      
//       Alert.alert('Success', `${record.role === 'agent' ? 'Agent' : 'Seller'} approved successfully`);
//     } catch (err: any) {
//       console.error('Error approving user:', err);
//       Alert.alert('Error', 'Failed to approve user. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handle rejection of pending agent/seller
//   const handleReject = async (record: Agent) => {
//     try {
//       setIsLoading(true);
//       await axiosInstance.put(
//         `/RealEstateUser/rejectUser/${record._id}`,
//         { status: 'inactive' }
//       );
      
//       // Update local state
//       setAgents(agents.map(agent => 
//         agent._id === record._id ? { ...agent, status: 'inactive' } : agent
//       ));
      
//       Alert.alert('Success', `${record.role === 'agent' ? 'Agent' : 'Seller'} rejected`);
//     } catch (err: any) {
//       console.error('Error rejecting user:', err);
//       Alert.alert('Error', 'Failed to reject user. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handle promotion to admin
//   const handlePromoteToAdmin = async (userId: string, userName: string) => {
//     try {
//       const response = await axiosInstance.put(`/RealEstateUser/promote-to-admin/${userId}`);
      
//       if (response.data.success) {
//         Alert.alert('Success', `${userName} has been promoted to admin`);
        
//         // Update local state to show role change immediately
//         setAgents(agents.map(agent => 
//           agent._id === userId ? { ...agent, role: 'admin' } : agent
//         ));
//       }
//     } catch (error: any) {
//       console.error("Error promoting user:", error);
//       Alert.alert('Error', error.response?.data?.message || "Failed to promote user");
//     }
//   };

//   // Handle modification of agent/seller details
//   const handleEdit = (record: Agent) => {
//     setEditingAgent(record);
//     setFormValues({
//       name: record.name,
//       email: record.email,
//       phone: record.phone,
//       role: record.role,
//       rating: record.rating,
//       status: record.status
//     });
//     setIsAgentModalVisible(true);
//   };

//   // Handle deletion of agent/seller
//   const handleDelete = async (id: string) => {
//     Alert.alert(
//       "Confirm Delete",
//       "Are you sure you want to delete this user?",
//       [
//         { 
//           text: "Cancel", 
//           style: "cancel" 
//         },
//         { 
//           text: "Delete", 
//           style: "destructive",
//           onPress: async () => {
//             try {
//               setIsLoading(true);
//               await axiosInstance.delete(`/RealEstateUser/deleteUser/${id}`);
              
//               // Update local state
//               setAgents(agents.filter(agent => agent._id !== id));
//               Alert.alert('Success', 'User deleted successfully');
//             } catch (err: any) {
//               console.error('Error deleting user:', err);
//               Alert.alert('Error', 'Failed to delete user. Please try again.');
//             } finally {
//               setIsLoading(false);
//             }
//           }
//         }
//       ]
//     );
//   };

//   // Form submission handler
//   const handleAgentSubmit = async () => {
//     // Basic validation
//     if (!formValues.name || !formValues.email || !formValues.phone) {
//       Alert.alert('Validation Error', 'Please fill all required fields');
//       return;
//     }

//     try {
//       setIsLoading(true);

//       if (editingAgent) {
//         // Update existing agent/seller via API
//         const response = await axiosInstance.put(
//           `/RealEstateUser/updateUser/${editingAgent._id}`,
//           formValues
//         );
        
//         // Update local state
//         setAgents(agents.map(agent => 
//           agent._id === editingAgent._id ? { ...agent, ...formValues } : agent
//         ));
        
//         Alert.alert('Success', `${editingAgent.role === 'agent' ? 'Agent' : 'Seller'} updated successfully`);
//       } else {
//         // Add new agent via API
//         const response = await axiosInstance.post(
//           `/api/v1/RealEstateUser/addUser`,
//           { ...formValues, properties: 0 }
//         );
        
//         // Update local state
//         setAgents([...agents, response.data.user]);
//         Alert.alert('Success', 'User added successfully');
//       }

//       setIsAgentModalVisible(false);
//       setEditingAgent(null);
//       setFormValues({
//         name: '',
//         email: '',
//         phone: '',
//         role: 'agent',
//         rating: 0,
//         status: 'active'
//       });
//     } catch (err: any) {
//       console.error('Error submitting user:', err);
//       Alert.alert('Error', 'Failed to save user. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Filter agents/sellers based on selected tab
//   const getFilteredAgents = () => {
//     if (currentTab === 'all') return agents;
//     return agents.filter(agent => agent.status === currentTab);
//   };

//   // Render tab indicator with badge for pending items
//   const renderTabIndicator = () => {
//     const pendingCount = agents.filter(agent => agent.status === 'pending').length;

//     return (
//       <View style={styles.tabContainer}>
//         {['all', 'pending', 'active', 'inactive'].map(tab => (
//           <TouchableOpacity
//             key={tab}
//             style={[
//               styles.tabButton,
//               currentTab === tab && styles.activeTabButton
//             ]}
//             onPress={() => setCurrentTab(tab)}
//           >
//             <Text style={[
//               styles.tabButtonText,
//               currentTab === tab && styles.activeTabButtonText
//             ]}>
//               {tab.charAt(0).toUpperCase() + tab.slice(1)}
//               {tab === 'pending' && pendingCount > 0 ? ` (${pendingCount})` : ''}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </View>
//     );
//   };

//   // Render status badge based on status
//   const renderStatusBadge = (status: string) => {
//     let badgeColor = '#52c41a'; // green for active
//     if (status === 'pending') badgeColor = '#faad14'; // gold for pending
//     if (status === 'inactive') badgeColor = '#f5222d'; // red for inactive
    
//     return (
//       <View style={styles.badgeContainer}>
//         <View style={[styles.statusDot, { backgroundColor: badgeColor }]} />
//         <Text style={styles.statusText}>{status.toUpperCase()}</Text>
//       </View>
//     );
//   };

//   // Render role tag
//   const renderRoleTag = (role: string) => {
//     let tagColor = '#722ed1'; // purple for default
//     if (role === 'agent') tagColor = '#1890ff'; // blue for agent
//     if (role === 'admin') tagColor = '#faad14'; // gold for admin
    
//     return (
//       <View style={[styles.roleTag, { backgroundColor: tagColor }]}>
//         <Text style={styles.roleTagText}>{role.toUpperCase()}</Text>
//       </View>
//     );
//   };

//   // Render action buttons based on record status and role
//   const renderActions = (record: Agent) => {
//     return (
//       <View style={styles.actionContainer}>
//         {record.status === 'pending' && (
//           <>
//             <TouchableOpacity
//               style={[styles.actionButton, styles.approveButton]}
//               onPress={() => handleApprove(record)}
//             >
//               <Icon name="checkcircle" size={16} color="#fff" />
//             </TouchableOpacity>
            
//             <TouchableOpacity
//               style={[styles.actionButton, styles.rejectButton]}
//               onPress={() => handleReject(record)}
//             >
//               <Icon name="closecircle" size={16} color="#fff" />
//             </TouchableOpacity>
//           </>
//         )}
        
//         {record.role !== 'admin' && record.status === 'active' && (
//           <TouchableOpacity
//             style={[styles.actionButton, styles.promoteButton]}
//             onPress={() => handlePromoteToAdmin(record._id, record.name)}
//           >
//             <Icon name="crown" size={16} color="#fff" />
//           </TouchableOpacity>
//         )}
        
//         <TouchableOpacity
//           style={[styles.actionButton, styles.editButton]}
//           onPress={() => handleEdit(record)}
//         >
//           <Icon name="edit" size={16} color="#fff" />
//         </TouchableOpacity>
        
//         <TouchableOpacity
//           style={[styles.actionButton, styles.deleteButton]}
//           onPress={() => handleDelete(record._id)}
//         >
//           <Icon name="delete" size={16} color="#fff" />
//         </TouchableOpacity>
//       </View>
//     );
//   };

//   // Render agent/seller list item
//   const renderAgentItem = ({ item }: { item: Agent }) => {
//     const isNarrowScreen = width < 600;
    
//     if (isNarrowScreen) {
//       // Mobile layout (stacked)
//       return (
//         <View style={styles.agentCard}>
//           <View style={styles.agentCardHeader}>
//             <Text style={styles.agentName}>{item.name}</Text>
//             {renderRoleTag(item.role)}
//           </View>
          
//           <View style={styles.agentCardDetail}>
//             <Text style={styles.agentDetailLabel}>Email:</Text>
//             <Text style={styles.agentDetailValue}>{item.email}</Text>
//           </View>
          
//           <View style={styles.agentCardDetail}>
//             <Text style={styles.agentDetailLabel}>Phone:</Text>
//             <Text style={styles.agentDetailValue}>{item.phone}</Text>
//           </View>
          
//           <View style={styles.agentCardDetail}>
//             <Text style={styles.agentDetailLabel}>Properties:</Text>
//             <Text style={styles.agentDetailValue}>{item.properties}</Text>
//           </View>
          
//           <View style={styles.agentCardDetail}>
//             <Text style={styles.agentDetailLabel}>Rating:</Text>
//             <Text style={styles.agentDetailValue}>{item.rating} / 5</Text>
//           </View>
          
//           <View style={styles.agentCardDetail}>
//             <Text style={styles.agentDetailLabel}>Status:</Text>
//             {renderStatusBadge(item.status)}
//           </View>
          
//           <View style={styles.cardActions}>
//             {renderActions(item)}
//           </View>
//         </View>
//       );
//     } else {
//       // Tablet/Desktop layout (row)
//       return (
//         <View style={styles.agentRow}>
//           <View style={[styles.agentColumn, { flex: 2 }]}>
//             <Text style={styles.agentName}>{item.name}</Text>
//           </View>
          
//           <View style={[styles.agentColumn, { flex: 1 }]}>
//             {renderRoleTag(item.role)}
//           </View>
          
//           <View style={[styles.agentColumn, { flex: 2 }]}>
//             <Text>{item.email}</Text>
//           </View>
          
//           <View style={[styles.agentColumn, { flex: 1.5 }]}>
//             <Text>{item.phone}</Text>
//           </View>
          
//           <View style={[styles.agentColumn, { flex: 1 }]}>
//             <Text>{item.properties}</Text>
//           </View>
          
//           <View style={[styles.agentColumn, { flex: 1 }]}>
//             <Text>{item.rating} / 5</Text>
//           </View>
          
//           <View style={[styles.agentColumn, { flex: 1.5 }]}>
//             {renderStatusBadge(item.status)}
//           </View>
          
//           <View style={[styles.agentColumn, { flex: 2.5 }]}>
//             {renderActions(item)}
//           </View>
//         </View>
//       );
//     }
//   };

//   // Render table header for tablet/desktop
//   const renderTableHeader = () => {
//     if (width < 600) return null;
    
//     return (
//       <View style={styles.tableHeader}>
//         <View style={[styles.headerColumn, { flex: 2 }]}>
//           <Text style={styles.headerText}>Name</Text>
//         </View>
//         <View style={[styles.headerColumn, { flex: 1 }]}>
//           <Text style={styles.headerText}>Role</Text>
//         </View>
//         <View style={[styles.headerColumn, { flex: 2 }]}>
//           <Text style={styles.headerText}>Email</Text>
//         </View>
//         <View style={[styles.headerColumn, { flex: 1.5 }]}>
//           <Text style={styles.headerText}>Phone</Text>
//         </View>
//         <View style={[styles.headerColumn, { flex: 1 }]}>
//           <Text style={styles.headerText}>Properties</Text>
//         </View>
//         <View style={[styles.headerColumn, { flex: 1 }]}>
//           <Text style={styles.headerText}>Rating</Text>
//         </View>
//         <View style={[styles.headerColumn, { flex: 1.5 }]}>
//           <Text style={styles.headerText}>Status</Text>
//         </View>
//         <View style={[styles.headerColumn, { flex: 2.5 }]}>
//           <Text style={styles.headerText}>Actions</Text>
//         </View>
//       </View>
//     );
//   };

//   // Render form fields for the modal
//   const renderFormFields = () => {
//     return (
//       <>
//         <View style={styles.formField}>
//           <Text style={styles.formLabel}>Name</Text>
//           <TextInput
//             style={styles.formInput}
//             value={formValues.name}
//             onChangeText={(text) => setFormValues({...formValues, name: text})}
//             placeholder="Enter name"
//           />
//         </View>
        
//         <View style={styles.formField}>
//           <Text style={styles.formLabel}>Email</Text>
//           <TextInput
//             style={styles.formInput}
//             value={formValues.email}
//             onChangeText={(text) => setFormValues({...formValues, email: text})}
//             placeholder="Enter email"
//             keyboardType="email-address"
//           />
//         </View>
        
//         <View style={styles.formField}>
//           <Text style={styles.formLabel}>Phone</Text>
//           <TextInput
//             style={styles.formInput}
//             value={formValues.phone}
//             onChangeText={(text) => setFormValues({...formValues, phone: text})}
//             placeholder="Enter phone number"
//             keyboardType="phone-pad"
//           />
//         </View>
        
//         <View style={styles.formField}>
//           <Text style={styles.formLabel}>Role</Text>
//           <View style={styles.pickerContainer}>
//             <Picker
//               selectedValue={formValues.role}
//               onValueChange={(itemValue) => 
//                 setFormValues({...formValues, role: itemValue as 'agent' | 'seller' | 'admin'})
//               }
//               style={styles.picker}
//             >
//               <Picker.Item label="Agent" value="agent" />
//               <Picker.Item label="Seller" value="seller" />
//               <Picker.Item label="Admin" value="admin" />
//             </Picker>
//           </View>
//         </View>
        
//         <View style={styles.formField}>
//           <Text style={styles.formLabel}>Rating</Text>
//           <TextInput
//             style={styles.formInput}
//             value={formValues.rating.toString()}
//             onChangeText={(text) => {
//               const value = parseFloat(text) || 0;
//               setFormValues({...formValues, rating: Math.min(5, Math.max(0, value))});
//             }}
//             placeholder="Enter rating (0-5)"
//             keyboardType="numeric"
//           />
//         </View>
        
//         <View style={styles.formField}>
//           <Text style={styles.formLabel}>Status</Text>
//           <View style={styles.pickerContainer}>
//             <Picker
//               selectedValue={formValues.status}
//               onValueChange={(itemValue) => 
//                 setFormValues({...formValues, status: itemValue as 'active' | 'inactive' | 'pending'})
//               }
//               style={styles.picker}
//             >
//               <Picker.Item label="Active" value="active" />
//               <Picker.Item label="Pending" value="pending" />
//               <Picker.Item label="Inactive" value="inactive" />
//             </Picker>
//           </View>
//         </View>
//       </>
//     );
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       {error && <Text style={styles.errorText}>{error}</Text>}
      
//       {/* Status tabs */}
//       {renderTabIndicator()}
      
//       {/* Table actions */}
//       <View style={styles.tableActions}>
//         <TouchableOpacity 
//           style={styles.addButton}
//           onPress={() => {
//             setEditingAgent(null);
//             setFormValues({
//               name: '',
//               email: '',
//               phone: '',
//               role: 'agent',
//               rating: 0,
//               status: 'active'
//             });
//             setIsAgentModalVisible(true);
//           }}
//         >
//           <Icon name="plus" size={16} color="#fff" />
//           <Text style={styles.buttonText}>Add User</Text>
//         </TouchableOpacity>
        
//         <TouchableOpacity 
//           style={styles.refreshButton}
//           onPress={fetchAgents}
//         >
//           <Icon name="reload1" size={16} color="#000" />
//           <Text style={styles.refreshButtonText}>Refresh</Text>
//         </TouchableOpacity>
//       </View>
      
//       {isLoading ? (
//         <ActivityIndicator size="large" color="#1890ff" style={styles.loader} />
//       ) : (
//         <>
//           {/* Table header for tablet/desktop */}
//           {renderTableHeader()}
          
//           {/* Agent list */}
//           <FlatList
//             data={getFilteredAgents()}
//             keyExtractor={(item) => item._id}
//             renderItem={renderAgentItem}
//             contentContainerStyle={styles.listContainer}
//             ListEmptyComponent={
//               <View style={styles.emptyContainer}>
//                 <Text style={styles.emptyText}>No users found</Text>
//               </View>
//             }
//           />
//         </>
//       )}
      
//       {/* Add/Edit User Modal */}
//       <Modal
//         visible={isAgentModalVisible}
//         transparent={true}
//         animationType="slide"
//         onRequestClose={() => {
//           setIsAgentModalVisible(false);
//           setEditingAgent(null);
//         }}
//       >
//         <KeyboardAvoidingView
//           behavior={Platform.OS === "ios" ? "padding" : "height"}
//           style={styles.modalContainer}
//         >
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>
//               {editingAgent ? `Edit ${editingAgent.role === 'agent' ? 'Agent' : 'Seller'}` : "Add New User"}
//             </Text>
            
//             {/* Replace ScrollView with FlatList for form fields to avoid nesting ScrollViews */}
//             <FlatList
//               data={[{ key: 'formFields' }]} // Single item for the form
//               renderItem={() => renderFormFields()}
//               style={styles.formContainer}
//               keyboardShouldPersistTaps="handled"
//             />
            
//             <View style={styles.modalActions}>
//               <TouchableOpacity
//                 style={[styles.modalButton, styles.cancelButton]}
//                 onPress={() => {
//                   setIsAgentModalVisible(false);
//                   setEditingAgent(null);
//                 }}
//               >
//                 <Text style={styles.cancelButtonText}>Cancel</Text>
//               </TouchableOpacity>
              
//               <TouchableOpacity
//                 style={[styles.modalButton, styles.submitButton]}
//                 onPress={handleAgentSubmit}
//                 disabled={isLoading}
//               >
//                 {isLoading ? (
//                   <ActivityIndicator size="small" color="#fff" />
//                 ) : (
//                   <Text style={styles.submitButtonText}>
//                     {editingAgent ? "Update" : "Add"}
//                   </Text>
//                 )}
//               </TouchableOpacity>
//             </View>
//           </View>
//         </KeyboardAvoidingView>
//       </Modal>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//     padding: 10,
//   },
//   errorText: {
//     color: '#f5222d',
//     marginBottom: 10,
//     fontSize: 14,
//   },
//   tabContainer: {
//     flexDirection: 'row',
//     marginBottom: 15,
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     elevation: 2,
//   },
//   tabButton: {
//     flex: 1,
//     paddingVertical: 12,
//     alignItems: 'center',
//   },
//   activeTabButton: {
//     borderBottomWidth: 2,
//     borderBottomColor: '#1890ff',
//   },
//   tabButtonText: {
//     color: '#595959',
//     fontWeight: '500',
//   },
//   activeTabButtonText: {
//     color: '#1890ff',
//     fontWeight: '600',
//   },
//   tableActions: {
//     flexDirection: 'row',
//     marginBottom: 15,
//   },
//   addButton: {
//     backgroundColor: '#1890ff',
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 4,
//     marginRight: 10,
//   },
//   buttonText: {
//     color: '#fff',
//     marginLeft: 5,
//     fontWeight: '500',
//   },
//   refreshButton: {
//     backgroundColor: '#f0f0f0',
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 4,
//   },
//   refreshButtonText: {
//     marginLeft: 5,
//     fontWeight: '500',
//   },
//   loader: {
//     marginTop: 30,
//   },
//   tableHeader: {
//     flexDirection: 'row',
//     paddingVertical: 12,
//     backgroundColor: '#fafafa',
//     borderBottomWidth: 1,
//     borderBottomColor: '#e8e8e8',
//     paddingHorizontal: 10,
//   },
//   headerColumn: {
//     paddingHorizontal: 5,
//   },
//   headerText: {
//     fontWeight: '600',
//     color: '#262626',
//   },
//   listContainer: {
//     paddingBottom: 20,
//   },
//   emptyContainer: {
//     padding: 20,
//     alignItems: 'center',
//   },
//   emptyText: {
//     color: '#8c8c8c',
//     fontSize: 16,
//   },
//   // Card layout (mobile)
//   agentCard: {
//     backgroundColor: '#fff',
//     marginBottom: 10,
//     borderRadius: 8,
//     padding: 15,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     elevation: 2,
//   },
//   agentCardHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   agentName: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#262626',
//   },
//   agentCardDetail: {
//     flexDirection: 'row',
//     marginVertical: 4,
//   },
//   agentDetailLabel: {
//     width: 80,
//     fontWeight: '500',
//     color: '#595959',
//   },
//   agentDetailValue: {
//     flex: 1,
//     color: '#262626',
//   },
//   cardActions: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//     marginTop: 10,
//   },
//   // Row layout (tablet/desktop)
//   agentRow: {
//     flexDirection: 'row',
//     backgroundColor: '#fff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#e8e8e8',
//     paddingVertical: 12,
//     paddingHorizontal: 10,
//   },
//   agentColumn: {
//     paddingHorizontal: 5,
//     justifyContent: 'center',
//   },
//   // Status badge
//   badgeContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   statusDot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     marginRight: 6,
//   },
//   statusText: {
//     fontSize: 12,
//     fontWeight: '500',
//   },
//   // Role tag
//   roleTag: {
//     paddingHorizontal: 8,
//     paddingVertical: 3,
//     borderRadius: 4,
//   },
//   roleTagText: {
//     color: '#fff',
//     fontSize: 11,
//     fontWeight: '500',
//   },
//   // Action buttons
//   actionContainer: {
//     flexDirection: 'row',
//   },
//   actionButton: {
//     width: 28,
//     height: 28,
//     borderRadius: 4,
//     marginHorizontal: 3,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   approveButton: {
//     backgroundColor: '#52c41a',
//   },
//   rejectButton: {
//     backgroundColor: '#f5222d',
//   },
//   editButton: {
//     backgroundColor: '#1890ff',
//   },
//   deleteButton: {
//     backgroundColor: '#ff4d4f',
//   },
//   promoteButton: {
//     backgroundColor: '#faad14',
//   },
//   // Modal styles
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     paddingHorizontal: 20,
//   },
//   modalContent: {
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     padding: 20,
//     maxHeight: '80%',
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   formContainer: {
//     maxHeight: 400,
//   },
//   formField: {
//     marginBottom: 15,
//   },
//   formLabel: {
//     fontSize: 14,
//     fontWeight: '500',
//     marginBottom: 5,
//     color: '#262626',
//   },
//   formInput: {
//     borderWidth: 1,
//     borderColor: '#d9d9d9',
//     borderRadius: 4,
//     padding: 10,
//     fontSize: 14,
//     color: '#262626',
//     backgroundColor: '#fff',
//   },
//   pickerContainer: {
//     borderWidth: 1,
//     borderColor: '#d9d9d9',
//     borderRadius: 4,
//     backgroundColor: '#fff',
//   },
//   picker: {
//     height: 44,
//     color: '#262626',
//   },
//   modalActions: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//     marginTop: 20,
//   },
//   modalButton: {
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 4,
//     minWidth: 100,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   cancelButton: {
//     backgroundColor: '#f0f0f0',
//     marginRight: 10,
//   },
//   submitButton: {
//     backgroundColor: '#1890ff',
//   },
//   cancelButtonText: {
//     color: '#595959',
//     fontWeight: '500',
//     fontSize: 14,
//   },
//   submitButtonText: {
//     color: '#fff',
//     fontWeight: '500',
//     fontSize: 14,
//   },
// });

// export default AgentsTab;

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  useWindowDimensions,
  SafeAreaView,
  Modal,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/AntDesign';
import { Picker } from '@react-native-picker/picker';
import axiosInstance from '../services/axiosInstance';

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

interface FormValues {
  name: string;
  email: string;
  phone: string;
  role: 'agent' | 'seller' | 'admin';
  rating: number;
  status: 'active' | 'inactive' | 'pending';
}

const AgentsTab: React.FC = () => {
  const [isAgentModalVisible, setIsAgentModalVisible] = useState<boolean>(false);
  const [formValues, setFormValues] = useState<FormValues>({
    name: '',
    email: '',
    phone: '',
    role: 'agent',
    rating: 0,
    status: 'active'
  });
  const [agents, setAgents] = useState<Agent[]>([]);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState<string>('all'); // 'all', 'pending', 'active', 'inactive'
  const { width } = useWindowDimensions();
  
  // Fetch agents from API on mount
  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get('/RealEstateUser/getAllAgentsAndSellers');
      console.log('API agents/sellers data:', response.data);
      setAgents(response.data.users || []);
    } catch (err: any) {
      console.error('Error fetching agents and sellers:', err);
      setError('Failed to fetch agents and sellers. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle approval of pending agent/seller
  const handleApprove = async (record: Agent) => {
    try {
      setIsLoading(true);
      await axiosInstance.put(
        `/RealEstateUser/approveUser/${record._id}`,
        { status: 'active' }
      );
      
      // Update local state
      setAgents(agents.map(agent => 
        agent._id === record._id ? { ...agent, status: 'active' } : agent
      ));
      
      Alert.alert('Success', `${record.role === 'agent' ? 'Agent' : 'Seller'} approved successfully`);
    } catch (err: any) {
      console.error('Error approving user:', err);
      Alert.alert('Error', 'Failed to approve user. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle rejection of pending agent/seller
  const handleReject = async (record: Agent) => {
    try {
      setIsLoading(true);
      await axiosInstance.put(
        `/RealEstateUser/rejectUser/${record._id}`,
        { status: 'inactive' }
      );
      
      // Update local state
      setAgents(agents.map(agent => 
        agent._id === record._id ? { ...agent, status: 'inactive' } : agent
      ));
      
      Alert.alert('Success', `${record.role === 'agent' ? 'Agent' : 'Seller'} rejected`);
    } catch (err: any) {
      console.error('Error rejecting user:', err);
      Alert.alert('Error', 'Failed to reject user. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle promotion to admin
  const handlePromoteToAdmin = async (userId: string, userName: string) => {
    try {
      const response = await axiosInstance.put(`/RealEstateUser/promote-to-admin/${userId}`);
      
      if (response.data.success) {
        Alert.alert('Success', `${userName} has been promoted to admin`);
        
        // Update local state to show role change immediately
        setAgents(agents.map(agent => 
          agent._id === userId ? { ...agent, role: 'admin' } : agent
        ));
      }
    } catch (error: any) {
      console.error("Error promoting user:", error);
      Alert.alert('Error', error.response?.data?.message || "Failed to promote user");
    }
  };

  // Handle modification of agent/seller details
  const handleEdit = (record: Agent) => {
    setEditingAgent(record);
    setFormValues({
      name: record.name,
      email: record.email,
      phone: record.phone,
      role: record.role,
      rating: record.rating,
      status: record.status
    });
    setIsAgentModalVisible(true);
  };

  // Handle deletion of agent/seller
  const handleDelete = async (id: string) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this user?",
      [
        { 
          text: "Cancel", 
          style: "cancel" 
        },
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

  // Form submission handler
  const handleAgentSubmit = async () => {
    // Basic validation
    if (!formValues.name || !formValues.email || !formValues.phone) {
      Alert.alert('Validation Error', 'Please fill all required fields');
      return;
    }

    try {
      setIsLoading(true);

      if (editingAgent) {
        // Update existing agent/seller via API
        const response = await axiosInstance.put(
          `/RealEstateUser/updateUser/${editingAgent._id}`,
          formValues
        );
        
        // Update local state
        setAgents(agents.map(agent => 
          agent._id === editingAgent._id ? { ...agent, ...formValues } : agent
        ));
        
        Alert.alert('Success', `${editingAgent.role === 'agent' ? 'Agent' : 'Seller'} updated successfully`);
      } else {
        // Add new agent via API
        const response = await axiosInstance.post(
          `/api/v1/RealEstateUser/addUser`,
          { ...formValues, properties: 0 }
        );
        
        // Update local state
        setAgents([...agents, response.data.user]);
        Alert.alert('Success', 'User added successfully');
      }

      setIsAgentModalVisible(false);
      setEditingAgent(null);
      setFormValues({
        name: '',
        email: '',
        phone: '',
        role: 'agent',
        rating: 0,
        status: 'active'
      });
    } catch (err: any) {
      console.error('Error submitting user:', err);
      Alert.alert('Error', 'Failed to save user. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter agents/sellers based on selected tab
  const getFilteredAgents = () => {
    if (currentTab === 'all') return agents;
    return agents.filter(agent => agent.status === currentTab);
  };

  // Render tab indicator with badge for pending items
  const renderTabIndicator = () => {
    const pendingCount = agents.filter(agent => agent.status === 'pending').length;

    return (
      <View style={styles.tabContainer}>
        {['all', 'pending', 'active', 'inactive'].map(tab => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tabButton,
              currentTab === tab && styles.activeTabButton
            ]}
            onPress={() => setCurrentTab(tab)}
          >
            <Text style={[
              styles.tabButtonText,
              currentTab === tab && styles.activeTabButtonText
            ]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === 'pending' && pendingCount > 0 ? ` (${pendingCount})` : ''}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  // Render status badge based on status
  const renderStatusBadge = (status: string) => {
    let badgeColor = '#52c41a'; // green for active
    if (status === 'pending') badgeColor = '#faad14'; // gold for pending
    if (status === 'inactive') badgeColor = '#f5222d'; // red for inactive
    
    return (
      <View style={styles.badgeContainer}>
        <View style={[styles.statusDot, { backgroundColor: badgeColor }]} />
        <Text style={styles.statusText}>{status.toUpperCase()}</Text>
      </View>
    );
  };

  // Render role tag
  const renderRoleTag = (role: string) => {
    let tagColor = '#722ed1'; // purple for default
    if (role === 'agent') tagColor = '#1890ff'; // blue for agent
    if (role === 'admin') tagColor = '#faad14'; // gold for admin
    
    return (
      <View style={[styles.roleTag, { backgroundColor: tagColor }]}>
        <Text style={styles.roleTagText}>{role.toUpperCase()}</Text>
      </View>
    );
  };

  // Render action buttons based on record status and role
  const renderActions = (record: Agent) => {
    return (
      <View style={styles.actionContainer}>
        {record.status === 'pending' && (
          <>
            <TouchableOpacity
              style={[styles.actionButton, styles.approveButton]}
              onPress={() => handleApprove(record)}
            >
              <Icon name="checkcircle" size={16} color="#fff" />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.actionButton, styles.rejectButton]}
              onPress={() => handleReject(record)}
            >
              <Icon name="closecircle" size={16} color="#fff" />
            </TouchableOpacity>
          </>
        )}
        
        {record.role !== 'admin' && record.status === 'active' && (
          <TouchableOpacity
            style={[styles.actionButton, styles.promoteButton]}
            onPress={() => handlePromoteToAdmin(record._id, record.name)}
          >
            <Icon name="crown" size={16} color="#fff" />
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => handleEdit(record)}
        >
          <Icon name="edit" size={16} color="#fff" />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDelete(record._id)}
        >
          <Icon name="delete" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  };

  // Render agent/seller list item
  const renderAgentItem = ({ item }: { item: Agent }) => {
    const isNarrowScreen = width < 600;
    
    if (isNarrowScreen) {
      // Mobile layout (stacked)
      return (
        <View style={styles.agentCard}>
          <View style={styles.agentCardHeader}>
            <Text style={styles.agentName}>{item.name}</Text>
            {renderRoleTag(item.role)}
          </View>
          
          <View style={styles.agentCardDetail}>
            <Text style={styles.agentDetailLabel}>Email:</Text>
            <Text style={styles.agentDetailValue}>{item.email}</Text>
          </View>
          
          <View style={styles.agentCardDetail}>
            <Text style={styles.agentDetailLabel}>Phone:</Text>
            <Text style={styles.agentDetailValue}>{item.phone}</Text>
          </View>
          
          <View style={styles.agentCardDetail}>
            <Text style={styles.agentDetailLabel}>Properties:</Text>
            <Text style={styles.agentDetailValue}>{item.properties}</Text>
          </View>
          
          <View style={styles.agentCardDetail}>
            <Text style={styles.agentDetailLabel}>Rating:</Text>
            <Text style={styles.agentDetailValue}>{item.rating} / 5</Text>
          </View>
          
          <View style={styles.agentCardDetail}>
            <Text style={styles.agentDetailLabel}>Status:</Text>
            {renderStatusBadge(item.status)}
          </View>
          
          <View style={styles.cardActions}>
            {renderActions(item)}
          </View>
        </View>
      );
    } else {
      // Tablet/Desktop layout (row)
      return (
        <View style={styles.agentRow}>
          <View style={[styles.agentColumn, { flex: 2 }]}>
            <Text style={styles.agentName}>{item.name}</Text>
          </View>
          
          <View style={[styles.agentColumn, { flex: 1 }]}>
            {renderRoleTag(item.role)}
          </View>
          
          <View style={[styles.agentColumn, { flex: 2 }]}>
            <Text>{item.email}</Text>
          </View>
          
          <View style={[styles.agentColumn, { flex: 1.5 }]}>
            <Text>{item.phone}</Text>
          </View>
          
          <View style={[styles.agentColumn, { flex: 1 }]}>
            <Text>{item.properties}</Text>
          </View>
          
          <View style={[styles.agentColumn, { flex: 1 }]}>
            <Text>{item.rating} / 5</Text>
          </View>
          
          <View style={[styles.agentColumn, { flex: 1.5 }]}>
            {renderStatusBadge(item.status)}
          </View>
          
          <View style={[styles.agentColumn, { flex: 2.5 }]}>
            {renderActions(item)}
          </View>
        </View>
      );
    }
  };

  // Render table header for tablet/desktop
  const renderTableHeader = () => {
    if (width < 600) return null;
    
    return (
      <View style={styles.tableHeader}>
        <View style={[styles.headerColumn, { flex: 2 }]}>
          <Text style={styles.headerText}>Name</Text>
        </View>
        <View style={[styles.headerColumn, { flex: 1 }]}>
          <Text style={styles.headerText}>Role</Text>
        </View>
        <View style={[styles.headerColumn, { flex: 2 }]}>
          <Text style={styles.headerText}>Email</Text>
        </View>
        <View style={[styles.headerColumn, { flex: 1.5 }]}>
          <Text style={styles.headerText}>Phone</Text>
        </View>
        <View style={[styles.headerColumn, { flex: 1 }]}>
          <Text style={styles.headerText}>Properties</Text>
        </View>
        <View style={[styles.headerColumn, { flex: 1 }]}>
          <Text style={styles.headerText}>Rating</Text>
        </View>
        <View style={[styles.headerColumn, { flex: 1.5 }]}>
          <Text style={styles.headerText}>Status</Text>
        </View>
        <View style={[styles.headerColumn, { flex: 2.5 }]}>
          <Text style={styles.headerText}>Actions</Text>
        </View>
      </View>
    );
  };

  // Render form fields for the modal - NO FlatList here
  const renderFormFields = () => {
    return (
      <View style={styles.formContainer}>
        <View style={styles.formField}>
          <Text style={styles.formLabel}>Name</Text>
          <TextInput
            style={styles.formInput}
            value={formValues.name}
            onChangeText={(text) => setFormValues({...formValues, name: text})}
            placeholder="Enter name"
          />
        </View>
        
        <View style={styles.formField}>
          <Text style={styles.formLabel}>Email</Text>
          <TextInput
            style={styles.formInput}
            value={formValues.email}
            onChangeText={(text) => setFormValues({...formValues, email: text})}
            placeholder="Enter email"
            keyboardType="email-address"
          />
        </View>
        
        <View style={styles.formField}>
          <Text style={styles.formLabel}>Phone</Text>
          <TextInput
            style={styles.formInput}
            value={formValues.phone}
            onChangeText={(text) => setFormValues({...formValues, phone: text})}
            placeholder="Enter phone number"
            keyboardType="phone-pad"
          />
        </View>
        
        <View style={styles.formField}>
          <Text style={styles.formLabel}>Role</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formValues.role}
              onValueChange={(itemValue) => 
                setFormValues({...formValues, role: itemValue as 'agent' | 'seller' | 'admin'})
              }
              style={styles.picker}
            >
              <Picker.Item label="Agent" value="agent" />
              <Picker.Item label="Seller" value="seller" />
              <Picker.Item label="Admin" value="admin" />
            </Picker>
          </View>
        </View>
        
        <View style={styles.formField}>
          <Text style={styles.formLabel}>Rating</Text>
          <TextInput
            style={styles.formInput}
            value={formValues.rating.toString()}
            onChangeText={(text) => {
              const value = parseFloat(text) || 0;
              setFormValues({...formValues, rating: Math.min(5, Math.max(0, value))});
            }}
            placeholder="Enter rating (0-5)"
            keyboardType="numeric"
          />
        </View>
        
        <View style={styles.formField}>
          <Text style={styles.formLabel}>Status</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formValues.status}
              onValueChange={(itemValue) => 
                setFormValues({...formValues, status: itemValue as 'active' | 'inactive' | 'pending'})
              }
              style={styles.picker}
            >
              <Picker.Item label="Active" value="active" />
              <Picker.Item label="Pending" value="pending" />
              <Picker.Item label="Inactive" value="inactive" />
            </Picker>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {error && <Text style={styles.errorText}>{error}</Text>}
      
      {/* Status tabs */}
      {renderTabIndicator()}
      
      {/* Table actions */}
      <View style={styles.tableActions}>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => {
            setEditingAgent(null);
            setFormValues({
              name: '',
              email: '',
              phone: '',
              role: 'agent',
              rating: 0,
              status: 'active'
            });
            setIsAgentModalVisible(true);
          }}
        >
          <Icon name="plus" size={16} color="#fff" />
          <Text style={styles.buttonText}>Add User</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={fetchAgents}
        >
          <Icon name="reload1" size={16} color="#000" />
          <Text style={styles.refreshButtonText}>Refresh</Text>
        </TouchableOpacity>
      </View>
      
      {isLoading ? (
        <ActivityIndicator size="large" color="#1890ff" style={styles.loader} />
      ) : (
        <>
          {/* Table header for tablet/desktop */}
          {renderTableHeader()}
          
          {/* Agent list */}
          <FlatList
            data={getFilteredAgents()}
            keyExtractor={(item) => item._id}
            renderItem={renderAgentItem}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No users found</Text>
              </View>
            }
          />
        </>
      )}
      
      {/* Add/Edit User Modal */}
      <Modal
        visible={isAgentModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          setIsAgentModalVisible(false);
          setEditingAgent(null);
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingAgent ? `Edit ${editingAgent.role === 'agent' ? 'Agent' : 'Seller'}` : "Add New User"}
            </Text>
            
            {/* We removed the nested FlatList here and replaced with direct form fields */}
            {renderFormFields()}
            
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setIsAgentModalVisible(false);
                  setEditingAgent(null);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.submitButton]}
                onPress={handleAgentSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.submitButtonText}>
                    {editingAgent ? "Update" : "Add"}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  errorText: {
    color: '#f5222d',
    marginBottom: 10,
    fontSize: 14,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: '#1890ff',
  },
  tabButtonText: {
    color: '#595959',
    fontWeight: '500',
  },
  activeTabButtonText: {
    color: '#1890ff',
    fontWeight: '600',
  },
  tableActions: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  addButton: {
    backgroundColor: '#1890ff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    marginRight: 10,
  },
  buttonText: {
    color: '#fff',
    marginLeft: 5,
    fontWeight: '500',
  },
  refreshButton: {
    backgroundColor: '#f0f0f0',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
  },
  refreshButtonText: {
    marginLeft: 5,
    fontWeight: '500',
  },
  loader: {
    marginTop: 30,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 12,
    backgroundColor: '#fafafa',
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
    paddingHorizontal: 10,
  },
  headerColumn: {
    paddingHorizontal: 5,
  },
  headerText: {
    fontWeight: '600',
    color: '#262626',
  },
  listContainer: {
    paddingBottom: 20,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: '#8c8c8c',
    fontSize: 16,
  },
  // Card layout (mobile)
  agentCard: {
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 8,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  agentCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  agentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#262626',
  },
  agentCardDetail: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  agentDetailLabel: {
    width: 80,
    fontWeight: '500',
    color: '#595959',
  },
  agentDetailValue: {
    flex: 1,
    color: '#262626',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  // Row layout (tablet/desktop)
  agentRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  agentColumn: {
    paddingHorizontal: 5,
    justifyContent: 'center',
  },
  // Status badge
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  // Role tag
  roleTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  roleTagText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '500',
  },
  // Action buttons
  actionContainer: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 28,
    height: 28,
    borderRadius: 4,
    marginHorizontal: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  approveButton: {
    backgroundColor: '#52c41a',
  },
  rejectButton: {
    backgroundColor: '#f5222d',
  },
  editButton: {
    backgroundColor: '#1890ff',
  },
  deleteButton: {
    backgroundColor: '#ff4d4f',
  },
  promoteButton: {
    backgroundColor: '#faad14',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  formContainer: {
    paddingBottom: 5,
  },
  formField: {
    marginBottom: 15,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
    color: '#262626',
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#d9d9d9',
    borderRadius: 4,
    padding: 10,
    fontSize: 14,
    backgroundColor: '#fff',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#d9d9d9',
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  picker: {
    height: 44,
    fontSize: 14,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  cancelButtonText: {
    color: '#595959',
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#1890ff',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
});

export default AgentsTab;