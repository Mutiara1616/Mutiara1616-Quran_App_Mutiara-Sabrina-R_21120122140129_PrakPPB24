// app/HomeScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, StatusBar, Dimensions, ActivityIndicator, Alert, Modal } from 'react-native';
import SideMenu from 'react-native-side-menu';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebaseConfig';
import { fetchSurahList } from './api';  // Pastikan fungsi diupdate
import { applyFontStyle, FONTS } from './GlobalStyles';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const Menu = ({ onItemSelected, onLogout, username, setLogoutModalVisible })=> {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.menu}>
      <View style={styles.avatarContainer}>
        <Image style={styles.avatar} />
        <Text style={applyFontStyle(styles.name, { fontFamily: FONTS.bold })}>{username || 'Hi, Joy'}</Text>
      </View>
      
      {/* Menu Item Profile - hanya muncul jika user sudah login */}
      {isLoggedIn && (
        <TouchableOpacity style={styles.menuItem} onPress={() => onItemSelected('Profile')}>
          <Text style={applyFontStyle(styles.menuItemText, { fontFamily: FONTS.regular })}>Profile</Text>
        </TouchableOpacity>
      )}
      
      {/* Menu Item Bookmark */}
      <TouchableOpacity style={styles.menuItem} onPress={() => onItemSelected('Bookmark')}>
        <Text style={applyFontStyle(styles.menuItemText, { fontFamily: FONTS.regular })}>Bookmark</Text>
      </TouchableOpacity>

      {/* Conditional Login/Logout Menu Item */}
      {isLoggedIn ? (
        <TouchableOpacity style={styles.menuItem} onPress={() => setLogoutModalVisible(true)}>
          <Text style={styles.menuItemText}>Logout</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.menuItem} onPress={() => onItemSelected('Login')}>
          <Text style={styles.menuItemText}>Login</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const HomeScreen = ({ navigation }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [surahData, setSurahData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  useEffect(() => {
    const getSurahData = async () => {
      try {
        const data = await fetchSurahList(15);  // Memanggil hanya 15 surah
        setSurahData(data);
      } catch (error) {
        console.error('Error fetching surah data:', error);
      } finally {
        setLoading(false);
      }
    };

    getSurahData();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          // Pastikan menggunakan doc dari firebase/firestore
          const userDocRef = doc(db, "users", user.uid);
          const userSnapshot = await getDoc(userDocRef);
          
          if (userSnapshot.exists()) {
            setUsername(userSnapshot.data().username);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
  
    // Set up listener untuk perubahan auth state
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchUserData();
      } else {
        setUsername('Hi, Joy');
      }
    });
  
    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  const loadMoreData = () => {
    if (hasMore && !loading) {
      setPage((prevPage) => prevPage + 1); // Load the next page
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const onMenuItemSelected = (item) => {
    setIsOpen(false);
    if (item === 'Bookmark') {
      navigation.navigate('Bookmarks');
    } else if (item === 'Profile') {
      navigation.navigate('Profile');
    } else if (item === 'Login') {
      navigation.navigate('Login');
    }
  };

  const handleLogout = () => {
    setLogoutModalVisible(true);
  };
  
  // Fungsi untuk menangani logout dengan konfirmasi
  const LogoutModal = ({ visible, onClose }) => {
    return (
      <Modal
        transparent={true}
        visible={visible}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.imageContainer}>
              <Image
                source={require('../assets/Logout.png')}
                style={styles.modalImage}
              />
            </View>
            <Text style={[styles.modalTitle, { fontFamily: FONTS.bold }]}>Logout</Text>
            <Text style={[styles.modalMessage, { fontFamily: FONTS.regular }]}>
              Are you sure you want to logout?
            </Text>
            
            <TouchableOpacity 
              style={styles.button}
              onPress={async () => {
                try {
                  await auth.signOut();
                  navigation.navigate('Home');
                  onClose();
                } catch (error) {
                  console.error("Logout failed: ", error);
                }
              }}
            >
              <Text style={[styles.buttonText, { fontFamily: FONTS.regular }]}>Logout</Text>
            </TouchableOpacity>
  
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={onClose}
            >
              <Text style={[styles.cancelButtonText, { fontFamily: FONTS.medium }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  const navigateToSurahDetail = async (item) => {
    setLoading(true); // Set loading true
    navigation.navigate('SurahDetail', {
      surahNumber: item.nomor,
    });
    setLoading(false); // Set loading false setelah navigasi
  }; 

  const renderSurahItem = ({ item }) => (
    <TouchableOpacity style={styles.surahItem} onPress={() => navigateToSurahDetail(item)}>
      <Text style={applyFontStyle(styles.surahNumber, { fontFamily: FONTS.medium })}>
        {item.nomor}  
      </Text>
      <View style={styles.surahInfo}>
        <Text style={applyFontStyle(styles.surahTitle, { fontFamily: FONTS.bold })}>
          {item.namaLatin} 
        </Text>
        <Text style={applyFontStyle(styles.surahTranslation, { fontFamily: FONTS.regular })}>
          {item.tempatTurun} • {item.jumlahAyat} Ayat
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SideMenu
      menu={<Menu onItemSelected={onMenuItemSelected} onLogout={handleLogout} username={username} setLogoutModalVisible={setLogoutModalVisible} />}
      isOpen={isOpen}
      onChange={(isOpen) => setIsOpen(isOpen)}
      menuPosition="left"
      openMenuOffset={width * 0.75}
    >
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#F8F8F8" />
        <View style={styles.header}>
          <TouchableOpacity onPress={toggleMenu} style={styles.hamburgerContainer}>
            <Text style={styles.hamburgerButton}>☰</Text>
          </TouchableOpacity>
          <Text style={applyFontStyle(styles.headerTitle, { fontFamily: FONTS.bold })}>
            Quran App
          </Text>
          <View style={styles.placeholder}></View>
        </View>

        <View>
          <Text style={applyFontStyle(styles.greeting, { fontFamily: FONTS.regular })}>Assalamualaikum</Text>
          <Text style={applyFontStyle(styles.username, { fontFamily: FONTS.bold })}>
            {username || 'Hi, Joy'}
          </Text>
        </View>

        {/* Last Read Card */}
        <View style={styles.lastReadCard}>
          <Text style={applyFontStyle(styles.lastReadText, { fontFamily: FONTS.medium })}>
            Last Read
          </Text>
          <View style={styles.lastReadSurah}>
            <View style={styles.surahDetails}>
              <Text style={applyFontStyle(styles.surahTitle, { fontFamily: FONTS.bold, color: '#FFFFFF' })}>
                Al-Fatihah
              </Text>
              <Text style={applyFontStyle(styles.ayah)}>Ayat No: 1</Text>
            </View>
            <Image 
              source={require('../assets/Quran.png')} 
              style={styles.bookImage}
            />
          </View>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#672CBC" />
        ) : (
          <FlatList
            data={surahData}
            renderItem={renderSurahItem}
            keyExtractor={item => item.nomor.toString()}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
      <LogoutModal 
        visible={logoutModalVisible} 
        onClose={() => setLogoutModalVisible(false)} 
      />
    </SideMenu>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
    paddingTop: StatusBar.currentHeight + 44,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  hamburgerButton: {
    fontSize: 34,
    color: '#672CBC',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#672CBC',
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 24,
  },
  greeting: {
    fontSize: 20,
    color: '#9587A3',
    marginTop: 20,
    marginBottom: 2,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  listContainer: {
    paddingHorizontal: 10,
    paddingBottom: 16,
  },
  lastReadCard: {
    backgroundColor: '#672CBC',
    borderRadius: 25,
    paddingTop: 16,
    paddingLeft: 16,
    marginBottom: 20,
    flexDirection: 'column',
    overflow: 'hidden', 
  },
  lastReadText: {
    color: '#FFFFFF',
    fontSize: 20,
    marginBottom: 8,
  },
  lastReadSurah: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ayah: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  bookImage: {
    width: 194,
    height: 110,
  },
  surahItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  surahNumber: {
    fontSize: 20,
    color: '#672CBC',
    marginRight: 16,
    width: 30,
  },
  surahInfo: {
    flex: 1,
  },
  surahTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#672CBC',
  },
  surahTranslation: {
    fontSize: 16,
    color: '#9587A3',
  },
  menu: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: StatusBar.currentHeight + 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 10,
  },
  name: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
  },
  menuItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  menuItemText: {
    color: '#000',
    fontSize: 18,
  },
  imagePlaceholder: {
    width: 150,
    height: 150,
    marginBottom: 20,
    // Anda bisa menyesuaikan properti sesuai kebutuhan gambar
  },
  actionButton: {
    width: '100%',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  actionButtonText: {
    color: '#672CBC',
    fontSize: 18,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    width: '76%',
    alignItems: 'center',
  },
  imageContainer: {
    backgroundColor: '#672CBC',
    width: '100%',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30
  },
  modalImage: {
    width: 250,
    height: 180,
    marginBottom: 100,
  },
  modalTitle: {
    fontSize: 20,
    color: '#672CBC',
    marginTop: 20,
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginHorizontal: 20,
    marginBottom: 10,
  },
  button: {
    width: '100%',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: '#EEEEEE',
  },
  buttonText: {
    color: '#000000',
    fontSize: 18,
    textAlign: 'center',
  },
  cancelButton: {
    width: '90%',
    paddingVertical: 12,
  },
  cancelButtonText: {
    color: '#956bd0',
    fontSize: 18,
    textAlign: 'center',
  }
});

export default HomeScreen;
