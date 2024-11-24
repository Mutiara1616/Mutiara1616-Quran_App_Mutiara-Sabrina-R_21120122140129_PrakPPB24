// ProfileScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Animated  } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { applyFontStyle, FONTS } from './GlobalStyles';
import { auth, db } from './firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

const ProfileScreen = ({ navigation }) => {
  const scrollY = new Animated.Value(0);
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    joinDate: '',
    totalBookmarks: 0
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDocRef = doc(db, "users", user.uid);
          const userSnapshot = await getDoc(userDocRef);
          
          if (userSnapshot.exists()) {
            const data = userSnapshot.data();
            setUserData({
              username: data.username,
              email: user.email,
              joinDate: new Date(user.metadata.creationTime).toLocaleDateString(),
              totalBookmarks: data.bookmarks ? data.bookmarks.length : 0
            });
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const MenuOption = ({ icon, title, onPress, value, showArrow = true, isLast = false }) => (
    <TouchableOpacity 
      style={[
        styles.menuOption,
        !isLast && styles.menuOptionBorder // Hanya tambahkan border jika bukan item terakhir
      ]} 
      onPress={onPress}
    >
      <View style={styles.menuOptionLeft}>
        <Ionicons name={icon} size={24} color="#672CBC" style={styles.menuIcon} />
        <Text style={applyFontStyle(styles.menuTitle, { fontFamily: FONTS.medium })}>{title}</Text>
      </View>
      <View style={styles.menuOptionRight}>
        {value && (
          <Text style={applyFontStyle(styles.menuValue, { fontFamily: FONTS.regular })}>{value}</Text>
        )}
        {showArrow && <Ionicons name="chevron-forward" size={20} color="#9D9D9D" />}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.mainContainer}>
      {/* Fixed Header */}
      <Animated.View 
        style={[
          styles.headerBackground,
          {
            opacity: headerOpacity,
          }
        ]} 
      />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#672CBC" />
        </TouchableOpacity>
        <Text style={applyFontStyle(styles.headerTitle, { fontFamily: FONTS.bold })}>Profile</Text>
        <TouchableOpacity>
          <Ionicons name="settings-outline" size={24} color="#672CBC" />
        </TouchableOpacity>
      </View>

      {/* Scrollable Content */}
      <Animated.ScrollView 
        style={styles.scrollContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >

      {/* Profile Card */}
      <View style={styles.profileSection}>
        <View style={styles.profileImageWrapper}>
          <Image
            source={require('../assets/profile.jpg')}
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.cameraButton}>
            <Ionicons name="camera" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <Text style={applyFontStyle(styles.username, { fontFamily: FONTS.bold })}>
          {userData.username}
        </Text>
        <Text style={applyFontStyle(styles.email, { fontFamily: FONTS.regular })}>
          {userData.email}
        </Text>

        <TouchableOpacity style={styles.editProfileButton}>
          <Text style={applyFontStyle(styles.editProfileText, { fontFamily: FONTS.medium })}>
            Edit profile
          </Text>
        </TouchableOpacity>
      </View>

      {/* Menu Options */}
      <View style={styles.menuContainer}>
        <Text style={applyFontStyle(styles.menuHeader, { fontFamily: FONTS.bold })}>Settings</Text>
        
        <MenuOption
          icon="person-outline"
          title="Edit Profile"
          onPress={() => {}}
        />
        
        <MenuOption
          icon="moon-outline"
          title="Dark Mode"
          onPress={() => {}}
        />

        <MenuOption
          icon="notifications-outline"
          title="Notifications"
          onPress={() => {}}
        />

        <MenuOption
          icon="language-outline"
          title="Language"
          value="English"
          onPress={() => {}}
          isLast={true} // Tandai sebagai item terakhir
        />
      </View>

      <View style={styles.menuContainer}>
        <Text style={applyFontStyle(styles.menuHeader, { fontFamily: FONTS.bold })}>About</Text>
        
        <MenuOption
          icon="information-circle-outline"
          title="About App"
          onPress={() => {}}
        />
        
        <MenuOption
          icon="help-circle-outline"
          title="Help & Support"
          onPress={() => {}}
        />

        <MenuOption
          icon="star-outline"
          title="Rate App"
          onPress={() => {}}
          isLast={true} // Tandai sebagai item terakhir
        />
      </View>

      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={() => {
          auth.signOut();
          navigation.navigate('Login');
        }}
      >
        <Ionicons name="log-out-outline" size={24} color="#FFFFFF" />
        <Text style={applyFontStyle(styles.logoutText, { fontFamily: FONTS.medium })}>Logout</Text>
      </TouchableOpacity>
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: '#FFFFFF',
    zIndex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    zIndex: 2,
  },
  headerTitle: {
    fontSize: 20,
    color: '#672CBC',
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  profileImageWrapper: {
    position: 'relative',
    marginBottom: 10,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 100,
    borderColor: '#672CBC',
  },
  cameraButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#3e1a71',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  username: {
    fontSize: 24,
    color: '#000000',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#9D9D9D',
    marginBottom: 20,
  },
  editProfileButton: {
    backgroundColor: '#672CBC',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 25,
  },
  editProfileText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  statsRow: {
  flexDirection: 'row',
  justifyContent: 'space-around',
  width: '100%',
  marginTop: 10,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  statNumber: {
    fontSize: 24,
    color: '#672CBC',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 16,
    color: '#9D9D9D',
  },
  menuContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginTop: 20,
    marginHorizontal: 20,
    padding: 20,
  },
  menuHeader: {
    fontSize: 18,
    color: '#672CBC',
    marginBottom: 15,
  },
  menuOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
  },
  menuOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuOptionRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuOptionBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuIcon: {
    marginRight: 15,
  },
  menuTitle: {
    fontSize: 16,
    color: '#000000',
  },
  menuValue: {
    fontSize: 14,
    color: '#9D9D9D',
    marginRight: 10,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#d22223',
    marginHorizontal: 20,
    marginVertical: 20,
    padding: 15,
    borderRadius: 15,
  },
  logoutText: {
    fontSize: 18,
    color: '#FFFFFF',
    marginLeft: 10,
  },
});

export default ProfileScreen;