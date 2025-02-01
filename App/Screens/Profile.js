import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Modal,
  StyleSheet,
  ToastAndroid, // Import Toast for Android notifications
} from 'react-native';
import React, { useState } from 'react';
import { getAuth } from 'firebase/auth';
import * as ImagePicker from 'expo-image-picker'; // Import ImagePicker for gallery and camera
import Colors from '../Shared/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
// import storage from '@react-native-firebase/storage';

export default function Profile() {
  const Menu = [
    {
      id: 1,
      name: 'Add New Hidden Gem',
      icon: 'add-circle',
      path: 'add-new-hidden-gem',
    },
    { id: 2, name: 'Favorites', icon: 'heart', path: 'Fav' },
    { id: 3, name: 'Logout', icon: 'exit', path: 'Logout' },
  ];

  const auth = getAuth();
  const user = auth.currentUser;
  const navigation = useNavigation();

  const [modalVisible, setModalVisible] = useState(false);
  const [profileImage, setProfileImage] = useState(null); // Store the image URI
  const [hasProfileImage, setHasProfileImage] = useState(false);

  const onPressMenu = (menu) => {
    if (menu.name === 'Logout') {
      auth.signOut();
      return;
    } else if (menu.name === 'Favorites') {
      navigation.navigate('Fav');
    } else if (menu.name === 'Add New Hidden Gem') {
      navigation.navigate('AddNewHiddenGem');
    }
  };

  const handleCameraPress = () => {
    setModalVisible(true);
  };

  const handleUploadProfile = async () => {
    // Request permission to access the gallery
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      alert('Permission to access the media library is required!');
      return;
    }

    // Let the user pick an image from the gallery
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    // Debugging the picker result
    console.log('Picker result:', pickerResult);

    // Check if the pickerResult contains an image
    if (
      !pickerResult.canceled &&
      pickerResult.assets &&
      pickerResult.assets.length > 0
    ) {
      const { uri } = pickerResult.assets[0];

      try {
        // Get the image's filename
        const fileName = uri.substring(uri.lastIndexOf('/') + 1);

        // Create a reference to Firebase Storage
        const storageRef = storage().ref(`profile_images/${fileName}`);

        // Convert the image URI to a blob and upload it
        const response = await fetch(uri);
        const blob = await response.blob();

        // Upload the image
        const uploadTask = storageRef.put(blob);

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
          },
          (error) => {
            console.log('Upload failed:', error);
          },
          async () => {
            // Get the download URL of the uploaded image
            const downloadUrl = await storageRef.getDownloadURL();
            setProfileImage(downloadUrl);
            setHasProfileImage(true);
            setModalVisible(false);
            ToastAndroid.show(
              'Profile image uploaded successfully!',
              ToastAndroid.SHORT
            );
          }
        );
      } catch (error) {
        console.log('Error uploading image:', error);
        ToastAndroid.show('Error uploading image!', ToastAndroid.SHORT);
      }
    } else {
      console.log('Image selection was canceled or no URI found');
    }
  };

  const handleRemoveProfile = () => {
    setProfileImage(null); // Reset the image
    setHasProfileImage(false);
    setModalVisible(false);
    ToastAndroid.show('Profile image removed!', ToastAndroid.SHORT); // Show remove toast
  };

  return (
    <View style={{ padding: 20, backgroundColor: Colors.white, flex: 1 }}>
      <LinearGradient
        colors={[
          Colors.primaryColor,
          'rgba(255, 255, 255, 1.0)',
          'rgba(255, 255, 255, 0.5)',
          'transparent',
        ]}
        start={{ x: 0.15, y: 1 }}
        end={{ x: 0, y: 0 }}
        style={{
          width: Dimensions.get('screen').width,
          padding: 80,
          backgroundColor: Colors.white,
          position: 'absolute',
        }}
      />
      <Text style={styles.heading}>Profile</Text>

      <View style={styles.profileContainer}>
        <TouchableOpacity
          style={{ alignItems: 'center', position: 'relative' }}
        >
          <Image
            source={
              profileImage
                ? { uri: profileImage } // If image is uploaded, display the uploaded image
                : require('./../../assets/icons/user-profile.png') // Placeholder image
            }
            style={styles.profileImage}
          />
          <TouchableOpacity
            onPress={handleCameraPress}
            style={styles.cameraIcon}
          >
            <Ionicons name='camera-outline' size={22} color='white' />
          </TouchableOpacity>
        </TouchableOpacity>
        <Text style={styles.displayName}>{user?.displayName}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <FlatList
        data={Menu}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => onPressMenu(item)}
            key={item.id}
            style={styles.menuItem}
          >
            <Ionicons
              name={item?.icon}
              size={30}
              color={Colors.primaryColor}
              style={styles.menuIcon}
            />
            <Text style={styles.menuText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType='fade'
        onRequestClose={() => setModalVisible(false)}
      >
        <BlurView intensity={90} style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleUploadProfile}
            >
              <Text style={styles.modalButtonText}>Upload Profile</Text>
            </TouchableOpacity>
            {hasProfileImage && (
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleRemoveProfile}
              >
                <Text style={styles.modalButtonText}>Remove Profile</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    marginLeft: 3,
    fontFamily: 'raleway-bold',
    fontSize: 30,
    marginTop: 20,
  },
  profileContainer: {
    display: 'flex',
    alignItems: 'center',
    marginVertical: 25,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 75,
    borderColor: Colors.white,
    borderWidth: 5,
  },
  cameraIcon: {
    backgroundColor: Colors.darkerGray,
    borderRadius: 24,
    padding: 8,
    position: 'absolute',
    right: 3,
    bottom: 3,
  },
  displayName: {
    fontFamily: 'outfit-bold',
    fontSize: 20,
    marginTop: 10,
  },
  email: {
    fontFamily: 'outfit-regular',
    fontSize: 16,
    color: Colors.darkerGray,
  },
  menuItem: {
    marginVertical: 6,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.shadeOfGray,
    padding: 10,
    borderRadius: 10,
  },
  menuIcon: {
    padding: 10,
    backgroundColor: Colors.lightPrimary,
    borderRadius: 8,
  },
  menuText: {
    fontFamily: 'outfit-regular',
    fontSize: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalButton: {
    padding: 10,
    marginVertical: 10,
    backgroundColor: Colors.primaryColor,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'outfit-bold',
  },
});
