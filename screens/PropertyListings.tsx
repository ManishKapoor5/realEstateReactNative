import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Image,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Feather";
import { Property } from "../types";

// Enhanced PropertyCard component with image support
interface PropertyCardProps {
  property: Property;
  viewMode?: "grid" | "list";
  title: string;
  price: number;
  location: string;
  imageUrl?: string; // Add image URL property
  onPress?: () => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  title,
  price,
  location,
  imageUrl,
  viewMode,
  onPress,
}) => (
  <TouchableOpacity
    style={[
      styles.card,
      viewMode === "list" ? styles.cardList : styles.cardGrid,
    ]}
    onPress={onPress}
  >
    {/* Image container with fallback */}
    <View style={styles.imageContainer}>
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={styles.propertyImage}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.placeholderImage}>
          <Icon name="home" size={30} color="#CBD5E1" />
        </View>
      )}
    </View>
    <View style={styles.cardContent}>
      <Text style={styles.cardTitle} numberOfLines={1}>
        {title}
      </Text>
      <Text style={styles.cardPrice}>${price.toLocaleString()}</Text>
      <Text style={styles.cardLocation} numberOfLines={2}>
        {location}
      </Text>
    </View>
  </TouchableOpacity>
);

const PropertyList: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { width } = Dimensions.get("window");
  const numColumns = width >= 768 ? 3 : width >= 400 ? 2 : 1;

  useEffect(() => {
    // Simulate loading and set properties from route params
    const locationState = route.params?.filteredProperties as
      | Property[]
      | undefined;
    setLoading(true);
    const timer = setTimeout(() => {
      if (locationState && locationState.length > 0) {
        setProperties(locationState);
      } else {
        setProperties([]);
      }
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [route.params]);

  const refreshResult = () => {
    setLoading(true);
    setError("");
    setProperties([]);
    // Reset to initial state to simulate refresh
    const locationState = route.params?.filteredProperties as
      | Property[]
      | undefined;
    setTimeout(() => {
      if (locationState && locationState.length > 0) {
        setProperties(locationState);
      } else {
        setProperties([]);
      }
      setLoading(false);
    }, 1000);
  };

  const handlePropertyPress = (property: Property) => {
    // Navigate to property details screen
    navigation.navigate("PropertyDetail", { property });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate("Home")}
          >
            <Icon name="arrow-left" size={20} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Available Properties</Text>
        </View>
        {/* <View style={styles.viewToggle}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              viewMode === "grid" ? styles.toggleButtonActive : null,
            ]}
            onPress={() => setViewMode("grid")}
          >
            <Icon
              name="grid"
              size={16}
              color={viewMode === "grid" ? "#FFFFFF" : "#111827"}
            />
            <Text
              style={[
                styles.toggleButtonText,
                viewMode === "grid" ? styles.toggleButtonTextActive : null,
              ]}
            >
              Grid
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              viewMode === "list" ? styles.toggleButtonActive : null,
            ]}
            onPress={() => setViewMode("list")}
          >
            <Icon
              name="list"
              size={16}
              color={viewMode === "list" ? "#FFFFFF" : "#111827"}
            />
            <Text
              style={[
                styles.toggleButtonText,
                viewMode === "list" ? styles.toggleButtonTextActive : null,
              ]}
            >
              List
            </Text>
          </TouchableOpacity>
        </View> */}
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loadingText}>Loading properties...</Text>
        </View>
      ) : properties.length > 0 ? (
        <FlatList
          data={properties}
          renderItem={({ item }) => (
            <PropertyCard
              key={item._id}
              property={item}
              viewMode={viewMode}
              title={item.title}
              price={
                typeof item.price === "string"
                  ? parseFloat(item.price)
                  : item.price
              }
              location={`${item.location.address}, ${item.location.city}, ${item.location.state}, ${item.location.country}`}
              imageUrl={
                item.images && item.images.length > 0
                  ? typeof item.images[0] === "string"
                    ? item.images[0]
                    : item.images[0].uri
                  : undefined
              }
              onPress={() => handlePropertyPress(item)}
            />
          )}
          key={viewMode === "grid" ? `grid_${numColumns}` : "list"}
          numColumns={viewMode === "grid" ? numColumns : 1}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No properties found.</Text>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={refreshResult}
          >
            <Text style={styles.refreshButtonText}>Refresh Results</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

// Define the style types
type StylesType = {
  container: ViewStyle;
  header: ViewStyle;
  headerLeft: ViewStyle;
  backButton: ViewStyle;
  headerTitle: TextStyle;
  viewToggle: ViewStyle;
  toggleButton: ViewStyle;
  toggleButtonActive: ViewStyle;
  toggleButtonText: TextStyle;
  toggleButtonTextActive: TextStyle;
  errorContainer: ViewStyle;
  errorText: TextStyle;
  loadingContainer: ViewStyle;
  loadingText: TextStyle;
  emptyContainer: ViewStyle;
  emptyText: TextStyle;
  refreshButton: ViewStyle;
  refreshButtonText: TextStyle;
  listContent: ViewStyle;
  card: ViewStyle;
  cardGrid: ViewStyle;
  cardList: ViewStyle;
  imageContainer: ViewStyle;
  propertyImage: ImageStyle;
  placeholderImage: ViewStyle;
  cardContent: ViewStyle;
  cardTitle: TextStyle;
  cardPrice: TextStyle;
  cardLocation: TextStyle;
};

const styles = StyleSheet.create<StylesType>({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
  },
  viewToggle: {
    flexDirection: "row",
  },
  toggleButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    marginLeft: 8,
  },
  toggleButtonActive: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },
  toggleButtonText: {
    fontSize: 14,
    color: "#111827",
    marginLeft: 4,
  },
  toggleButtonTextActive: {
    color: "#FFFFFF",
  },
  errorContainer: {
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FEE2E2",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
    color: "#B91C1C",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyText: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 16,
  },
  refreshButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  refreshButtonText: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "500",
  },
  listContent: {
    paddingBottom: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 16,
    marginHorizontal: 8,
  },
  cardGrid: {
    flex: 1,
  },
  cardList: {
    width: "100%",
    flexDirection: "row",
  },
  imageContainer: {
    height: 160,
    width: "100%",
  },
  propertyImage: {
    width: "100%",
    height: "100%",
  },
  placeholderImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  cardContent: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: "500",
    color: "#2563EB",
    marginBottom: 8,
  },
  cardLocation: {
    fontSize: 14,
    color: "#6B7280",
  },
});

export default PropertyList;
