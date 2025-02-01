import {
  View,
  Text,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../../Shared/Colors';
import BusinessItem from './BusinessItem';
import { useNavigation } from '@react-navigation/native';
import { getDocs, getFirestore } from 'firebase/firestore';
import { app } from '../../Shared/FireBaseConfig';
import { getAuth } from 'firebase/auth';

export default function BusinessList({ placeList }) {
  const navigation = useNavigation();
  // const { user } = useUser();
  const auth = getAuth(); // Initialize Firebase Authentication
  const user = auth.currentUser; // Get the currently logged-in user
  // get data from firestore
  const [favList, setFavList] = useState([]);

  const db = getFirestore(app);
  useEffect(() => {
    user && getFav();
  }, [user]);

  const getFav = async () => {
    setFavList([]);
    const q = query(
      collection(db, 'citynav-fav-place'),
      where('email', '==', user?.email)
    );

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, ' => ', doc.data());
      setFavList((favList) => [...favList, doc.data()]);
    });
  };

  const isFav = (place) => {
    const result = favList.find((item) => item.place.name == place.name);
    console.log(result);
    return result ? true : false;
  };
  return (
    <View style={{ marginBottom: 43 }}>
      <LinearGradient
        // Background Linear Gradient
        colors={['transparent', Colors.white]}
        style={{ padding: 20, width: Dimensions.get('screen').width }}
      >
        <FlatList
          data={placeList}
          horizontal={true}
          renderItem={({ item, index }) =>
            index <= 6 && (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('place-detail', {
                    place: item,
                  })
                }
              >
                <BusinessItem
                  place={item}
                  isFav={isFav(item)}
                  markedFav={() => getFav()}
                />
              </TouchableOpacity>
            )
          }
        />
      </LinearGradient>
    </View>
  );
}
