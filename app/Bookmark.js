// app/Bookmark.js

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert, StyleSheet, ActivityIndicator, SafeAreaView } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { applyFontStyle, FONTS } from './GlobalStyles';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import { auth, db } from './firebaseConfig';
import { doc, getDoc, updateDoc  } from "firebase/firestore";
import { fetchSurahDetails } from './api';

const Bookmark = ({ navigation }) => {
  const [bookmarks, setBookmarks] = useState([]);
  const [surahDetails, setSurahDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [pinnedBookmarks, setPinnedBookmarks] = useState([]);
  let row = [];
  let prevOpenedRow;

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userRef);
          
          if (userDoc.exists()) {
            const bookmarkData = userDoc.data().bookmarks || [];
            const pinnedData = userDoc.data().pinnedBookmarks || []; // Ambil pinned bookmarks
            
            setBookmarks(bookmarkData.filter(item => !pinnedData.includes(item))); // Filter out pinned bookmarks
            setPinnedBookmarks(pinnedData);
            
            // Fetch detail untuk setiap surah yang di-bookmark
            const details = {};
            await Promise.all(
              [...bookmarkData, ...pinnedData].map(async (surahNumber) => {
                const response = await fetchSurahDetails(surahNumber);
                details[surahNumber] = response.data;
              })
            );
            setSurahDetails(details);
          }
        }
      } catch (error) {
        console.error("Error fetching bookmarks:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchBookmarks();
  }, []);

  const closeRow = (index) => {
    if (prevOpenedRow && prevOpenedRow !== row[index]) {
      prevOpenedRow.close();
    }
    prevOpenedRow = row[index];
  };

  const renderRightActions = (progress, dragX, onPress, item) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    const isPinned = pinnedBookmarks.includes(item);

    return (
      <View style={styles.rightActionContainer}>
        <TouchableOpacity 
          style={[styles.rightAction, { backgroundColor: '#2196F3' }]} 
          onPress={() => handleMenuAction(isPinned ? 'unpin' : 'pin', item)}>
          <Text>
            {isPinned ? (
              <MaterialCommunityIcons name="pin-off" size={30} color="#FFFFFF" />
            ) : (
              <MaterialCommunityIcons name="pin" size={30} color="#FFFFFF" />
            )}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.rightAction, { backgroundColor: '#672CBC' }]} 
          onPress={() => handleMenuAction('rename', item)}>
          <Text>
            <Ionicons name="pencil-outline" size={30} color="#FFFFFF" />
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.rightAction, { backgroundColor: '#FF6B6B' }]} 
          onPress={() => handleMenuAction('delete', item)}>
          <Text>
            <Ionicons name="trash-outline" size={30} color="#FFFFFF" />
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const handleMenuAction = async (action, item) => {
    const user = auth.currentUser;
    if (!user) return;
  
    const userRef = doc(db, "users", user.uid);
  
    switch(action) {
      case 'pin':
        if (!pinnedBookmarks.includes(item)) {
          const newPinnedBookmarks = [...pinnedBookmarks, item];
          const newBookmarks = bookmarks.filter(bookmark => bookmark !== item);
          
          setPinnedBookmarks(newPinnedBookmarks);
          setBookmarks(newBookmarks);
          
          // Update Firestore
          await updateDoc(userRef, {
            bookmarks: newBookmarks,
            pinnedBookmarks: newPinnedBookmarks
          });
        }
        break;
        
      case 'unpin':
        const newPinnedBookmarks = pinnedBookmarks.filter(bookmark => bookmark !== item);
        const newBookmarks = [...bookmarks, item];
        
        setPinnedBookmarks(newPinnedBookmarks);
        setBookmarks(newBookmarks);
        
        // Update Firestore
        await updateDoc(userRef, {
          bookmarks: newBookmarks,
          pinnedBookmarks: newPinnedBookmarks
        });
        break;
        
      case 'delete':
        Alert.alert(
          "Bookmark Removed",
          "Surah removed from bookmarks",
          [
            {
              text: "OK",
              onPress: async () => {
                const newBookmarks = bookmarks.filter(bookmark => bookmark !== item);
                const newPinnedBookmarks = pinnedBookmarks.filter(bookmark => bookmark !== item);
                
                setBookmarks(newBookmarks);
                setPinnedBookmarks(newPinnedBookmarks);
                
                // Update Firestore
                await updateDoc(userRef, {
                  bookmarks: newBookmarks,
                  pinnedBookmarks: newPinnedBookmarks
                });
              }
            }
          ]
        );
        break;
    }
  };

  const renderBookmarkItem = ({ item, index, array }) => ( 
    <Swipeable
      ref={ref => row[index] = ref}
      renderRightActions={(progress, dragX) => 
        renderRightActions(progress, dragX, () => closeRow(index), item)
      }
      onSwipeableOpen={() => closeRow(index)}
      rightOpenValue={-180}
    >
      <TouchableOpacity 
        activeOpacity={1}  // Tambahkan ini untuk menghilangkan efek fade
        onPress={() => navigation.navigate('BookmarkDetail', { surahNumber: item })}
      >
        <View style={[
          styles.bookmarkItem,
          index !== array.length - 1 && styles.bookmarkItemBorder
        ]}>
          <View style={styles.bookmarkItemLeft}>
            <Ionicons name="bookmark-outline" size={24} color="#672CBC" />
            <View style={styles.bookmarkItemTextContainer}>
              <Text style={[styles.bookmarkItemTitle, { color: '#672CBC', fontFamily: FONTS.bold }]}>
                {surahDetails[item]?.namaLatin || `Surah ${item}`}
              </Text>
              <Text style={applyFontStyle(styles.bookmarkItemCount, { fontFamily: FONTS.regular })}>
                {surahDetails[item]?.tempatTurun} • {surahDetails[item]?.jumlahAyat} Ayat
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#672CBC" />
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#672CBC" />
        </TouchableOpacity>
        <Text style={applyFontStyle(styles.headerTitle, { fontFamily: FONTS.bold })}>
          Bookmarks
        </Text>
        <View style={styles.placeholder} />
      </View>

      {/* Section untuk Bookmark yang di-pin */}
      {pinnedBookmarks.length > 0 && (
        <>
          <Text style={applyFontStyle(styles.sectionTitle, { fontFamily: FONTS.bold })}>Di pin</Text>
          <View style={styles.listContainer}>
            {pinnedBookmarks.map((item, index) => (
              <View key={`pinned-${item}`}>
                {renderBookmarkItem({ 
                  item, 
                  index, 
                  array: pinnedBookmarks 
                })}
              </View>
            ))}
          </View>
        </>
      )}

      {/* Section untuk Bookmark terbaru */}
      <Text style={applyFontStyle(styles.sectionTitle, { fontFamily: FONTS.bold })}>Terbaru</Text>
      {bookmarks.length > 0 ? (
        <View style={styles.listContainer}>
          <FlatList
            data={bookmarks}
            keyExtractor={(item) => item.toString()}
            renderItem={({ item, index }) => renderBookmarkItem({ 
              item, 
              index, 
              array: bookmarks // Teruskan array bookmarks
            })} 
            contentContainerStyle={{ padding: 0 }}
          />
        </View>
      ) : (
        <Text style={applyFontStyle({ textAlign: 'center', marginTop: 20 }, { fontFamily: FONTS.regular })}>
          No bookmarks found.
        </Text>
      )}
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    color: '#672CBC',
    marginRight: 24,
  },
  addNewCollection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#672CBC',
    borderStyle: 'dashed',
  },
  addNewCollectionText: {
    marginLeft: 10,
    color: '#672CBC',
    fontSize: 16,
  },
  bookmarkContainer: {
    marginHorizontal: 20,
    marginBottom: 10,
  },
  bookmarkItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
  },
  bookmarkItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  bookmarkItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookmarkItemTextContainer: {
    marginLeft: 15,
  },
  bookmarkItemTitle: {
    fontSize: 16,
    color: '#000000',
  },
  bookmarkItemCount: {
    fontSize: 14,
    color: '#9D9D9D',
    marginTop: 4,
  },
  rightActionContainer: {
    width: 180,
    flexDirection: 'row',
    height: '100%',
  },
  rightAction: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
    sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#672CBC',
    marginLeft: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: '#672CBC',
  },
  listContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
});

export default Bookmark;