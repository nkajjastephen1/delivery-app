import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constant/Colors';
import { useNavigation } from '@react-navigation/native';
import { signOut } from 'firebase/auth';
import { auth } from '../../config/FirebaseConfig';

export default function ProfileScreen() {
  const navigation = useNavigation();

  const [userData, setUserData] = useState({
    name: 'CM1',
    email: 'stephennkajja@gmail.com',
    phone: '+256 705723211',
    avatar: null,
    notificationsEnabled: true,
    darkModeEnabled: false,
    locationTrackingEnabled: true,
  });

  const toggleSetting = (setting) => {
    setUserData((prevData) => ({
      ...prevData,
      [setting]: !prevData[setting],
    }));
  };

  const handleLogout = () => {
    Alert.alert('Confirm Logout', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Logout',
        onPress: async () => {
          await signOut(auth);
          navigation.replace('login/index'); // make sure 'SignIn' is correctly named in your navigator
        },
      },
    ]);
  };

  const navigateTo = (screen) => {
    navigation.navigate(screen);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={Colors.PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity onPress={() => navigateTo('EditProfile')}>
          <Ionicons name="create-outline" size={24} color={Colors.PRIMARY} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            {userData.avatar ? (
              <Image source={{ uri: userData.avatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarInitials}>
                  {userData.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </Text>
              </View>
            )}
            <TouchableOpacity style={styles.editAvatarButton}>
              <Ionicons name="camera" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{userData.name}</Text>
          <View style={styles.contactInfo}>
            <View style={styles.contactItem}>
              <Ionicons name="mail-outline" size={18} color="#666" />
              <Text style={styles.contactText}>{userData.email}</Text>
            </View>
            <View style={styles.contactItem}>
              <Ionicons name="call-outline" size={18} color="#666" />
              <Text style={styles.contactText}>{userData.phone}</Text>
            </View>
          </View>
        </View>

        {/* Sections */}
        {/** Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          {[
            { title: 'Personal Information', icon: 'person-outline', color: '#4caf50', bg: '#e8f5e9', screen: 'PersonalInfo' },
            { title: 'Payment Methods', icon: 'card-outline', color: '#2196f3', bg: '#e3f2fd', screen: 'PaymentMethods' },
            { title: 'Address Book', icon: 'location-outline', color: '#ffc107', bg: '#fff8e1', screen: 'AddressBook' },
            { title: 'Order History', icon: 'receipt-outline', color: '#9c27b0', bg: '#f3e5f5', screen: 'OrderHistory' }
          ].map((item, idx) => (
            <TouchableOpacity key={idx} style={styles.menuItem} onPress={() => navigateTo(item.screen)}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: item.bg }]}>
                  <Ionicons name={item.icon} size={20} color={item.color} />
                </View>
                <Text style={styles.menuText}>{item.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#aaa" />
            </TouchableOpacity>
          ))}
        </View>

        {/** Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          {[
            {
              title: 'Push Notifications',
              icon: 'notifications-outline',
              setting: 'notificationsEnabled',
              color: '#3f51b5',
              bg: '#e8eaf6',
            },
            {
              title: 'Dark Mode',
              icon: 'moon-outline',
              setting: 'darkModeEnabled',
              color: '#607d8b',
              bg: '#fafafa',
            },
            {
              title: 'Location Tracking',
              icon: 'navigate-outline',
              setting: 'locationTrackingEnabled',
              color: '#00bcd4',
              bg: '#e0f7fa',
            },
          ].map((item, idx) => (
            <View key={idx} style={styles.settingItem}>
              <View style={styles.settingItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: item.bg }]}>
                  <Ionicons name={item.icon} size={20} color={item.color} />
                </View>
                <Text style={styles.menuText}>{item.title}</Text>
              </View>
              <Switch
                trackColor={{ false: "#e0e0e0", true: Colors.PRIMARY + '80' }}
                thumbColor={userData[item.setting] ? Colors.PRIMARY : "#f4f3f4"}
                onValueChange={() => toggleSetting(item.setting)}
                value={userData[item.setting]}
              />
            </View>
          ))}
        </View>

        {/** Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          {[
            { title: 'Help Center', icon: 'help-buoy-outline', color: '#f44336', bg: '#ffebee', screen: 'HelpCenter' },
            { title: 'Contact Us', icon: 'chatbubble-ellipses-outline', color: '#009688', bg: '#e0f2f1', screen: 'ContactUs' },
            { title: 'Privacy Policy', icon: 'shield-checkmark-outline', color: '#757575', bg: '#f5f5f5', screen: 'PrivacyPolicy' }
          ].map((item, idx) => (
            <TouchableOpacity key={idx} style={styles.menuItem} onPress={() => navigateTo(item.screen)}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: item.bg }]}>
                  <Ionicons name={item.icon} size={20} color={item.color} />
                </View>
                <Text style={styles.menuText}>{item.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#aaa" />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#fff" style={styles.logoutIcon} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.PRIMARY + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitials: {
    fontSize: 40,
    fontWeight: 'bold',
    color: Colors.PRIMARY,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.PRIMARY,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  contactInfo: {
    alignItems: 'center',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  contactText: {
    marginLeft: 8,
    color: '#666',
    fontSize: 15,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 15,
    marginTop: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 5,
    color: '#333',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#e53935',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 15,
    marginTop: 25,
    marginBottom: 10,
  },
  logoutIcon: {
    marginRight: 10,
  },
  logoutText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  versionContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  versionText: {
    color: '#999',
    fontSize: 14,
  }
});