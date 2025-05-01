import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Switch,
  Linking,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Make sure to install expo/vector-icons
import Colors from '../../constant/Colors';

export default function AddNewOrder({ navigation }) {
  // Form state
  const [orderDetails, setOrderDetails] = useState({
    customerName: '',
    customerPhone: '',
    deliveryAddress: '',
    deliveryCoordinates: null, // {latitude, longitude}
    pickupAddress: '',
    pickupCoordinates: null, // {latitude, longitude}
    itemDescription: '',
    deliveryNotes: '',
    isExpressDelivery: false,
    estimatedWeight: '',
    packageSize: 'Medium' // Default value
  });

  // Package size options
  const packageSizes = ['Small', 'Medium', 'Large', 'Extra Large'];

  // Handle form input changes
  const handleChange = (field, value) => {
    setOrderDetails({
      ...orderDetails,
      [field]: value
    });
  };

  // Open Google Maps for address selection
  const openMaps = (addressType) => {
    // Default coordinates (can be set to your business location for pickup)
    const defaultCoords = { latitude: 37.7749, longitude: -122.4194 }; // Example: San Francisco
    
    // Get existing coordinates if available
    const coords = addressType === 'pickup' 
      ? orderDetails.pickupCoordinates || defaultCoords
      : orderDetails.deliveryCoordinates || defaultCoords;
    
    // Format Google Maps URL
    const mapsUrl = Platform.select({
      ios: `maps:0,0?q=${coords.latitude},${coords.longitude}`,
      android: `geo:0,0?q=${coords.latitude},${coords.longitude}`
    });
    
    // Try to open maps app
    Linking.canOpenURL(mapsUrl)
      .then(supported => {
        if (supported) {
          return Linking.openURL(mapsUrl);
        } else {
          // Fallback to Google Maps web
          return Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${coords.latitude},${coords.longitude}`);
        }
      })
      .catch(err => {
        Alert.alert('Error', 'Could not open maps. Please try again.');
        console.error('An error occurred', err);
      });
      
    // Note: In a real app, you would want to implement a callback to get the selected location
    // from Google Maps. This typically requires using a maps SDK like react-native-maps
    // and implementing a proper location picker.
    
    // Simulating getting coordinates back (in a real app, you'd get this from the map selection)
    setTimeout(() => {
      Alert.alert(
        'Location Selected',
        'Would you like to use this location?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Use Location',
            onPress: () => {
              // Simulate getting coordinates back from maps
              const newCoords = {
                latitude: coords.latitude + (Math.random() * 0.01 - 0.005),
                longitude: coords.longitude + (Math.random() * 0.01 - 0.005)
              };
              
              // Get address from coordinates (reverse geocoding)
              // In a real app, you would use a geocoding service here
              const simulatedAddress = addressType === 'pickup'
                ? '123 Pickup Street, City'
                : '456 Delivery Avenue, Town';
              
              // Update state with new coordinates and address
              if (addressType === 'pickup') {
                setOrderDetails({
                  ...orderDetails,
                  pickupCoordinates: newCoords,
                  pickupAddress: simulatedAddress
                });
              } else {
                setOrderDetails({
                  ...orderDetails,
                  deliveryCoordinates: newCoords,
                  deliveryAddress: simulatedAddress
                });
              }
            },
          },
        ],
        { cancelable: false }
      );
    }, 2000);
  };

  // Handle form submission
  const handleSubmit = () => {
    // Here you would add validation and API calls to create the order
    console.log('Order Details:', orderDetails);
    // Navigate back or to confirmation screen
    // navigation.navigate('OrderConfirmation', { orderDetails });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color={Colors.primary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Add New Order</Text>
          </View>

          <View style={styles.formContainer}>
            {/* Customer Information Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Customer Information</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Customer Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter customer name"
                  value={orderDetails.customerName}
                  onChangeText={(text) => handleChange('customerName', text)}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter phone number"
                  keyboardType="phone-pad"
                  value={orderDetails.customerPhone}
                  onChangeText={(text) => handleChange('customerPhone', text)}
                />
              </View>
            </View>

            {/* Delivery Details Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Delivery Details</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Pickup Address</Text>
                <View style={styles.addressInputContainer}>
                  <TextInput
                    style={styles.addressInput}
                    placeholder="Enter pickup address"
                    value={orderDetails.pickupAddress}
                    onChangeText={(text) => handleChange('pickupAddress', text)}
                  />
                  <TouchableOpacity 
                    style={styles.mapButton}
                    onPress={() => openMaps('pickup')}
                  >
                    <Ionicons name="location" size={24} color="#fff" />
                  </TouchableOpacity>
                </View>
                {orderDetails.pickupCoordinates && (
                  <Text style={styles.coordinatesText}>
                    Lat: {orderDetails.pickupCoordinates.latitude.toFixed(4)}, 
                    Long: {orderDetails.pickupCoordinates.longitude.toFixed(4)}
                  </Text>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Delivery Address</Text>
                <View style={styles.addressInputContainer}>
                  <TextInput
                    style={styles.addressInput}
                    placeholder="Enter delivery address"
                    value={orderDetails.deliveryAddress}
                    onChangeText={(text) => handleChange('deliveryAddress', text)}
                  />
                  <TouchableOpacity 
                    style={styles.mapButton}
                    onPress={() => openMaps('delivery')}
                  >
                    <Ionicons name="location" size={24} color="#fff" />
                  </TouchableOpacity>
                </View>
                {orderDetails.deliveryCoordinates && (
                  <Text style={styles.coordinatesText}>
                    Lat: {orderDetails.deliveryCoordinates.latitude.toFixed(4)}, 
                    Long: {orderDetails.deliveryCoordinates.longitude.toFixed(4)}
                  </Text>
                )}
              </View>

              <View style={styles.switchContainer}>
                <Text style={styles.label}>Express Delivery</Text>
                <Switch
                  trackColor={{ false: "#e0e0e0", true: Colors.primary + '80' }}
                  thumbColor={orderDetails.isExpressDelivery ? Colors.primary : "#f4f3f4"}
                  onValueChange={(value) => handleChange('isExpressDelivery', value)}
                  value={orderDetails.isExpressDelivery}
                />
              </View>
            </View>

            {/* Package Details Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Package Details</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Item Description</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Describe the items"
                  value={orderDetails.itemDescription}
                  onChangeText={(text) => handleChange('itemDescription', text)}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Estimated Weight (kg)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter estimated weight"
                  keyboardType="decimal-pad"
                  value={orderDetails.estimatedWeight}
                  onChangeText={(text) => handleChange('estimatedWeight', text)}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Package Size</Text>
                <View style={styles.packageSizeContainer}>
                  {packageSizes.map((size) => (
                    <TouchableOpacity
                      key={size}
                      style={[
                        styles.sizeOption,
                        orderDetails.packageSize === size && styles.selectedSize
                      ]}
                      onPress={() => handleChange('packageSize', size)}
                    >
                      <Text
                        style={[
                          styles.sizeText,
                          orderDetails.packageSize === size && styles.selectedSizeText
                        ]}
                      >
                        {size}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Delivery Notes (Optional)</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Any special instructions for the delivery"
                  multiline
                  numberOfLines={4}
                  value={orderDetails.deliveryNotes}
                  onChangeText={(text) => handleChange('deliveryNotes', text)}
                />
              </View>
            </View>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Create Order</Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  formContainer: {
    padding: 20,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: Colors.PRIMARY,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#f7f7f7',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  addressInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressInput: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderRightWidth: 0,
    borderColor: '#e0e0e0',
  },
  mapButton: {
    backgroundColor: Colors.PRIMARY,
    padding: 12,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coordinatesText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    fontStyle: 'italic',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  packageSizeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  sizeOption: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#f7f7f7',
    marginRight: 8,
    marginBottom: 8,
  },
  selectedSize: {
    backgroundColor: Colors.PRIMARY + '20',
    borderColor: Colors.PRIMARY,
  },
  sizeText: {
    color: '#555',
  },
  selectedSizeText: {
    color: Colors.PRIMARY,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: Colors.PRIMARY,
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});