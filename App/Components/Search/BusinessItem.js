import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import React from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';
import Colors from '../../Shared/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { deleteDoc, doc, getFirestore, setDoc } from 'firebase/firestore';
import { app } from '../../Shared/FireBaseConfig';
import { getAuth } from 'firebase/auth';

export default function BusinessItem({ place, isFav, markedFav }) {
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
  return (
    <View
      style={{
        width: 140,
        backgroundColor: Colors.white,
        borderRadius: 10,
        padding: 10,
        margin: 5,
        elevation: 0.4,
      }}
    >
      <View>
        {!isFav ? (
          <TouchableOpacity
            style={{ position: 'absolute', right: 0, margin: 5, zIndex: 1 }}
            onPress={() => onSetFav(place)}
          >
            <Ionicons name='heart-outline' size={20} color='white' />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={{ position: 'absolute', right: 0, margin: 5, zIndex: 1 }}
            onPress={() => onRemoveFav(place.name)}
          >
            <Ionicons name='heart-sharp' size={20} color='red' />
          </TouchableOpacity>
        )}

        {place?.photos ? (
          <Image /*showing the image from url, we use 'uri' */
            source={{
              uri:
                'https://maps.googleapis.com/maps/api/place/photo' +
                '?maxwidth=400' +
                '&photo_reference=' +
                place?.photos[0]?.photo_reference +
                '&key=AIzaSyCcWkFbKmC3opihlQj4seogwfqATmX9FXM',
            }}
            style={{ width: 120, height: 80, borderRadius: 10 }}
          />
        ) : (
          <Image
            source={require('./../../../assets/placeholder.jpg')}
            style={{ width: 130, height: 100, borderRadius: 9 }}
          />
        )}
      </View>
      <Text
        numberOfLines={2}
        style={{ fontSize: 16, marginTop: 5, fontFamily: 'raleway-bold' }}
      >
        {place.name}
      </Text>
      {/* for address */}
      <Text
        style={{ fontSize: 13, marginTop: 5, color: Colors.darkGray }}
        numberOfLines={2}
      >
        {place.vicinity ? place.vicinity : place.formatted_address}
      </Text>
      <View
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          flexDirection: 'row',
          marginBottom: -5,
        }}
      >
        <AntDesign name='star' size={20} color={Colors.yellowRatingStar} />
        <Text>{place.rating}</Text>
      </View>
    </View>
  );
}
