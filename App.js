import { ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import TabNavigation from './App/Navigations/TabNavigation';
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { UserLocationContext } from './App/Context/UserLocationContext';
import { useFonts } from 'expo-font';
import LoginScreen from './App/Components/LoginScreen/LoginScreen';
import * as SecureStore from 'expo-secure-store';
import * as Linking from 'expo-linking';
import LoginWithEmail from './App/Components/LoginScreen/LoginWithEmail';
import HomeNavigation from './App/Navigations/HomeNavigation';
import { onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from './FirebaseConfig';
import LoginCredentialsScreen from './App/Components/LoginScreen/LoginCredentialsScreen';
import SignUpCredentials from './App/Components/SignUpScreen/SignUpCredentials';
import Profile from './App/Screens/Profile';
import Fav from './App/Screens/Fav';

// Token cache for Clerk authentication
const tokenCache = {
  async getToken(key) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key, value) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

// Deep linking configuration
const linking = {
  prefixes: [Linking.createURL('/')], // Instead of makeUrl
  config: {
    screens: {
      Home: 'home',
      Search: 'search',
      Favorites: 'favorites', // Use 'favorites' here for consistency
      Profile: 'profile',
    },
  },
};

const Stack = createNativeStackNavigator();
const InsideStack = createNativeStackNavigator();

function InsideLayout() {
  return (
    <InsideStack.Navigator>
      <InsideStack.Screen name='Home' component={TabNavigation} />
    </InsideStack.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      console.log('user', user);
      setUser(user);
    });
  }, []);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const [fontsLoaded] = useFonts({
    'raleway-regular': require('./assets/Fonts/Raleway-Regular.ttf'),
    'raleway-bold': require('./assets/Fonts/Raleway-SemiBold.ttf'),
    'outfit-regular': require('./assets/Fonts/Outfit-Regular.ttf'),
    'outfit-bold': require('./assets/Fonts/Outfit-Bold.ttf'),
  });

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  if (!fontsLoaded) {
    return <ActivityIndicator size='large' color='#0000ff' />;
  }

  return (
    <UserLocationContext.Provider value={{ location, setLocation }}>
      <NavigationContainer linking={linking}>
        <Stack.Navigator initialRouteName='Login'>
          {user ? (
            <Stack.Screen
              name='TabNavigation'
              component={TabNavigation}
              options={{ title: 'Home', headerShown: false }}
            />
          ) : (
            <>
              <Stack.Screen
                name='Login'
                component={LoginScreen}
                options={{ title: 'Login', headerShown: false }}
              />
              <Stack.Screen
                name='LoginCredentialsScreen'
                component={LoginCredentialsScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name='SignUpCredentials'
                component={SignUpCredentials}
                options={{ headerShown: false }}
              />
              <Stack.Screen name='Profile' component={Profile} />
              <Stack.Screen name='Fav' component={Fav} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </UserLocationContext.Provider>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
