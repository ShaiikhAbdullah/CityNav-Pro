import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SimpleLineIcons } from '@expo/vector-icons';
import Colors from '../../Shared/Colors';
import { FIREBASE_AUTH } from '../../../FirebaseConfig';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as Linking from 'expo-linking';

WebBrowser.maybeCompleteAuthSession();

export default function SignUpCredentials() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState(''); // New state for Display Name
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;
  const [secureEntry, setSecureEntry] = useState(true);

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId:
      '1043703452536-b1k89ft3jseq6c7v5knonqe823filhl2.apps.googleusercontent.com',
    iosClientId: 'YOUR_IOS_CLIENT_ID',
    androidClientId:
      '1043703452536-b1k89ft3jseq6c7v5knonqe823filhl2.apps.googleusercontent.com',
    webClientId:
      '1043703452536-b1k89ft3jseq6c7v5knonqe823filhl2.apps.googleusercontent.com',
    redirectUri: Linking.createURL('/'),
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response.params;
      console.log('Google Sign-In Success:', authentication);
    }
  }, [response]);

  const signUp = async () => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Update the user profile with display name
      await updateProfile(user, { displayName });
      console.log('User signed up:', user);
      alert('Sign-up successful! Please check your email for verification.');
    } catch (error) {
      console.log(error);
      alert('Sign up Failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleLogin = () => {
    navigation.navigate('LoginCredentialsScreen');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButtonWrapper} onPress={handleGoBack}>
        <Ionicons name='arrow-back-outline' size={30} color='black' />
      </TouchableOpacity>
      <View style={styles.textContainer}>
        <Text style={styles.headingText}>Create</Text>
        <Text style={styles.headingText}>Your Account</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Ionicons
            name={'person-outline'}
            size={30}
            color={Colors.secondary}
          />
          <TextInput
            style={styles.textInput}
            placeholder='Enter your display name'
            placeholderTextColor={Colors.secondary}
            value={displayName}
            onChangeText={(text) => setDisplayName(text)}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name={'mail-outline'} size={30} color={Colors.secondary} />
          <TextInput
            style={styles.textInput}
            placeholder='Enter your email'
            placeholderTextColor={Colors.secondary}
            keyboardType='email-address'
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
        </View>

        <View style={styles.inputContainer}>
          <SimpleLineIcons name={'lock'} size={30} color={Colors.secondary} />
          <TextInput
            style={styles.textInput}
            placeholder='Enter your password'
            placeholderTextColor={Colors.secondary}
            secureTextEntry={secureEntry}
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
          <TouchableOpacity onPress={() => setSecureEntry((prev) => !prev)}>
            <SimpleLineIcons name={'eye'} size={20} color={Colors.secondary} />
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size='large' color='#0000ff' />
        ) : (
          <TouchableOpacity style={styles.loginButtonWrapper} onPress={signUp}>
            <Text style={styles.loginText}>Sign Up</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.continueText}>or continue with</Text>
        <TouchableOpacity
          style={styles.googleButtonContainer}
          onPress={() => promptAsync()}
        >
          <Image
            source={require('../../../assets/icons/google.png')}
            style={styles.googleImage}
          />
          <Text style={styles.googleText}>Google</Text>
        </TouchableOpacity>

        <View style={styles.footerContainer}>
          <Text style={styles.accountText}>Already have an account?</Text>
          <TouchableOpacity onPress={handleLogin}>
            <Text style={styles.signupText}>Log in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 20,
    paddingTop: 35,
  },
  backButtonWrapper: {
    height: 40,
    width: 40,
    backgroundColor: Colors.shadeOfGray,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    left: -5,
    top: 10,
  },
  textContainer: {
    marginVertical: 20,
  },
  headingText: {
    fontSize: 32,
    color: Colors.black,
    fontFamily: 'outfit-bold',
  },
  formContainer: {
    marginTop: 0,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: Colors.secondary,
    borderRadius: 100,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 2,
    marginVertical: 10,
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontFamily: 'outfit-regular',
  },
  loginButtonWrapper: {
    backgroundColor: Colors.black,
    borderRadius: 100,
    marginTop: 20,
  },
  loginText: {
    color: Colors.white,
    fontSize: 20,
    fontFamily: 'outfit-regular',
    textAlign: 'center',
    padding: 10,
  },
  continueText: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 14,
    fontFamily: 'outfit-regular',
    color: Colors.black,
  },
  googleButtonContainer: {
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: Colors.black,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    gap: 10,
  },
  googleImage: {
    height: 20,
    width: 20,
  },
  googleText: {
    fontSize: 20,
    fontFamily: 'outfit-regular',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    gap: 5,
  },
  accountText: {
    color: Colors.black,
    fontFamily: 'outfit-regular',
  },
  signupText: {
    color: Colors.black,
    fontFamily: 'outfit-bold',
  },
});
