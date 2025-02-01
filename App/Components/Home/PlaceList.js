// PlaceList.js
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  Button,
  StyleSheet,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import PlaceItem from './PlaceItem';
import PlaceItemBig from './PlaceItemBig';
import { useNavigation } from '@react-navigation/native';
import { getCurrentCity } from '../../Services/LocationUtils';
import hiddenGemsData from './../../../HiddenGems.json'; // Ensure the path is correct
import Colors from '../../Shared/Colors';
import { getFirestore } from 'firebase/firestore';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { app } from '../../Shared/FireBaseConfig';

export default function PlaceList({ placeList, selectedCategory }) {
  const [places, setPlaces] = useState([]);
  const [manualCity, setManualCity] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const navigator = useNavigation();

  // const { user } = useUser();
  const auth = getAuth(); // Initialize Firebase Authentication
  const user = auth.currentUser; // Get the currently logged-in user

  const [favList, setFavList] = useState([]);

  useEffect(() => {
    async function fetchHiddenGems() {
      console.log('Selected Category:', selectedCategory); // Log selectedCategory

      if (selectedCategory === 'hidden_gems') {
        console.log('Fetching Hidden Gems...');
        const city = await getCurrentCity();
        if (city) {
          console.log('Current City:', city);
          const cityKey = city.toLowerCase();
          if (hiddenGemsData[cityKey]) {
            // Add local image path to each hidden gem place
            const hiddenGems = hiddenGemsData[cityKey].places.map((place) => ({
              ...place,
              image: `/assets/HiddenGems/${place.image}`, // Path to local image
            }));
            console.log('Hidden Gems Found:', hiddenGems);
            setPlaces(hiddenGems);
          } else {
            console.log(`No hidden gems available for ${city}`);
            setPlaces([]); // No hidden gems for this city
          }
        } else {
          console.log('Unable to retrieve current city.');
          setModalVisible(true); // Prompt manual selection
        }
      } else {
        console.log('Setting places from placeList:', placeList);
        setPlaces(placeList); // Use the passed placeList for other categories
      }
    }

    fetchHiddenGems();
  }, [selectedCategory, placeList]);

  const onPlaceClick = (item) => {
    navigator.navigate('place-detail', { place: item });
  };

  const handleManualCitySelection = (city) => {
    setManualCity(city);
    setModalVisible(false);
    const cityKey = city.toLowerCase();
    if (hiddenGemsData[cityKey]) {
      const hiddenGems = hiddenGemsData[cityKey].places;
      console.log(
        `Hidden Gems Found for manually selected city (${city}):`,
        hiddenGems
      );
      setPlaces(hiddenGems);
    } else {
      console.log(
        `No hidden gems available for manually selected city (${city})`
      );
      setPlaces([]); // No hidden gems for this city
    }
  };

  // Handle cases where no hidden gems are found
  if (
    selectedCategory === 'hidden_gems' &&
    places.length === 0 &&
    !manualCity
  ) {
    return (
      <View style={{ marginTop: 20 }}>
        <Text style={{ fontSize: 16, color: Colors.darkGray }}>
          No hidden gems found in your area.
        </Text>
      </View>
    );
  }

  // get data from firestore
  const db = getFirestore(app);
  useEffect(() => {
    user && getFav();
  }, [user]);

  const getFav = async () => {
    setFavList([]);
    const q = query(
      collection(db, 'citynav-fav-place'),
      where('email', '==', user?.email)
    );

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, ' => ', doc.data());
      setFavList((favList) => [...favList, doc.data()]);
    });
  };

  const isFav = (place) => {
    const result = favList.find((item) => item.place.name == place.name);
    console.log(result);
    return result ? true : false;
  };

  return (
    <View style={{ marginBottom: 50 }}>
      <Text
        style={{
          fontSize: 20,
          fontFamily: 'raleway-bold',
          marginTop: 10,
        }}
      >
        Found {places.length} Places
      </Text>

      <FlatList
        style={{ marginBottom: 50 }}
        data={places}
        keyExtractor={(item, index) => `${item.name}-${index}`} // Added keyExtractor for better performance
        renderItem={({ item, index }) => (
          <TouchableOpacity onPress={() => onPlaceClick(item)}>
            {index % 4 === 0 ? (
              <PlaceItemBig
                place={item}
                isFav={isFav(item)}
                markedFav={() => getFav()}
              />
            ) : (
              <PlaceItem
                place={item}
                isFav={isFav(item)}
                markedFav={() => getFav()}
              />
            )}
          </TouchableOpacity>
        )}
      />

      {/* Modal for Manual City Selection */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType='slide'
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}
        >
          <View
            style={{
              width: '80%',
              backgroundColor: 'white',
              padding: 20,
              borderRadius: 10,
            }}
          >
            <Text style={{ fontSize: 18, marginBottom: 10 }}>
              Select Your City
            </Text>
            {/* Replace the buttons below with a more dynamic list or dropdown as needed */}
            <Button
              title='Rawalpindi'
              onPress={() => handleManualCitySelection('rawalpindi')}
            />
            <Button
              title='Islamabad'
              onPress={() => handleManualCitySelection('islamabad')}
            />
            {/* Add more cities as needed */}
            <Button
              title='Cancel'
              onPress={() => setModalVisible(false)}
              color='red'
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}
