import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDYo7QMiDKulRgp-4cr9rVu5F0cvcI4P34",
  authDomain: "iqbal-8d5b6.firebaseapp.com",
  projectId: "iqbal-8d5b6",
  storageBucket: "iqbal-8d5b6.firebasestorage.app",
  messagingSenderId: "930704607161",
  appId: "1:930704607161:web:3b6f32b3441525c47b9868"
};

console.log('Initializing Firebase with config:', firebaseConfig);
const app = initializeApp(firebaseConfig);
console.log('Firebase app initialized:', app);
export const db = getFirestore(app);
console.log('Firestore db initialized:', db);
