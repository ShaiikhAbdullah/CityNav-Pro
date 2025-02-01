import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Colors from '../../Shared/Colors';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as Linking from 'expo-linking';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const navigation = useNavigation(); // Access the navigation prop

  const handleLogin = () => {
    navigation.navigate('LoginCredentialsScreen');
  };

  const handleSignup = () => {
    navigation.navigate('SignUpCredentials');
  };

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId:
      '1043703452536-b1k89ft3jseq6c7v5knonqe823filhl2.apps.googleusercontent.com',
    iosClientId: 'YOUR_IOS_CLIENT_ID', // Replace with your iOS Client ID
    androidClientId:
      '1043703452536-b1k89ft3jseq6c7v5knonqe823filhl2.apps.googleusercontent.com',
    webClientId:
      '1043703452536-b1k89ft3jseq6c7v5knonqe823filhl2.apps.googleusercontent.com',
    redirectUri: Linking.createURL('/'), // Dynamic redirect URI
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response.params;
      console.log('Google Sign-In Success:', authentication);
      // Handle successful Google Sign-In here
    }
  }, [response]);

  const onPressGoogleSignIn = async () => {
    if (request) {
      promptAsync();
    }
  };

  // Navigate to LoginWithEmail screen on button press
  const onPressEmailLogin = () => {
    navigation.navigate('LoginWithEmail');
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('./../../../assets/banners/login-banner-bg.png')}
        style={styles.bannerImage}
      />
      <View style={styles.content}>
        <Text style={styles.heading}>Navigate Your City Like a Pro</Text>
        <Text style={styles.desc}>
          Discover the Best Places, Routes, and Unforgettable Experiences with
          us!
        </Text>
        {/* Added New Sign in Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.loginButtonWrapper,
              { backgroundColor: Colors.primaryColor },
            ]}
            onPress={handleLogin}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.loginButtonWrapper]}
            onPress={handleSignup}
          >
            <Text style={styles.signupButtonText}>Sign-up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Change this to center for vertical alignment
    alignItems: 'center', // Align items horizontally in the center
    marginTop: 0,
  },
  bannerImage: {
    width: '100%',
    height: 300,
    objectFit: 'cover',
  },
  heading: {
    fontSize: 25,
    fontFamily: 'outfit-bold',
    textAlign: 'center',
    marginTop: 15,
    paddingLeft: 60,
    paddingRight: 60,
  },
  desc: {
    fontSize: 17,
    fontFamily: 'outfit-regular',
    marginTop: 15,
    textAlign: 'center',
    color: Colors.darkerGray,
    paddingLeft: 5,
    paddingRight: 5,
  },
  button: {
    backgroundColor: Colors.primaryColor,
    padding: 16,
    marginLeft: 40,
    marginRight: 40,
    borderRadius: 99,
    marginTop: 30,
  },
  EmailButton: {
    backgroundColor: Colors.black,
    padding: 16,
    marginLeft: 40,
    marginRight: 40,
    borderRadius: 99,
    marginTop: 10,
  },
  buttonText: {
    color: Colors.white,
    textAlign: 'center',
    fontFamily: 'raleway-regular',
    fontSize: 17,
  },
  buttonContainer: {
    marginTop: 20,
    marginLeft: 25,
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: Colors.primaryColor,
    width: '80%',
    height: 60,
    borderRadius: 100,
  },
  loginButtonWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
    borderRadius: 98,
  },
  loginButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontFamily: 'outfit-bold',
  },
  signupButtonText: {
    fontSize: 18,
    fontFamily: 'outfit-bold',
  },
});
