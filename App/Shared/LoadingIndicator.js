import React, { useEffect, useRef } from 'react';
import { View, Image, Animated, StyleSheet } from 'react-native';

export default function LoadingIndicator() {
  // Create an animated value
  const rotateValue = useRef(new Animated.Value(0)).current;

  // Rotate animation
  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateValue, {
        toValue: 1,
        duration: 2000, // 2 seconds
        useNativeDriver: true, // Use native driver for performance
      })
    ).start();
  }, [rotateValue]);

  // Interpolate the animation value to get a rotation from 0 to 360 degrees
  const rotate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      {/* Use your logo here */}
      <Animated.Image
        source={require('./../../assets/logo.png')} // Adjust path to your logo
        style={[styles.logo, { transform: [{ rotate }] }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 70, // Adjust the size as per your logo
    height: 70,
  },
});
