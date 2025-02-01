import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  Dimensions,
} from 'react-native';
import React from 'react';
import Colors from '../../Shared/Colors';

export default function Header() {
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        gap: 10,
        alignItems: 'center',
        paddingTop: 20,
      }}
    >
      <Image
        source={require('./../../../assets/logo.png')}
        style={styles.logo}
      />
      <View style={styles.searchBarWrapper}>
        <TextInput
          placeholder='Search here...'
          style={styles.searchBar}
          autoCapitalize='none'
        />
      </View>
      <Image
        source={require('./../../../assets/icons/user-profile.png')}
        style={styles.userImage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 50,
    height: 50,
  },
  searchBar: {
    borderWidth: 1,
    borderColor: Colors.borderColor,
    padding: 4,
    borderRadius: 50,
    paddingLeft: 15,
    width: Dimensions.get('screen').width * 0.6,
    paddingVertical: 6,
  },
  // Wrapper style to handle shadow and offset
  searchBarWrapper: {
    backgroundColor: '#fff',
    borderRadius: 50,
    elevation: 3, // Control shadow depth
  },
  userImage: {
    width: 40,
    height: 40,
    marginRight: 5,
  },
});
