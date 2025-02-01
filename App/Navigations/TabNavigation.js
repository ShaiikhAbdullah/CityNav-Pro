import { View, Text } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeNavigation from './HomeNavigation';
import Fav from '../Screens/Fav';
import Search from '../Screens/Search';
import Profile from '../Screens/Profile';
import { Ionicons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function TabNavigation() {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#2596be',
        tabBarInactiveTintColor: '#8e8e93',
        tabBarHideOnKeyboard: true, // This ensures the tab bar is hidden on keyboard
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
            return <Ionicons name={iconName} color={color} size={size} />;
          } else if (route.name === 'Search') {
            iconName = 'search';
            return <Ionicons name={iconName} color={color} size={size} />;
          } else if (route.name === 'Fav') {
            iconName = 'heart';
            return <Ionicons name={iconName} color={color} size={size} />;
          } else if (route.name === 'Profile') {
            iconName = 'user-circle-o';
            return <FontAwesome name={iconName} color={color} size={size} />;
          }
        },
        tabBarStyle: {
          height: 60,
          paddingTop: 10,
          paddingBottom: 10,
          paddingHorizontal: 20,
          borderTopLeftRadius: 50,
          borderTopRightRadius: 50,
          backgroundColor: '#fff',
          position: 'absolute',
          left: 1,
          right: 1,
          bottom: 0,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          paddingBottom: 0,
          marginTop: 5,
        },
        tabBarIconStyle: {
          marginBottom: -5,
        },
      })}
    >
      <Tab.Screen
        name='Home'
        component={HomeNavigation}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen
        name='Search'
        component={Search}
        options={{ tabBarLabel: 'Search' }}
      />
      <Tab.Screen name='Fav' component={Fav} options={{ tabBarLabel: 'Fav' }} />
      <Tab.Screen
        name='Profile'
        component={Profile}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
}
