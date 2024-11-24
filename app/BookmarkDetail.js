// app/BookmarkDetail.js

import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fetchSurahDetails } from './api';
import { applyFontStyle, FONTS } from './GlobalStyles';

const BookmarkDetail = ({ route, navigation }) => {
  const { surahNumber } = route.params;
  const [surah, setSurah] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSurahDetails = async () => {
      try {
        const response = await fetchSurahDetails(surahNumber);
        if (response && response.data) {
          setSurah(response.data);
        }
      } catch (error) {
        console.error('Error fetching surah details:', error);
      } finally {
        setLoading(false);
      }
    };

    getSurahDetails();
  }, [surahNumber]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#672CBC" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#672CBC" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{surah?.namaLatin}</Text>
        <View style={styles.placeholder} />
      </View>

      {/* ScrollView yang mencakup card dan ayat */}
      <ScrollView style={styles.scrollView}>
        {/* Info Card */}
        <View style={styles.card}>
          <Text style={applyFontStyle(styles.cardTitle, { fontFamily: FONTS.bold })}>
            {surah?.namaLatin}
          </Text>
          <Text style={applyFontStyle(styles.cardSubtitle)}>
            {surah?.arti}
          </Text>
          <Text style={applyFontStyle(styles.cardDetails)}>
            {surah?.tempatTurun} • {surah?.jumlahAyat} Ayat
          </Text>
        </View>

        {/* Ayat List */}
        <View style={styles.ayatContainer}>
          {surah?.ayat.map((ayah, index) => (
            <View key={index} style={styles.ayatCard}>
              <View style={styles.ayatHeader}>
                <View style={styles.ayatNumber}>
                  <Text style={styles.ayatNumberText}>{index + 1}</Text>
                </View>
              </View>
              <Text style={styles.arabicText}>{ayah.teksArab}</Text>
              <Text style={styles.latinText}>{ayah.teksLatin}</Text>
              <Text style={styles.translationText}>{ayah.teksIndonesia}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F5F5F5',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      paddingTop: 60,
      backgroundColor: '#F5F5F5',
    },
    headerTitle: {
      flex: 1,
      fontSize: 20,
      textAlign: 'center',
      fontFamily: FONTS.bold,
      color: '#672CBC',
    },
    placeholder: {
      width: 24,
    },
    scrollView: {
      flex: 1,
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
      fontFamily: FONTS.bold,
    },
    cardSubtitle: {
      fontSize: 16,
      color: '#FFFFFF',
      marginBottom: 4,
      fontFamily: FONTS.regular,
    },
    cardDetails: {
      fontSize: 16,
      color: '#FFFFFF',
      marginBottom: 4,
      fontFamily: FONTS.regular,
    },
    ayatContainer: {
      padding: 16,
      paddingTop: 0,
    },
    ayatCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: 15,
      padding: 16,
      marginBottom: 16,
    },
    ayatHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    ayatNumber: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#672CBC',
      justifyContent: 'center',
      alignItems: 'center',
    },
    ayatNumberText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontFamily: FONTS.medium,
    },
    arabicText: {
      fontSize: 24,
      textAlign: 'right',
      color: '#000000',
      marginBottom: 16,
    },
    latinText: {
      fontSize: 14,
      color: '#7D7D7D',
      marginBottom: 8,
      fontFamily: FONTS.regular,
    },
    translationText: {
      fontSize: 14,
      color: '#9587A3',
      fontFamily: FONTS.regular,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
});

export default BookmarkDetail;