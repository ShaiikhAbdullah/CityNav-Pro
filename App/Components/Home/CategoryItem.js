import { View, Text, Image } from 'react-native';
import React from 'react';
import Colors from '../../Shared/Colors';

export default function CategoryItem({ category }) {
  return (
    <View
      style={{
        padding: 5,
        alignItems: 'center',
        margin: 5,
        marginTop: 15,
        width: 100,
        height: 100,
        justifyContent: 'center',
        borderRadius: 15,
        elevation: 3,
        backgroundColor: Colors.shadeOfGray,
      }}
    >
      <Image
        source={category.icon}
        style={{ width: 40, height: 40, marginBottom: 5, marginTop: 5 }}
      />
      <Text style={{ fontSize: 13, fontFamily: 'raleway-regular' }}>
        {category.name}
      </Text>
    </View>
  );
}
