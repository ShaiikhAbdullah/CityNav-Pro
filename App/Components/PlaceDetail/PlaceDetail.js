// PlaceDetail.js
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  Linking,
  Dimensions,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import PlaceDetailItem from './PlaceDetailItem';
import Colors from '../../Shared/Colors';
import GoogleMapView from '../Home/GoogleMapView';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';

export default function PlaceDetail() {
  const route = useRoute();
  const { place } = route.params;
  const [currentPlace, setCurrentPlace] = useState(place);
  const navigation = useNavigation();

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

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <LinearGradient
      // Background Linear Gradient
      colors={[
        Colors.primaryColor,
        'rgba(255, 255, 255, 1.0)',
        'rgba(255, 255, 255, 0.5)',
        'transparent',
      ]}
      start={{ x: 0, y: 0 }} // Start from the top
      end={{ x: 0, y: 0.5 }} // End at the bottom, increasing the gradient length
      style={{
        width: Dimensions.get('screen').width,
        padding: 20,
        backgroundColor: Colors.white,
        flex: 1,
      }}
    >
      <ScrollView
      // style={{
      //   padding: 20,
      //   backgroundColor: Colors.white,
      //   flex: 1,
      // }}
      >
        <TouchableOpacity
          style={{
            height: 40,
            width: 40,
            // backgroundColor: Colors.shadeOfGray,
            // borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={handleGoBack}
        >
          <Ionicons name='arrow-back-outline' size={30} color='white' />
        </TouchableOpacity>
        {/* Pass onDirectionClick to PlaceItem */}
        <PlaceDetailItem
          place={currentPlace}
          onDirectionClick={onDirectionClick}
        />
        <GoogleMapView placeList={[currentPlace]} />
        <View style={{ marginBottom: 20 }}>
          <TouchableOpacity
            style={{
              backgroundColor: Colors.primaryColor,
              padding: 15,
              alignContent: 'center',
              alignItems: 'center',
              margin: 15,
              borderRadius: 50,
              marginBottom: 70,
            }}
            onPress={onDirectionClick}
          >
            <Text
              style={{
                fontFamily: 'raleway-regular',
                textAlign: 'center',
                color: Colors.white,
              }}
            >
              Get Direction on Google Map
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
