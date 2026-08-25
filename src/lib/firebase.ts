import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC8LjWDGy42blxJIcuGKwFtLjfuuZK5XtI",
  authDomain: "sampras-okinawa.firebaseapp.com",
  projectId: "sampras-okinawa",
  storageBucket: "sampras-okinawa.firebasestorage.app",
  messagingSenderId: "1006504243913",
  appId: "1:1006504243913:web:15a7b0f8bdf362431b1318",
  measurementId: "G-ZH1R45P4VG"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
