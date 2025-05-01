import { View, Text, StyleSheet, TouchableOpacity, TextInput, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, ToastAndroid, Alert } from 'react-native';
import React, { useState } from 'react';
import Colors from '../../constant/Colors';
import { useRouter } from 'expo-router';
import {auth} from './../../config/FirebaseConfig'
import { createUserWithEmailAndPassword } from 'firebase/auth';

export default function SignUp() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router=useRouter();

  const onCreateAccount=()=>{

    if (!email || !password || !confirmPassword) {
      ToastAndroid.show('Please fill all details', ToastAndroid.BOTTOM);
      Alert.alert('Please fill all details');
      return;
    }

    if (password !== confirmPassword) {
      ToastAndroid.show('Passwords do not match', ToastAndroid.BOTTOM);
      Alert.alert('Passwords do not match');
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up 
        ToastAndroid.show('Account created successfully!', ToastAndroid.BOTTOM);
        router.push('(tabs)'); // Redirect to the home page or desired route
        const user = userCredential.user;
        console.log(user);
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);
        if (errorCode=='auth/email-already-in-use')
        {
          ToastAndroid.show('Email alreadyexist', ToastAndroid.BOTTOM)
          Alert.alert('Email already exist')
        }
        // ..
      });
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.headerContainer}>
            <Text style={styles.textheader}>Create Account</Text>
            <Text style={styles.subtext}>Sign up to get started</Text>
          </View>
          
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Create a password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>
            
            <View style={styles.termsContainer}>
              <Text style={styles.termsText}>
                By signing up, you agree to our{' '}
                <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </Text>
            </View>
            
            <TouchableOpacity style={styles.signUpButton}
            onPress={onCreateAccount}>
              <Text style={styles.signUpButtonText}>Sign Up</Text>
            </TouchableOpacity>
            
            <View style={styles.signInContainer}>
              <Text style={styles.signInText}>Already have an account? </Text>
              <TouchableOpacity 
               onPress={()=>router.push('/login/signIn')}>
                <Text style={styles.signInLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: 25,
    paddingTop: 50,
    paddingBottom: 30,
  },
  textheader: {
    fontWeight: 'bold',
    fontSize: 32,
    color: Colors.PRIMARY,
  },
  subtext: {
    fontWeight: '600',
    fontSize: 22,
    marginTop: 8,
    color: '#888',
  },
  formContainer: {
    paddingHorizontal: 25,
    paddingBottom: 40,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: '#f7f7f7',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  termsContainer: {
    marginVertical: 15,
  },
  termsText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  termsLink: {
    color: Colors.PRIMARY,
    fontWeight: '600',
  },
  signUpButton: {
    backgroundColor: Colors.PRIMARY,
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  signUpButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  signInText: {
    fontSize: 16,
    color: '#555',
  },
  signInLink: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.PRIMARY,
  }
});