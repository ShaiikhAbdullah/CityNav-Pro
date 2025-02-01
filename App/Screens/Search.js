import { View, Text, StyleSheet } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import GoogleMapViewFull from '../Components/Search/GoogleMapViewFull';
import SearchBar from '../Components/Search/SearchBar';
import { UserLocationContext } from '../Context/UserLocationContext';
import GlobalApi from '../Services/GlobalApi';
import BusinessList from '../Components/Search/BusinessList';

export default function Search() {
  const [placeList, setPlaceList] = useState([]);
  const { location, setLocation } = useContext(UserLocationContext);

  useEffect(() => {
    if (location) {
      GetNearBySearchPlace('restaurant');
    }
  }, []);

  const GetNearBySearchPlace = (value) => {
    GlobalApi.searchByText(value).then((resp) => {
      setPlaceList(resp.data.results);
    });
  };
  return (
    <View style={styles.container}>
      <View style={styles.searchBarContainer}>
        <SearchBar setSearchText={(value) => GetNearBySearchPlace(value)} />
      </View>

      <GoogleMapViewFull placeList={placeList} />
      <View style={{ position: 'absolute', zIndex: 20, bottom: 0 }}>
        <BusinessList placeList={placeList} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ensures the container takes the full height of the screen
  },
  searchBarContainer: {
    position: 'absolute',
    zIndex: 20,
  },
  businessListContainer: {
    position: 'absolute',
    zIndex: 20,
    bottom: 0,
    width: '100%', // Ensures that the business list touches the bottom
  },
});
