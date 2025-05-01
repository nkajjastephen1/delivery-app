import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Modal, 
  TextInput,
  FlatList,
  ActivityIndicator
} from 'react-native';
import * as Location from 'expo-location';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { MaterialIcons } from '@expo/vector-icons';

const GOOGLE_MAPS_API_KEY = 'AIzaSyD0kO4vHUzOu1Z4LfRMbG_022gxaYR-Dl4'; // Replace with your actual API key

const LocationDeliverySelector = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationText, setLocationText] = useState('Getting location...');
  const [deliveryDestination, setDeliveryDestination] = useState(null);
  const [deliveryDestinationText, setDeliveryDestinationText] = useState('To');
  const [isLoading, setIsLoading] = useState(true);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [isSelectingPickup, setIsSelectingPickup] = useState(true);
  
  const googlePlacesRef = useRef(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationText('Permission to access location was denied');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        let location = await Location.getCurrentPositionAsync({});
        setCurrentLocation(location);
        
        // Convert coordinates to address
        let address = await reverseGeocode(
          location.coords.latitude,
          location.coords.longitude
        );
        setLocationText(address);
      } catch (error) {
        setLocationText('Error getting location');
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // Function to convert coordinates to human-readable address
  const reverseGeocode = async (latitude, longitude) => {
    try {
      const response = await Location.reverseGeocodeAsync({
        latitude,
        longitude
      });

      if (response.length > 0) {
        const address = response[0];
        return `${address.street || ''} ${address.name || ''}, ${address.city || ''}`;
      }
      return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    } catch (error) {
      return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    }
  };

  const openLocationSearchModal = (isPickup) => {
    setIsSelectingPickup(isPickup);
    setShowLocationModal(true);
    
    // Reset search if needed
    if (googlePlacesRef.current) {
      googlePlacesRef.current.clear();
    }
  };

  const handleLocationSelected = (data, details) => {
    // Details object contains latitude, longitude, and address components
    const location = {
      latitude: details.geometry.location.lat,
      longitude: details.geometry.location.lng,
      address: data.description,
    };

    if (isSelectingPickup) {
      setCurrentLocation({
        coords: { 
          latitude: location.latitude, 
          longitude: location.longitude 
        }
      });
      setLocationText(location.address);
    } else {
      setDeliveryDestination({
        latitude: location.latitude,
        longitude: location.longitude
      });
      setDeliveryDestinationText(location.address);
    }

    setShowLocationModal(false);
  };

  const handleRefreshLocation = async () => {
    setIsLoading(true);
    try {
      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location);
      
      // Convert coordinates to address
      let address = await reverseGeocode(
        location.coords.latitude,
        location.coords.longitude
      );
      setLocationText(address);
    } catch (error) {
      setLocationText('Error getting location');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Current Location Row */}
      <View style={styles.row}>
        <TouchableOpacity 
          style={styles.iconButton} 
          onPress={() => openLocationSearchModal(true)}
        >
          <MaterialIcons name="my-location" size={24} color="#444" />
        </TouchableOpacity>
        
        <View style={styles.textContainer}>
          <Text style={styles.locationText}>
            {isLoading ? 'Getting location...' : locationText}
          </Text>
        </View>
        
        <TouchableOpacity 
          style={[styles.iconButton, { backgroundColor: '#FFEBEB' }]} 
          onPress={handleRefreshLocation}
        >
          <MaterialIcons name="gps-fixed" size={24} color="#E25B45" />
        </TouchableOpacity>
      </View>

      {/* Delivery Destination Row */}
      <TouchableOpacity 
        style={[styles.row, styles.marginTop]}
        onPress={() => openLocationSearchModal(false)}
      >
        <View style={styles.iconButton}>
          <MaterialIcons name="location-on" size={24} color="#444" />
        </View>
        
        <View style={styles.textContainer}>
          <Text style={[styles.locationText, !deliveryDestination && styles.placeholderText]}>
            {deliveryDestinationText}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Google Places Search Modal */}
      <Modal
        visible={showLocationModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowLocationModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {isSelectingPickup ? 'Select Pickup Location' : 'Select Delivery Location'}
            </Text>
            
            <GooglePlacesAutocomplete
              ref={googlePlacesRef}
              placeholder="Search for a location"
              onPress={handleLocationSelected}
              fetchDetails={true}
              query={{
                key: GOOGLE_MAPS_API_KEY,
                language: 'en',
              }}
              styles={{
                container: {
                  flex: 0,
                },
                textInputContainer: {
                  width: '100%',
                },
                textInput: {
                  height: 50,
                  borderRadius: 8,
                  backgroundColor: '#F5F5F5',
                  paddingHorizontal: 15,
                  fontSize: 16,
                  marginBottom: 0,
                },
                listView: {
                  backgroundColor: '#FFF',
                  borderRadius: 5,
                  flex: 1,
                  marginTop: 10,
                },
                row: {
                  padding: 13,
                  height: 60,
                  flexDirection: 'row',
                },
                separator: {
                  height: 1,
                  backgroundColor: '#F0F0F0',
                },
                description: {
                  fontSize: 15,
                },
                loader: {
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  height: 20,
                },
              }}
              enablePoweredByContainer={false}
              nearbyPlacesAPI="GooglePlacesSearch"
              debounce={300}
              renderRow={(data) => (
                <View style={styles.autocompleteSuggestion}>
                  <MaterialIcons name="place" size={20} color="#666" style={styles.suggestionIcon} />
                  <Text style={styles.suggestionText}>{data.description}</Text>
                </View>
              )}
            />
            
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowLocationModal(false)}
            >
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    height: 60,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  marginTop: {
    marginTop: 12,
  },
  iconButton: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  textContainer: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
  },
  locationText: {
    fontSize: 16,
    color: '#333',
  },
  placeholderText: {
    color: '#999',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  closeButton: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 15,
  },
  closeButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  autocompleteSuggestion: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  suggestionIcon: {
    marginRight: 10,
  },
  suggestionText: {
    fontSize: 15,
    color: '#333',
  }
});

export default LocationDeliverySelector;