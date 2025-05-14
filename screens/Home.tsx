import React from 'react';
import { ScrollView, View, StyleSheet, FlatList } from 'react-native';
import AppPromoSection from '../components/AppPromotion';
import ExploreByCategories from '../components/ExploreByCategories';
import FeaturedProperties from '../components/FeaturedProperties';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Hero from '../components/Hero';
import LocationList from '../components/LocationList';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppFeatures from '../components/AppFeatures';
// import PropertyFilters from './components/PropertyFilters';

const Home: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <View style={styles.main}>
        <FlatList data={[1]} renderItem={({item,index})=>{
          return(
            <View>
        <Hero />
        <FeaturedProperties />
        <ExploreByCategories />
        <LocationList />
        <AppFeatures />
        <Footer />
        </View>
          )
        }} />
 
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  main: {
    flex: 1,
  },
});

export default Home;