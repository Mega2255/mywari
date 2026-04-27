// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

// Replace with your Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyALChv_yWRFyLjWmHA5RWEjRpyBcb0fNzQ",
  authDomain: "school-pva.firebaseapp.com",
  databaseURL: "https://school-pva-default-rtdb.firebaseio.com",
  projectId: "school-pva",
  storageBucket: "school-pva.firebasestorage.app",
  messagingSenderId: "555907156467",
  appId: "1:555907156467:web:51e6c3ddddcb1c2477ea86"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
export const storage = getStorage(app);
export default app;
