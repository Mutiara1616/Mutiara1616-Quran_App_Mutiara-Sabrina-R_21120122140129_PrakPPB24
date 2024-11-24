// app/api.js

import axios from 'axios';

// URL API equran.id
const BASE_URL = 'https://equran.id/api/v2';

export const fetchSurahList = async (limit = 15) => {
    try {
        const response = await axios.get(`${BASE_URL}/surat`);
        return response.data.data.slice(0, limit); // Membatasi jumlah surah yang diambil
    } catch (error) {
        console.error('Error fetching surah list:', error);
        throw error;
    }
};

// Fetch details of a specific surah
export const fetchSurahDetails = async (surahNumber) => {
    try {
        const response = await axios.get(`${BASE_URL}/surat/${surahNumber}`);
        return response.data; // Mengembalikan detail surat
    } catch (error) {
        console.error('Error fetching surah details:', error);
        throw error;
    }
};
