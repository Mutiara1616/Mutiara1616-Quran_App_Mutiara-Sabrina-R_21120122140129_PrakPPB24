import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { applyFontStyle, FONTS } from './GlobalStyles';
import { useNavigation } from '@react-navigation/native';
import { loginUser } from './AuthService';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Login Failed", "Please enter your email and password");
      return;
    }
  
    try {
      const user = await loginUser(email, password);
      Alert.alert("Login Successful", `Welcome back, ${user.email}!`);
      navigation.navigate("Home");
    } catch (error) {
      Alert.alert("Login Failed", error.message);
    }
  };  

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/splash_logo.png')} // Pastikan path logo benar
        style={styles.logo}
      />
      
      <Text style={applyFontStyle(styles.label, { fontFamily: FONTS.medium })}>Your email address</Text>
      <TextInput
        style={styles.input}
        placeholder="example@gmail.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      
      <Text style={applyFontStyle(styles.label, { fontFamily: FONTS.medium })}>Choose a password</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="min. 8 characters"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
          <Ionicons name={showPassword ? "eye-off" : "eye"} size={24} color="#9CA3AF" />
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity style={styles.continueButton} onPress={handleLogin}>
        <Text style={applyFontStyle(styles.continueButtonText, { fontFamily: FONTS.semiBold })}>Continue</Text>
      </TouchableOpacity>

      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.registerLink}>Register</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.orText}>or</Text>
      
      <TouchableOpacity style={styles.socialButton}>
        <Image source={require('../assets/google.png')} style={styles.socialIcon} />
        <Text style={applyFontStyle(styles.socialButtonText, { fontFamily: FONTS.medium })}>Sign in with Google</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.socialButton}>
        <Image source={require('../assets/apple.png')} style={styles.socialIcon} />
        <Text style={applyFontStyle(styles.socialButtonText, { fontFamily: FONTS.medium })}>Sign in with Apple</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    marginBottom: 16,
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 12,
  },
  continueButton: {
    backgroundColor: '#672CBC',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  orText: {
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 14,
    color: '#6B7280',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
  },
  socialIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  socialButtonText: {
    fontSize: 16,
    color: '#374151',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  registerText: {
    fontSize: 14,
    color: '#6B7280',
  },
  registerLink: {
    fontSize: 14,
    color: '#672CBC',
    fontWeight: 'bold',
  },
});

export default LoginScreen;