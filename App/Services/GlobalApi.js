// ----------------------------------------
// GlobalApi.js
import axios from 'axios';

const BASE_URL = 'https://maps.googleapis.com/maps/api/place';
const API_KEY = 'AIzaSyCcWkFbKmC3opihlQj4seogwfqATmX9FXM';

// Function to fetch nearby places
const nearByPlace = async (lat, lng, type) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/nearbysearch/json?location=${lat},${lng}&radius=1500&type=${type}&key=${API_KEY}`
    );
    return response;
  } catch (error) {
    console.error('Error fetching nearby places:', error);
    throw error;
  }
};

// Function to search places by text
const searchByText = async (searchText) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/textsearch/json?query=${encodeURIComponent(
        searchText
      )}&key=${API_KEY}`
    );
    return response;
  } catch (error) {
    console.error('Error searching places by text:', error);
    throw error;
  }
};

export default {
  nearByPlace,
  searchByText,
};
