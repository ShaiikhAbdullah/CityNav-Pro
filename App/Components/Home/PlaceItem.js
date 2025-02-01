// PlaceItem.js
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ToastAndroid,
  Linking,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';
import Colors from '../../Shared/Colors';
import HorizontalLine from './HorizontalLine';
import { deleteDoc, doc, getFirestore, setDoc } from 'firebase/firestore';
import { app } from '../../Shared/FireBaseConfig';
import Ionicons from '@expo/vector-icons/Ionicons';
import { getAuth } from 'firebase/auth';
import { FontAwesome } from '@expo/vector-icons';
import { Platform } from 'react-native';

export default function PlaceItem({ place, isFav, markedFav }) {
  // const { user } = useUser();
  const auth = getAuth(); // Initialize Firebase Authentication
  const user = auth.currentUser; // Get the currently logged-in user

  const db = getFirestore(app);

  const onSetFav = async (place) => {
    try {
      await setDoc(doc(db, 'citynav-fav-place', place.name), {
        place: place,
        email: user?.email,
      });
      markedFav();
      ToastAndroid.show('Fav Added!', ToastAndroid.SHORT);
    } catch (error) {
      console.error('Error adding favorite:', error);
      ToastAndroid.show('Failed to add favorite', ToastAndroid.SHORT);
    }
  };

  const onRemoveFav = async (placeName) => {
    console.log(placeName);

    await deleteDoc(doc(db, 'citynav-fav-place', placeName));
    ToastAndroid.show('Fav Removed!', ToastAndroid.SHORT);
    markedFav();
  };

  const [currentPlace, setCurrentPlace] = useState(place);

  useEffect(() => {
    setCurrentPlace(place);
  }, [place]);

  const onDirectionClick = () => {
    if (currentPlace.geometry && currentPlace.geometry.location) {
      const { lat, lng } = currentPlace.geometry.location;
      const url = Platform.select({
        ios: `maps:${lat},${lng}?q=${currentPlace.vicinity}`,
        android: `geo:${lat},${lng}?q=${currentPlace.vicinity}`,
      });

      Linking.openURL(url).catch((err) => {
        console.error('Error opening maps:', err);
      });
    } else {
      console.log('Location data is unavailable for this place.');
      // Optionally, display an alert to the user
    }
  };

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
        gap: 15,
        marginTop: 20,
      }}
    >
      <View>
        {!isFav ? (
          <TouchableOpacity
            style={{ position: 'absolute', right: 0, margin: 8, zIndex: 1 }}
            onPress={() => onSetFav(place)}
          >
            <Ionicons name='heart-outline' size={20} color='white' />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={{ position: 'absolute', right: 0, margin: 8, zIndex: 1 }}
            onPress={() => onRemoveFav(place.name)}
          >
            <Ionicons name='heart-sharp' size={20} color='red' />
          </TouchableOpacity>
        )}
        {place?.photos || place?.image ? (
          <Image
            source={{
              uri: place.photos
                ? 'https://maps.googleapis.com/maps/api/place/photo' +
                  '?maxwidth=400' +
                  '&photo_reference=' +
                  place.photos[0].photo_reference +
                  '&key=AIzaSyCcWkFbKmC3opihlQj4seogwfqATmX9FXM'
                : place.image, // Use the image URL from HiddenGems.json
            }}
            style={{ width: 110, height: 110, borderRadius: 15 }}
          />
        ) : (
          <Image
            source={require('./../../../assets/placeholder.jpg')}
            style={{ width: 110, height: 110, borderRadius: 15 }}
          />
        )}
        {/* // Update the image rendering logic inside PlaceItem component */}
        {/* {place?.photos?.[0]?.photo_reference || place?.image ? (
          <Image
            source={
              place.image
                ? { uri: `file://${place.image}` } // Corrected file URI for local image
                : place?.photos?.[0]?.photo_reference
                ? {
                    uri:
                      'https://maps.googleapis.com/maps/api/place/photo' +
                      '?maxwidth=400' +
                      '&photo_reference=' +
                      place.photos[0].photo_reference +
                      '&key=AIzaSyCcWkFbKmC3opihlQj4seogwfqATmX9FXM', // Ensure photo_reference exists
                  }
                : null // Fallback in case no photo reference is available
            }
            style={{ width: 110, height: 110, borderRadius: 15 }}
          />
        ) : (
          <Image
            source={require('./../../../assets/placeholder.jpg')} // Local placeholder image
            style={{ width: 110, height: 110, borderRadius: 15 }}
          />
        )} */}
      </View>
      <View style={{ flex: 1 }}>
        <Text
          numberOfLines={2}
          style={{ fontSize: 18, marginBottom: 5, fontFamily: 'raleway-bold' }}
        >
          {place.name}
        </Text>
        {/* for address */}
        <Text
          style={{ fontSize: 16, marginBottom: 5, color: Colors.darkGray }}
          numberOfLines={2}
        >
          {place.vicinity || place.address || 'Address not available'}
        </Text>
        <View
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            flexDirection: 'row',
          }}
        >
          <AntDesign name='star' size={20} color={Colors.yellowRatingStar} />
          <Text>{place.rating}</Text>
          <TouchableOpacity
            onPress={() => onDirectionClick()}
            style={{
              padding: 4,
              backgroundColor: Colors.primaryColor,
              borderRadius: 6,
              paddingHorizontal: 8,
              alignSelf: 'flex-end', // Ensure it moves to the right
              marginLeft: 'auto', // Push it to the right within the row
            }}
          >
            <FontAwesome name='location-arrow' size={15} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>
      <HorizontalLine />
    </View>
  );
}
