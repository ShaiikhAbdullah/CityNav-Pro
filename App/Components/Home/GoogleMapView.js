import { View, Text, Dimensions } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { UserLocationContext } from '../../Context/UserLocationContext';
import PlaceMarker from './PlaceMarker';

export default function GoogleMapView({ placeList }) {
  const [mapRegion, setMapRegion] = useState(null);

  const { location, setLocation } = useContext(UserLocationContext);
  useEffect(() => {
    if (location) {
      setMapRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0122,
        longitudeDelta: 0.0421,
      });
    }
  }, [location]);

  if (!mapRegion) {
    return null; // Or a loading spinner
  }

  return (
    <View style={{ marginTop: 20 }}>
      <Text
        style={{
          fontSize: 20,
          marginBottom: 10,
          fontWeight: '600',
          fontFamily: 'raleway-bold',
        }}
      >
        Top Near By Places
      </Text>
      <View style={{ borderRadius: 20, overflow: 'hidden' }}>
        {location ? (
          <MapView
            style={{
              width: Dimensions.get('screen').width * 0.89,
              height: Dimensions.get('screen').height * 0.23,
              borderRadius: 10,
            }}
            provider={PROVIDER_GOOGLE}
            showsUserLocation={true}
            region={mapRegion}
          >
            <Marker title='You' coordinate={mapRegion} />
            {placeList.map(
              (item, index) => index <= 5 && <PlaceMarker item={item} />
            )}
          </MapView>
        ) : null}
      </View>
    </View>
  );
}
