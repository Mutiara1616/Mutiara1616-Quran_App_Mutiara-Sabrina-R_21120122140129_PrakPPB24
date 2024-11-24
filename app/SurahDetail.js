// app/SurahDetail.js

import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fetchSurahDetails } from './api';  
import { applyFontStyle, FONTS } from './GlobalStyles';
import Notif from './Notif';
import { auth, db } from './firebaseConfig';
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc, onSnapshot } from "firebase/firestore";


const SurahDetail = ({ route, navigation }) => {
  const { surahNumber } = route.params;  // Ambil nomor surah dari params
  const [surah, setSurah] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifVisible, setNotifVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

    const showNotif = () => setNotifVisible(true);
    const hideNotif = () => setNotifVisible(false);

  const [isBookmarked, setIsBookmarked] = useState(false);
  const toggleBookmark = async () => {
    if (!isLoggedIn) {
      showNotif();
      return;
    }
  
    try {
      const user = auth.currentUser;
      const userRef = doc(db, "users", user.uid);
      
      if (isBookmarked) {
        // Hapus bookmark
        await updateDoc(userRef, {
          bookmarks: arrayRemove(surahNumber)
        });
      } else {
        // Tambah bookmark
        await updateDoc(userRef, {
          bookmarks: arrayUnion(surahNumber)
        });
      }
      
      setIsBookmarked(!isBookmarked);
      Alert.alert(
        isBookmarked ? "Bookmark Removed" : "Bookmark Added",
        isBookmarked ? "Surah removed from bookmarks" : "Surah added to bookmarks"
      );
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      Alert.alert("Error", "Failed to update bookmark");
    }
  };
  const showLoginAlert = () => {
    Alert.alert(
      "Login Required",
      "You need to login or register to use the bookmark feature.",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Login", onPress: () => navigation.navigate('Login') },
        { text: "Register", onPress: () => navigation.navigate('Register') }
      ]
    );
  };
  
  // Letakkan di bagian atas setelah deklarasi state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user);
    });

    return () => unsubscribe();
  }, []);

  // Tambahkan useEffect untuk mengecek status bookmark
  useEffect(() => {
    const checkBookmarkStatus = async () => {
      if (isLoggedIn) {
        try {
          const user = auth.currentUser;
          const userRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userRef);
          
          if (userDoc.exists()) {
            const bookmarks = userDoc.data().bookmarks || [];
            setIsBookmarked(bookmarks.includes(surahNumber));
          }
        } catch (error) {
          console.error("Error checking bookmark status:", error);
        }
      }
    };

    checkBookmarkStatus();
  }, [isLoggedIn, surahNumber]);

  // di SurahDetail.js
  useEffect(() => {
    let unsubscribe = () => {};  // Initialize dengan empty function

    const checkBookmarkStatus = async () => {
      if (auth.currentUser) {
        const userRef = doc(db, "users", auth.currentUser.uid);
        unsubscribe = onSnapshot(userRef, (doc) => {
          if (doc.exists()) {
            const bookmarks = doc.data().bookmarks || [];
            setIsBookmarked(bookmarks.includes(surahNumber));
          }
        });
      }
    };

    checkBookmarkStatus();

    // Cleanup function
    return () => {
      unsubscribe(); // Memanggil unsubscribe function ketika component unmount
    };
  }, [surahNumber]);

  useEffect(() => {
    const getSurahDetails = async () => {
      try {
        const surahResponse = await fetchSurahDetails(surahNumber);
        console.log('Surah Response:', surahResponse);

        // Periksa apakah struktur data API benar
        if (surahResponse && surahResponse.data) {
          const { namaLatin, arti, tempatTurun, jumlahAyat, ayat } = surahResponse.data;

          // Processing ayat jika ada
          const processedAyahs = ayat.map((ayah, index) => {
            let arabicText = ayah.teksArab;
            if (index === 0 && surahNumber !== 1 && surahNumber !== 9) {
              arabicText = arabicText.replace('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', '').trim();
            }
            return {
              arabic: arabicText,
              translation: ayah.teksIndonesia,
              transliteration: ayah.teksLatin
            };
          });

          // Set state dengan data surah dan ayah yang sudah diproses
          setSurah({
            namaLatin,
            arti,
            tempatTurun,
            jumlahAyat,
            ayahs: processedAyahs
          });
        } else {
          console.error('Unexpected API response structure', surahResponse);
        }

      } catch (error) {
        console.error('Error fetching surah details:', error);
      } finally {
        setLoading(false);
      }
    };
  
    getSurahDetails();
  }, [surahNumber]);  

  if (loading || !surah) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#672CBC" />
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  const renderBismillah = () => {
    if (surahNumber !== 1 && surahNumber !== 9) {
      return (
        <View style={styles.bismillahContainer}>
          <Text style={applyFontStyle(styles.bismillahText)}>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</Text>
        </View>
      );
    }
    return null;
  };
  
  const renderAyah = (ayah, index) => {
    return (
      <View key={index} style={styles.verseContainer}>
        <Text style={applyFontStyle(styles.arabicText)}>{ayah.arabic}</Text>
        <Text style={applyFontStyle(styles.transliterationText)}>{ayah.transliteration}</Text>
        <Text style={applyFontStyle(styles.translationText)}>{ayah.translation}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#672CBC" />
        </TouchableOpacity>
        <Text style={applyFontStyle(styles.headerTitle, { fontFamily: FONTS.bold })}>
          {surah.namaLatin}
        </Text>
        <TouchableOpacity onPress={toggleBookmark} style={styles.bookmarkButton}>
          <Ionicons 
            name={isBookmarked ? "bookmark" : "bookmark-outline"} 
            size={24} 
            color="#672CBC" 
          />
        </TouchableOpacity>
        <Notif
          visible={notifVisible}
          onClose={hideNotif}
        />
        <View style={styles.placeholder}></View>
      </View>

      <ScrollView>
        {/* Card dengan informasi surah */}
        <View style={styles.card}>
          <Text style={applyFontStyle(styles.cardTitle, { fontFamily: FONTS.bold })}>
            {surah.namaLatin} {/* Nama surah */}
          </Text>
          <Text style={applyFontStyle(styles.cardSubtitle)}>
            {surah.arti} {/* Arti surah */}
          </Text>
          <Text style={applyFontStyle(styles.cardDetails)}>
            {surah.tempatTurun} • {surah.jumlahAyat} Ayat {/* Tempat turun dan jumlah ayat */}
          </Text>
        </View>

        {renderBismillah()}
        
        {surah.ayahs && surah.ayahs.map((ayah, index) => renderAyah(ayah, index))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#F5F5F5',
  },
  headerTitle: {
    fontSize: 20,
    color: '#672CBC',
    flex: 1,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#672CBC',
    borderRadius: 25,
    padding: 20,
    margin: 16,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 12,
  },
  cardSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  cardDetails: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  bismillah: {
    fontSize: 24,
    color: '#FFFFFF',
    marginTop: 16,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  verseNumber: {
    fontSize: 18,
    color: '#672CBC',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 100,
  },
  verseContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  arabicText: {
    fontSize: 24,
    color: '#000000',
    textAlign: 'right',
    marginBottom: 8,
  },
  translationText: {
    fontSize: 16,
    color: '#9587A3',
  },
  transliterationText: {
    fontSize: 16,
    color: '#7D7D7D',
    marginBottom: 8,
  },
  bismillahContainer: {
  backgroundColor: '#F0E6FF',
  borderRadius: 10,
  padding: 16,
  marginHorizontal: 16,
  marginBottom: 16,
  alignItems: 'center',
  },
  bismillahText: {
    fontSize: 24,
    color: '#672CBC',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5', // Sesuaikan warna latar belakang
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: '#672CBC',
  },
  bookmarkButton: {
    padding: 8,
  },
});

export default SurahDetail;