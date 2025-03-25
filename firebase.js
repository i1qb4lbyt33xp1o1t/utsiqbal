import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBH-XnL0hXTF9N0HpBYwYMjvCl3Y8oVFmo",
  authDomain: "web-stats-14444.firebaseapp.com",
  projectId: "web-stats-14444",
  storageBucket: "web-stats-14444.firebasestorage.app",
  messagingSenderId: "845455411430",
  appId: "1:845455411430:web:3c806c813858d1da399327"
};

console.log('Initializing Firebase with config:', firebaseConfig);
const app = initializeApp(firebaseConfig);
console.log('Firebase app initialized:', app);
export const db = getFirestore(app);
console.log('Firestore db initialized:', db);