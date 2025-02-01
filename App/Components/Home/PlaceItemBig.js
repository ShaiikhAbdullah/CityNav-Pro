import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ToastAndroid,
  Linking,
  Platform,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Colors from '../../Shared/Colors';
import AntDesign from '@expo/vector-icons/AntDesign';
import HorizontalLine from './HorizontalLine';
import { deleteDoc, doc, getFirestore, setDoc } from 'firebase/firestore';
import { app } from '../../Shared/FireBaseConfig';
import Ionicons from '@expo/vector-icons/Ionicons';
import { FontAwesome } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth';

export default function PlaceItemBig({ place, isFav, markedFav }) {
  const db = getFirestore(app);
  const auth = getAuth(); // Initialize Firebase Authentication
  const user = auth.currentUser; // Get the currently logged-in user
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

      Linking.openURL(url).catchh((err) => {
        console.error('Error opening maps:', err);
      });
    } else {
      console.log('Location data is unavailable for this place.');
      // Optionally, display an alert to the user
    }
  };

  return (
    <View>
      {!isFav ? (
        <TouchableOpacity
          style={{
            position: 'absolute',
            right: 0,
            marginTop: 25,
            marginRight: 10,
            zIndex: 1,
          }}
          onPress={() => onSetFav(place)}
        >
          <Ionicons name='heart-outline' size={20} color='white' />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={{
            position: 'absolute',
            right: 0,
            marginTop: 25,
            marginRight: 10,
            zIndex: 1,
          }}
          onPress={() => onRemoveFav(place.name)}
        >
          <Ionicons name='heart-sharp' size={20} color='red' />
        </TouchableOpacity>
      )}

      {place?.photos ? (
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
          style={{
            width: '100%',
            height: 140,
            borderRadius: 15,
            marginTop: 20,
            marginBottom: 5,
          }}
        />
      ) : (
        <Image
          source={require('./../../../assets/placeholder.jpg')}
          style={{
            width: '100%',
            height: 130,
            borderRadius: 15,
            marginTop: 20,
            marginBottom: 5,
          }}
        />
      )}
      <Text
        numberOfLines={2}
        style={{ fontSize: 18, marginBottom: 2, fontFamily: 'raleway-bold' }}
      >
        {place.name}
      </Text>
      <Text
        style={{ fontSize: 16, marginBottom: 5, color: Colors.darkGray }}
        numberOfLines={2}
      >
        {place.vicinity}
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
      <HorizontalLine />
    </View>
  );
}
