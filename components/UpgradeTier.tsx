import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  ScrollView,
  useWindowDimensions,
  Platform
} from 'react-native';
import { RadioButton } from 'react-native-paper';

interface TierType {
  name: string;
  limit: number;
  description: string;
}

const UpgradeTier: React.FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentTier, setCurrentTier] = useState<number>(0); // Default to Free Tier
  const [selectedTier, setSelectedTier] = useState<number>(0);
  const { width } = useWindowDimensions();
  
  const isSmallScreen = width < 375;

  const tiers: TierType[] = [
    { name: "Free Tier", limit: 5, description: "Basic account with limited access" },
    { name: "Standard Tier", limit: 15, description: "Paid subscription with moderate access" },
    { name: "Premium Tier", limit: 30, description: "Premium subscription with expanded access" },
    { name: "Enterprise Tier", limit: 100, description: "Full access for enterprise clients" },
  ];

  const openModal = (): void => {
    setSelectedTier(currentTier);
    setShowModal(true);
  };

  const closeModal = (): void => {
    setShowModal(false);
  };

  const handleUpdateTier = (): void => {
    setCurrentTier(selectedTier);
    closeModal();
  };

  const renderTableHeader = (): JSX.Element => {
    if (isSmallScreen) {
      return null;
    }
    
    return (
      <View style={styles.tableHeader}>
        <Text style={[styles.headerText, { flex: 2 }]}>Tier Name</Text>
        <Text style={[styles.headerText, { flex: 2 }]}>Property Limit</Text>
        <Text style={[styles.headerText, { flex: 3 }]}>Description</Text>
        <Text style={[styles.headerText, { flex: 1 }]}>Status</Text>
      </View>
    );
  };

  const renderTierItem = ({ item, index }: { item: TierType, index: number }): JSX.Element => {
    const isCurrentTier = currentTier === index;
    
    if (isSmallScreen) {
      // Card-style for small screens
      return (
        <View style={[
          styles.tierCard,
          isCurrentTier && styles.currentTierCard
        ]}>
          <Text style={styles.tierCardTitle}>{item.name}</Text>
          <View style={styles.limitBadge}>
            <Text style={styles.limitText}>{item.limit} properties</Text>
          </View>
          <Text style={styles.descriptionText}>{item.description}</Text>
          <View style={styles.statusContainer}>
            {isCurrentTier ? (
              <Text style={styles.currentStatus}>Current</Text>
            ) : currentTier < index ? (
              <Text style={styles.upgradeStatus}>Upgrade</Text>
            ) : (
              <Text style={styles.downgradeStatus}>Downgrade</Text>
            )}
          </View>
        </View>
      );
    }
    
    // Table-style for larger screens
    return (
      <View style={[
        styles.tableRow,
        isCurrentTier && styles.currentTierRow
      ]}>
        <Text style={[styles.cellText, { flex: 2 }]}>{item.name}</Text>
        <View style={[styles.cellContainer, { flex: 2 }]}>
          <View style={styles.limitBadge}>
            <Text style={styles.limitText}>{item.limit}</Text>
          </View>
          <Text style={styles.propertiesText}> properties</Text>
        </View>
        <Text style={[styles.cellText, { flex: 3 }]}>{item.description}</Text>
        <View style={[styles.cellContainer, { flex: 1 }]}>
          {isCurrentTier ? (
            <Text style={styles.currentStatus}>Current</Text>
          ) : currentTier < index ? (
            <Text style={styles.upgradeStatus}>Upgrade</Text>
          ) : (
            <Text style={styles.downgradeStatus}>Downgrade</Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.emoji}>👤</Text>
            <Text style={styles.title}>Buyer Tier Limits</Text>
          </View>
          <View style={styles.currentTierContainer}>
            <Text style={styles.currentTierText}>
              Current Tier: <Text style={styles.currentTierName}>{tiers[currentTier].name}</Text>
            </Text>
            <TouchableOpacity 
              onPress={openModal}
              style={styles.updateButton}
            >
              <Text style={styles.updateButtonText}>Update Tier</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Table or Cards of tiers based on screen size */}
        {renderTableHeader()}
        <FlatList
          data={tiers}
          renderItem={renderTierItem}
          keyExtractor={(_, index) => index.toString()}
          style={styles.list}
          contentContainerStyle={styles.listContent}
        />
      </View>

      {/* Tier Update Modal */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Your Tier</Text>
            <Text style={styles.modalSubtitle}>Select the tier you want to upgrade to:</Text>
            
            <ScrollView style={styles.tierOptions}>
              {tiers.map((tier, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.tierOption,
                    selectedTier === index && styles.selectedTierOption
                  ]}
                  onPress={() => setSelectedTier(index)}
                >
                  <RadioButton
                    value={index.toString()}
                    status={selectedTier === index ? 'checked' : 'unchecked'}
                    onPress={() => setSelectedTier(index)}
                    color="#3b82f6"
                  />
                  <View style={styles.tierOptionContent}>
                    <Text style={styles.tierOptionName}>{tier.name}</Text>
                    <Text style={styles.tierOptionDescription}>{tier.description}</Text>
                    <Text style={styles.tierOptionLimit}>Limit: {tier.limit} properties</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            <View style={styles.modalActions}>
              <TouchableOpacity 
                onPress={closeModal} 
                style={styles.cancelButton}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={handleUpdateTier} 
                style={[
                  styles.confirmButton,
                  selectedTier === currentTier && styles.disabledButton
                ]}
                disabled={selectedTier === currentTier}
              >
                <Text style={styles.confirmButtonText}>Confirm Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    padding: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  emoji: {
    fontSize: 20,
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  currentTierContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  currentTierText: {
    marginBottom: 8,
  },
  currentTierName: {
    fontWeight: '700',
  },
  updateButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  updateButtonText: {
    color: '#ffffff',
    fontWeight: '500',
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerText: {
    fontWeight: '600',
    fontSize: 14,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 8,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    alignItems: 'center',
  },
  cellContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cellText: {
    fontSize: 14,
  },
  currentTierRow: {
    backgroundColor: '#eff6ff',
  },
  limitBadge: {
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  limitText: {
    fontSize: 14,
  },
  propertiesText: {
    fontSize: 14,
  },
  currentStatus: {
    color: '#10b981',
    fontWeight: '500',
  },
  upgradeStatus: {
    color: '#3b82f6',
  },
  downgradeStatus: {
    color: '#9ca3af',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  modalSubtitle: {
    marginBottom: 16,
  },
  tierOptions: {
    maxHeight: 300,
  },
  tierOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 4,
    marginBottom: 8,
  },
  selectedTierOption: {
    borderColor: '#3b82f6',
    backgroundColor: '#eff6ff',
  },
  tierOptionContent: {
    marginLeft: 8,
  },
  tierOptionName: {
    fontWeight: '500',
  },
  tierOptionDescription: {
    fontSize: 13,
    color: '#6b7280',
  },
  tierOptionLimit: {
    fontSize: 13,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#000000',
  },
  confirmButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  confirmButtonText: {
    color: '#ffffff',
  },
  disabledButton: {
    backgroundColor: '#9ca3af',
  },
  // Card styles for small screens
  tierCard: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    marginBottom: 12,
  },
  currentTierCard: {
    backgroundColor: '#eff6ff',
    borderColor: '#bfdbfe',
  },
  tierCardTitle: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 8,
  },
  descriptionText: {
    marginVertical: 6,
    fontSize: 14,
  },
  statusContainer: {
    marginTop: 8,
  },
});

export default UpgradeTier;