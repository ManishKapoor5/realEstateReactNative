import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart, PieChart } from 'react-native-chart-kit';
import axiosInstance from '../../services/axiosInstance';
import { User } from '../../types/property';

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
  createdAt: string;
  updatedAt: string;
}

interface DashboardStatProps {
  label: string;
  value: string | number;
  trend?: 'up' | 'down';
  trendValue?: string;
  icon?: React.ReactNode;
}

interface DashboardMetricsProps {
  properties: number;
  available: number;
  sold: number;
  agents: number;
  totalValue: number;
}

const screenWidth = Dimensions.get('window').width;

const DashboardStat: React.FC<DashboardStatProps> = ({ label, value, trend, trendValue, icon }) => (
  <View style={styles.statCard}>
    <View style={styles.statContent}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
      {trend && trendValue && (
        <Text style={[styles.statTrend, trend === 'up' ? styles.trendUp : styles.trendDown]}>
          {trend === 'up' ? '↑' : '↓'} {trendValue}
        </Text>
      )}
    </View>
    {icon && <View style={styles.statIcon}>{icon}</View>}
  </View>
);

const DashboardMetrics: React.FC<DashboardMetricsProps> = ({ agents }) => {
  const [data, setData] = useState<Property[]>([]);
  const [agentdata, setAgentData] = useState<User[]>([]);
  const [agentcount, setAgentCount] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axiosInstance.get<{ data: any[] }>('/Property/getAll');
        //const agentcount = await axiosInstance.get<{ agentdata: any[] }>('/RealEstateUser/getAllAgentsAndSellers')
        //const responseagent = await axiosInstance.get<{agentdata: any[]}>('/RealEstateUser/getAllAgentsAndSellers')
    
      
        const mappedData: Property[] = response.data.data.map((prop) => ({
          id: prop._id,
          title: prop.title,
          type: prop.type,
          location: prop.location?.address ?? '',
          price: prop.price,
          status: prop.status,
          bedrooms: prop.features?.bedrooms,
          bathrooms: prop.features?.bathrooms,
          area: prop.features?.area,
          featuredImage: prop.images?.[0],
          createdAt: prop.createdAt,
          updatedAt: prop.updatedAt,
        }));

        // const mappedAgentData: User[] = responseagent.data.agentdata.map((prop) => ({
        //   _id: prop._id, fullName: prop.fullName, email: prop.email, contactNumber: prop.contactNumber, role: prop.role, status: prop.status
        // }));
        setData(mappedData);
        //setAgentData(mappedAgentData)
      
      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch properties. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProperties();
  }, []);

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr'],
    datasets: [
      {
        data: [30, 45, 38, 50],
      },
    ],
  };

  const availableCount = data.filter((prop) => prop.status.toLowerCase() === 'available').length;
  const soldCount = data.filter((prop) => prop.status.toLowerCase() === 'sold').length;
  //const agentCount = agentdata.filter((prop) => prop.role.toLowerCase() === 'agent').length;
  
  const propertyDistribution = [
    {
      name: 'Apartments',
      value: data.filter((prop) => prop.type.toLowerCase() === 'apartment').length,
      color: COLORS[0],
    },
    {
      name: 'Houses',
      value: data.filter((prop) => prop.type.toLowerCase() === 'house').length,
      color: COLORS[1],
    },
    {
      name: 'Plots',
      value: data.filter((prop) => prop.type.toLowerCase() === 'plot').length,
      color: COLORS[2],
    },
    {
      name: 'Commercial',
      value: data.filter((prop) => prop.type.toLowerCase() === 'commercial').length,
      color: COLORS[3],
    },
  ].filter((item) => item.value > 0);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.statsGrid}>
        <DashboardStat
          label="Total Properties"
          value={data.length}
          trend="up"
          trendValue=""
        />
        <DashboardStat label="Available Properties" value={availableCount} />
        <DashboardStat
          label="Properties Sold"
          value={soldCount}
          trend="up"
          trendValue=""
        />
        {/* <DashboardStat label="Active Agents" value={agentCount} /> */}
      </View>

      <View style={styles.chartsGrid}>
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Sales Overview</Text>
          <LineChart
            data={chartData}
            width={screenWidth - 60}
            height={300}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(136, 132, 216, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: '#8884d8',
              },
            }}
            style={styles.chart}
          />
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Property Distribution</Text>
          <PieChart
            data={propertyDistribution}
            width={screenWidth - 60}
            height={250}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor="value"
            backgroundColor="transparent"
            paddingLeft="15"
            center={[10, 0]}
            absolute
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f5f5f5',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 10,
    width: (screenWidth - 50) / 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statContent: {
    flex: 1,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  statTrend: {
    fontSize: 12,
    marginTop: 4,
  },
  trendUp: {
    color: '#22c55e',
  },
  trendDown: {
    color: '#ef4444',
  },
  statIcon: {
    marginLeft: 10,
  },
  chartsGrid: {
    flexDirection: 'column',
  },
  chartCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  chart: {
    borderRadius: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#333',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
  },
});

export default DashboardMetrics;