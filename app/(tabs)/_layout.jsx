import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { Tabs, useRouter } from 'expo-router'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../config/FirebaseConfig';
import { use } from 'react';
import { useState } from 'react';

export default function TabLayout() {
  
  const router=useRouter();
  const [authenticated, setAuthenticated] = useState(null);
  // if user is not logged in, redirect to login page
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user
      const uid = user.uid;
      console.log(uid)
      setAuthenticated(true);
      // ...
    } else {
      
      setAuthenticated(false);
      // User is signed out
      // ...
    }
  });

  useEffect(() => {
    if (authenticated === false) {
      router.push('/login')
    }
  }, [authenticated]);
  

  return (
    <Tabs screenOptions={{
        headerShown:false
    }}>
        <Tabs.Screen name ='index'
        options={{tabBarLabel:'Home',
            tabBarIcon:({color,size}) =>( <FontAwesome name="home" size={size} color="black" />)}}/>
        <Tabs.Screen name ='Addnew'
        options={{tabBarLabel:'Addnew',
            tabBarIcon:({color,size}) =>( <FontAwesome name="plus-square" size={size} color="black" />)}}/>
        <Tabs.Screen name ='Profile'
        options={{tabBarLabel:'Profile',
            tabBarIcon:({color,size}) =>( <FontAwesome name="user" size={size} color="black" />)}}/>
    </Tabs>

  )
}