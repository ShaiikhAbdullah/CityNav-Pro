import { View, Text, Dimensions, Image, TextInput } from 'react-native';
import React, { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../../Shared/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function SearchBar({ setSearchText }) {
  const [searchInput, setSearchInput] = useState('');
  return (
    <View>
      <LinearGradient
        // Background Linear Gradient
        colors={[
          Colors.white,
          'rgba(255, 255, 255, 1.0)',
          'rgba(255, 255, 255, 0.5)',
          'transparent',
        ]}
        start={{ x: 0, y: 0 }} // Start from the top
        end={{ x: 0, y: 1 }} // End at the bottom, increasing the gradient length
        style={{ padding: 25, width: Dimensions.get('screen').width }}
      >
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 5,
          }}
        >
          <Text
            style={{ fontFamily: 'raleway-bold', fontSize: 35, marginTop: 10 }}
          >
            Discover
          </Text>
          <Image
            source={require('./../../../assets/icons/user-profile.png')}
            style={{
              width: 45,
              height: 45,
              borderRadius: 100,
              marginTop: 10,
              marginBottom: 5,
            }}
          />
        </View>

        <View
          style={{
            display: 'flex',
            marginTop: 5,
            flexDirection: 'row',
            padding: 10,
            gap: 5,
            elevation: 0.7,
            alignItems: 'center',
            backgroundColor: Colors.white,
            borderRadius: 5,
          }}
        >
          <Ionicons name='search' size={24} color={Colors.darkGray} />
          <TextInput
            placeholder='Search'
            style={{ backgroundColor: Colors.white, width: '80%' }}
            value={searchInput} // Binding the searchInput state to the input field
            onChangeText={(value) => setSearchInput(value)}
            onSubmitEditing={() => setSearchText(searchInput)}
          />
        </View>
      </LinearGradient>
    </View>
  );
}
