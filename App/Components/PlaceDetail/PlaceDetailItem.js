// PlaceDetailItem.js
import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';
import Colors from '../../Shared/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import Share from '../../Services/Share';

export default function PlaceDetailItem({ place, onDirectionClick }) {
  // Determine if the place has photos from Google API or from HiddenGems.json
  const hasGooglePhotos = place.photos && place.photos.length > 0;
  const hasCustomImage = place.image && place.image.length > 0;

  return (
    <View>
      <Text style={{ fontSize: 26, fontFamily: 'raleway-bold' }}>
        {place.name}
      </Text>
      <View
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          marginTop: 5,
          flexDirection: 'row',
        }}
      >
        <AntDesign name='star' size={20} color={Colors.yellowRatingStar} />
        <Text>{place.rating}</Text>
      </View>

      {hasGooglePhotos ? (
        <Image
          source={{
            uri:
              'https://maps.googleapis.com/maps/api/place/photo' +
              '?maxwidth=400' +
              '&photo_reference=' +
              place.photos[0].photo_reference +
              '&key=AIzaSyCcWkFbKmC3opihlQj4seogwfqATmX9FXM',
          }}
          style={{
            width: '100%',
            height: 160,
            borderRadius: 15,
            marginTop: 10,
          }}
        />
      ) : hasCustomImage ? (
        <Image
          source={{
            uri: place.image.startsWith('http')
              ? place.image
              : 'https://via.placeholder.com/150',
          }}
          style={{
            width: '100%',
            height: 160,
            borderRadius: 15,
            marginTop: 10,
          }}
        />
      ) : (
        <Image
          source={{ uri: 'https://via.placeholder.com/150' }}
          style={{
            width: '100%',
            height: 160,
            borderRadius: 15,
            marginTop: 10,
          }}
        />
      )}

      <Text
        style={{ fontSize: 16, marginTop: 10, color: Colors.darkGray }}
        numberOfLines={2}
      >
        {place.vicinity ? place.vicinity : place.formatted_address}
      </Text>

      {place?.opening_hours ? (
        <Text
          style={{
            fontFamily: 'raleway-regular',
            color: place?.opening_hours?.open_now ? 'green' : 'red',
          }}
        >
          {place?.opening_hours?.open_now ? '(Open)' : '(Closed)'}
        </Text>
      ) : null}
      <View
        style={{
          marginTop: 10,
          flexDirection: 'row',
          display: 'flex',
          gap: 10,
        }}
      >
        <TouchableOpacity
          onPress={onDirectionClick}
          style={{
            direction: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 5,
            backgroundColor: Colors.shadeOfGray,
            width: 110,
            padding: 10,
            paddingRight: 20,
            paddingLeft: 15,
            borderRadius: 40,
            justifyContent: 'center',
          }}
        >
          <Ionicons name='navigate-circle-outline' size={24} color='black' />
          <Text style={{ fontFamily: 'raleway-regular', fontSize: 16 }}>
            Direction
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => Share.SharePlace(place)}
          style={{
            direction: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 5,
            backgroundColor: Colors.shadeOfGray,
            width: 90,
            padding: 10,
            paddingRight: 15,
            borderRadius: 40,
            justifyContent: 'center',
          }}
        >
          <Ionicons name='share-outline' size={22} color='black' />
          <Text style={{ fontFamily: 'raleway-regular', fontSize: 16 }}>
            Share
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
