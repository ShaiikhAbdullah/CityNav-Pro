// LocationUtils.js
import * as Location from 'expo-location';

export async function getCurrentCity() {
  try {
    // Request location permissions
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      return null;
    }

    // Get current location
    let location = await Location.getCurrentPositionAsync({});
    const lat = location.coords.latitude;
    const lon = location.coords.longitude;

    console.log(`Fetched Coordinates: Latitude = ${lat}, Longitude = ${lon}`);

    // Fetch Geocoding API response
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=AIzaSyCcWkFbKmC3opihlQj4seogwfqATmX9FXM`
    );
    const data = await response.json();

    console.log('Geocoding API Response:', JSON.stringify(data, null, 2));

    if (data.results.length === 0) {
      console.log('No results from Geocoding API');
      return null;
    }

    let city = null;
    let foundRawalpindi = false;
    let foundIslamabad = false;

    // Iterate through all address components in all results
    data.results.forEach((result, resultIndex) => {
      result.address_components.forEach((component, componentIndex) => {
        if (component.types.includes('administrative_area_level_2')) {
          console.log(
            `Found Administrative Area Level 2 (${resultIndex}, ${componentIndex}):`,
            component.long_name
          );
          if (component.long_name.toLowerCase() === 'rawalpindi') {
            console.log('Detected city as Rawalpindi');
            foundRawalpindi = true;
          } else if (component.long_name.toLowerCase() === 'islamabad') {
            console.log('Detected city as Islamabad');
            if (!foundRawalpindi) {
              // Only set if Rawalpindi not already found
              foundIslamabad = true;
            }
          }
        }
      });
    });

    // Prioritize Rawalpindi over Islamabad
    if (foundRawalpindi) {
      console.log('Final Determined City: Rawalpindi');
      return 'rawalpindi';
    } else if (foundIslamabad) {
      console.log('Final Determined City: Islamabad');
      return 'islamabad';
    }

    // Fallback to sublocality_level_1
    let fallbackCity = null;
    for (let result of data.results) {
      for (let component of result.address_components) {
        if (component.types.includes('sublocality_level_1')) {
          console.log('Found Sublocality Level 1:', component.long_name);
          fallbackCity = component.long_name.toLowerCase();
          break;
        }
      }
      if (fallbackCity) break;
    }

    // Fallback to locality if sublocality_level_1 is not found
    if (!fallbackCity) {
      for (let result of data.results) {
        for (let component of result.address_components) {
          if (component.types.includes('locality')) {
            console.log('Found Locality:', component.long_name);
            fallbackCity = component.long_name.toLowerCase();
            break;
          }
        }
        if (fallbackCity) break;
      }
    }

    if (fallbackCity) {
      console.log('Final Determined City via fallback:', fallbackCity);
      return fallbackCity;
    }

    console.log('City not found in address components');
    return null;
  } catch (error) {
    console.error('Error in getCurrentCity:', error);
    return null;
  }
}
