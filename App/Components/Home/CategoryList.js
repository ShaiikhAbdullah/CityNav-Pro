// CategoryList.js
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import React from 'react';
import CategoryItem from './CategoryItem';

export default function CategoryList({ setSelectedCategory }) {
  const categoryList = [
    {
      id: 2,
      name: 'Restaurants',
      value: 'restaurant',
      icon: require('./../../../assets/icons/restaurant.png'),
    },
    {
      id: 1,
      name: 'Gas Station',
      value: 'gas_station',
      icon: require('./../../../assets/icons/gas-station.png'),
    },
    {
      id: 3,
      name: 'Cafe',
      value: 'cafe',
      icon: require('./../../../assets/icons/cafe.png'),
    },
    {
      id: 0,
      name: 'Hidden Gems',
      value: 'hidden_gems',
      icon: require('./../../../assets/icons/gem.png'),
    },
    {
      id: 4,
      name: 'First Aid',
      value: 'hospital',
      icon: require('./../../../assets/icons/first-aid.png'),
    },
  ];

  return (
    <View style={{ marginTop: 15 }}>
      <Text
        style={{
          fontSize: 20,
          fontFamily: 'raleway-regular',
        }}
      >
        Select Top Category
      </Text>

      <FlatList
        data={categoryList}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              console.log('Category Pressed:', item.value); // Log the selected category
              setSelectedCategory(item.value); // Update the selected category state
            }}
          >
            <CategoryItem category={item} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
