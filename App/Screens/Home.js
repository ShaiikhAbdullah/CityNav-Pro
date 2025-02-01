// Home.js
import { View, ScrollView } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import Header from '../Components/Home/Header';
import GoogleMapView from '../Components/Home/GoogleMapView';
import CategoryList from '../Components/Home/CategoryList';
import GlobalApi from '../Services/GlobalApi';
import PlaceList from '../Components/Home/PlaceList';
import Colors from '../Shared/Colors';
import { UserLocationContext } from '../Context/UserLocationContext';

export default function Home() {
  const [placeList, setPlaceList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null); // Initialize selectedCategory
  const { location, setLocation } = useContext(UserLocationContext);

  useEffect(() => {
    if (location && selectedCategory) {
      if (selectedCategory !== 'hidden_gems') {
        // Fetch places from Google API for categories other than 'hidden_gems'
        GetNearBySearchPlace(selectedCategory);
      } else {
        // Do not fetch from Google API for 'hidden_gems'
        setPlaceList([]); // Optionally, clear the placeList or handle as needed
      }
    }
  }, [location, selectedCategory]);

  const GetNearBySearchPlace = async (value) => {
    try {
      const response = await GlobalApi.nearByPlace(
        location.coords.latitude,
        location.coords.longitude,
        value
      );
      setPlaceList(response.data.results);
    } catch (error) {
      console.error('Error fetching places:', error);
      setPlaceList([]); // Handle error by clearing the placeList
    }
  };

  return (
    <ScrollView style={{ padding: 20, backgroundColor: Colors.white, flex: 1 }}>
      <Header />
      <GoogleMapView placeList={placeList} />
      <CategoryList
        setSelectedCategory={(value) => setSelectedCategory(value)} // Update selectedCategory state
      />
      {selectedCategory && (
        <PlaceList
          placeList={placeList}
          selectedCategory={selectedCategory} // Pass selectedCategory to PlaceList
        />
      )}
    </ScrollView>
  );
}
