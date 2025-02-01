import { View, Text } from 'react-native';
import React from 'react';
import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack';
import Home from '../Screens/Home';
import PlaceDetail from '../Components/PlaceDetail/PlaceDetail';
import Colors from '../Shared/Colors';
import LoginWithEmail from '../Components/LoginScreen/LoginWithEmail';

const Stack = createStackNavigator();

export default function HomeNavigation() {
  const isAndroid = true;

  return (
    <Stack.Navigator
      screenOptions={{
        gestureEnabled: true,
        ...(isAndroid && TransitionPresets.ModalPresentationIOS),
      }}
    >
      <Stack.Screen
        name='Home'
        component={Home}
        options={{ headerShown: false }} // Hiding the header
      />
      <Stack.Screen
        name='place-detail'
        component={PlaceDetail}
        options={{
          title: '',
          headerShown: false,
          headerStyle: {
            backgroundColor: Colors.primaryColor,
            elevation: 0,
          },
          headerTintColor: Colors.white,
        }}
        screenOptions={{ presentation: 'modal' }}
      />
    </Stack.Navigator>
  );
}
