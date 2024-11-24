// App.js

import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import { GlobalStyles } from './app/GlobalStyles';
import AppNavigator from './navigation/AppNavigator';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import AppLoading from 'expo-app-loading';

// Override Text component globally
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.style = [GlobalStyles.text];

SplashScreen.preventAutoHideAsync();

const App = () => {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Load fonts
        await Font.loadAsync({
          'Poppins-Regular': require('./assets/font/Poppins-Regular.ttf'),
          'Poppins-Medium': require('./assets/font/Poppins-Medium.ttf'),
          'Poppins-SemiBold': require('./assets/font/Poppins-SemiBold.ttf'),
          'Poppins-Bold': require('./assets/font/Poppins-Bold.ttf'),
        });
        // Any other initialization tasks can go here
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return <AppNavigator />;
};

export default App;