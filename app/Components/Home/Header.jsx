import React, { useEffect, useState } from 'react';
import { StyleSheet, View, PermissionsAndroid, Platform, Dimensions } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

// Get screen dimensions
const { width, height } = Dimensions.get('window');

const Header = () => {
  const [mapRegion, setMapRegion] = useState({
    latitude: 0.3536,
    longitude: 32.7575,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to your location to show your position on the map.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Location permission denied');
        }
      }
    };
    requestLocationPermission();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={{ width: width, height: height * 0.65 }} // Use screen dimensions for width and 75% height
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        region={mapRegion}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Header;
