// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAx8SSOs3qIY7CXxxUszyhBNXFzO0GPies",
  authDomain: "delivery-tracker-6d5c9.firebaseapp.com",
  projectId: "delivery-tracker-6d5c9",
  storageBucket: "delivery-tracker-6d5c9.appspot.com", // small typo fixed: added missing "g" in .appspot.com
  messagingSenderId: "554396685786",
  appId: "1:554396685786:web:ee4a2787a9ad56f368dce3",
  measurementId: "G-81EEY681WD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
