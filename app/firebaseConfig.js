//firebaseConfig.js

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Import Firebase Authentication
import { getFirestore } from "firebase/firestore"; // Import Firestore
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDz8lcD8SxmSS8n22FGynt1Fha0iR4tTXA",
  authDomain: "quranapp-46c3c.firebaseapp.com",
  projectId: "quranapp-46c3c",
  storageBucket: "quranapp-46c3c.appspot.com",
  messagingSenderId: "802987235949",
  appId: "1:802987235949:web:0140b0cb9d85eb788f7d64",
  measurementId: "G-LT71ZKBNKB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app); // Initialize Authentication
const db = getFirestore(app); // Initialize Firestore

// Export auth and db so they can be used in other files
export { auth, db };
