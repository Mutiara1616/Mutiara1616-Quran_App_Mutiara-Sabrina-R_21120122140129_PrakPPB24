//AuthService.js

// Import Firebase Authentication dan Firestore
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "./firebaseConfig";
import { setDoc, doc, updateDoc, arrayUnion, collection, getDocs, writeBatch } from "firebase/firestore";

// Fungsi Registrasi
const registerUser = async (email, password, username) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Menyimpan data pengguna ke Firestore dengan username
        await setDoc(doc(db, "users", user.uid), {
            email: user.email,
            username: username,
            bookmarks: [],
            pinnedBookmarks: [] 
        });

        return user;
    } catch (error) {
        // Periksa jenis error dan berikan pesan khusus
        if (error.code === 'auth/email-already-in-use') {
            throw new Error("The email address is already in use. Please try a different one.");
        } else {
            throw error;
        }
    }
};

// Fungsi Login
const loginUser = async (email, password) => {
    try {
      // Mencoba login dengan email dan password
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      // Tangani error berdasarkan kode error dari Firebase
      if (error.code === 'auth/user-not-found') {
        throw new Error("No account found with this email. Please register first.");
      } else if (error.code === 'auth/wrong-password') {
        throw new Error("The password is incorrect. Please try again.");
      } else if (error.code === 'auth/invalid-email') {
        throw new Error("The email address is invalid. Please check your input.");
      } else {
        throw error; // Jika error lain, lempar error aslinya
      }
    }
};  

// Fungsi untuk menambahkan bookmark
// AuthService.js - Tambahkan fungsi ini
const addBookmarksToAllUsers = async () => {
  try {
    // Ambil semua dokumen dari koleksi users
    const usersSnapshot = await getDocs(collection(db, "users"));
    
    // Loop melalui setiap dokumen
    const batch = writeBatch(db);
    usersSnapshot.forEach((userDoc) => {
      const userRef = doc(db, "users", userDoc.id);
      
      // Jika bookmarks belum ada, tambahkan sebagai array kosong
      if (!userDoc.data().bookmarks) {
        batch.update(userRef, {
          bookmarks: []
        });
      }
    });
    
    // Commit batch update
    await batch.commit();
    console.log("Successfully added bookmarks field to all users");
  } catch (error) {
    console.error("Error adding bookmarks field:", error);
  }
};

// Export fungsi untuk digunakan di komponen lain
export { registerUser, loginUser };
