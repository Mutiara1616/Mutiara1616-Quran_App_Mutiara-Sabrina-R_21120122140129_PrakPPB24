//app/AppNavigator.js

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from '../app/SplashScreen';
import HomeScreen from '../app/HomeScreen';
import SurahDetail from '../app/SurahDetail';
import Bookmark from '../app/Bookmark';
import ProfileScreen from '../app/ProfileScreen';
import LoginScreen from '../app/LoginScreen'; 
import RegisterScreen from '../app/RegisterScreen';
import BookmarkDetail from '../app/BookmarkDetail';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SurahDetail" component={SurahDetail} options={{ headerShown: false }} />
        <Stack.Screen name="Bookmarks" component={Bookmark} options={{ headerShown: false }} />
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="BookmarkDetail" component={BookmarkDetail} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;