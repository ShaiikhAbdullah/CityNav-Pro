// PlaceMarker.js
import { View, Text } from 'react-native';
import React from 'react';
import { Marker } from 'react-native-maps';

export default function PlaceMarker({ item }) {
  // Safely access geometry.location
  const location =
    item.geometry && item.geometry.location ? item.geometry.location : null;

  if (!location) {
    console.log(`Location data is missing for place: ${item.name}`);
    return null; // Optionally, return a default marker or handle accordingly
  }

  return (
    <Marker
      title={item.name}
      coordinate={{
        latitude: location.lat || location.latitude,
        longitude: location.lng || location.longitude,
      }}
    />
  );
}
