import { View, Text, FlatList, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import Colors from '../Shared/Colors';
import LoadingIndicator from '../Shared/LoadingIndicator';
import { getFirestore } from 'firebase/firestore';
import { app } from '../Shared/FireBaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import PlaceItem from '../Components/Home/PlaceItem';

export default function Fav() {
  const auth = getAuth(); // Initialize Firebase Authentication
  const user = auth.currentUser; // Get the currently logged-in user
  const db = getFirestore(app);
  const [favList, setFavList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    user && getFav();
  }, [user]);

  const getFav = async () => {
    setLoading(true);
    setFavList([]); // Clear the list before fetching new data
    const q = query(
      collection(db, 'citynav-fav-place'),
      where('email', '==', user?.email)
    );

    const querySnapshot = await getDocs(q);
    const favPlaces = [];
    querySnapshot.forEach((doc) => {
      favPlaces.push(doc.data());
    });
    setFavList(favPlaces);
    setLoading(false); // Stop loading when data is fetched
  };

  return (
    <View
      style={{
        padding: 20,
        paddingBottom: 60,
        backgroundColor: Colors.white,
        flex: 1,
      }}
    >
      <Text
        style={{
          marginLeft: 3,
          marginTop: 20,
          fontFamily: 'raleway-bold',
          fontSize: 30,
        }}
      >
        My Favorites
      </Text>

      {/* Show LoadingIndicator when loading */}
      {loading ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <LoadingIndicator />
          <Text
            style={{
              fontFamily: 'outfit-regular',
              color: Colors.black,
              marginTop: 2,
              fontSize: 15,
            }}
          >
            Loading...
          </Text>
        </View>
      ) : (
        // Show FlatList when not loading
        <FlatList
          data={favList}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <PlaceItem
              place={item.place}
              isFav={true}
              markedFav={() => getFav()} // Refresh favorites when item is marked/unmarked
            />
          )}
          onRefresh={() => getFav()}
          refreshing={loading}
        />
      )}
    </View>
  );
}
