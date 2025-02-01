// // Import the functions you need from the SDKs you need
// import { initializeApp } from 'firebase/app';
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: 'AIzaSyBlTrd0mdSwH8sPonY9eosNVmrKXjVGiAQ',
//   authDomain: 'citynav-pro-6462d.firebaseapp.com',
//   databaseURL: 'https://citynav-pro-6462d-default-rtdb.firebaseio.com',
//   projectId: 'citynav-pro-6462d',
//   storageBucket: 'citynav-pro-6462d.appspot.com',
//   messagingSenderId: '35548366786',
//   appId: '1:35548366786:web:6a93479735033ab8ceb85b',
// };

// // Initialize Firebase
// export const app = initializeApp(firebaseConfig);

//----------------------------------------------------
// Import the necessary functions and libraries
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBlTrd0mdSwH8sPonY9eosNVmrKXjVGiAQ',
  authDomain: 'citynav-pro-6462d.firebaseapp.com',
  databaseURL: 'https://citynav-pro-6462d-default-rtdb.firebaseio.com',
  projectId: 'citynav-pro-6462d',
  storageBucket: 'citynav-pro-6462d.appspot.com',
  messagingSenderId: '35548366786',
  appId: '1:35548366786:web:6a93479735033ab8ceb85b',
};

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with AsyncStorage for persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
