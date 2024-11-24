//app/SplashScreen.js

import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { applyFontStyle, FONTS } from './GlobalStyles';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('Home'); // Navigasi ke Home setelah 3 detik
    }, 3000);

    return () => clearTimeout(timer); // Bersihkan timer saat komponen dibongkar
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image 
        source={require('../assets/splash_logo.png')} // Ganti dengan path logo Anda
        style={styles.logo}
      />
      <Text style={applyFontStyle(styles.text, { fontFamily: FONTS.regular })}>
        Learn Quran and
      </Text>
      <Text style={applyFontStyle(styles.text, { fontFamily: FONTS.regular })}>
        Recite once everyday
      </Text>
      <Image 
        source={require('../assets/mosque_background.png')} // Ganti dengan path gambar masjid
        style={styles.backgroundImage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Ubah sesuai dengan warna latar belakang yang diinginkan
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 180,
    height: 180, 
  },
  text: {
    color: '#9587A3',
    fontSize: 20,
    textAlign: 'center',
  },
  backgroundImage: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 134, 
    resizeMode: 'contain', 
  },
});

export default SplashScreen;
