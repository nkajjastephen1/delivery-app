import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import Colors from '../../constant/Colors'
import { useRouter } from 'expo-router'

export default function LoginScreen() {

  const router=useRouter();
  return (
    <View style={{flex:1}}>
      <View style={{
        alignItems:'center',
        justifyContent:'center',
        marginTop:10
      }}>
        <Image source={require('./../../assets/images/login.png')}
        style={styles?.image}
        />
            
      </View>
        <View style={{
          backgroundColor:Colors.PRIMARY,
          padding:25,
          height:'100%'
        }}>
          <Text style={{
            fontSize:30,
            fontWeight:'bold',
            color:'white',
            textAlign:'center'
          }}>
            Stay on Track, Track your Delivery
          </Text>

          <Text style={{
            color:'white',
            fontSize:17,
            textAlign:'center',
            marginTop:20
          }}>Track your Goods, take control of their movements. Stay confident</Text>

          <TouchableOpacity style={styles?.button}
          onPress={()=>router.replace('/login/signIn')}>
            <Text style={{
              textAlign:'center',
              color:Colors.PRIMARY,
              fontSize:16

            }}>Continue</Text>
          </TouchableOpacity>

          <Text style={{
            color:'white',
            marginTop:4
          }}>Note: By Clicking Continue you accept the terms and conditions</Text>

        </View>
    </View>
  )
}

const styles = StyleSheet.create({
    image:{
        width:210,
        height:450,
        borderRadius:29
    },

    button:{
      backgroundColor:'white',
      borderRadius:99,
      padding:13,
      marginTop:20
    }
})