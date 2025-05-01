import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Header from '../Components/Home/Header';
import Down from '../Components/Home/Down';

const Index = () => {
  return (
    <View style={{ flex: 1 }}>
      <Header/>
      <Down/>
    </View>
  );
};

export default Index;