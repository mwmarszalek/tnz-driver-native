import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set } from 'firebase/database';

// Firebase configuration - PRODUCTION
const firebaseConfig = {
  apiKey: "AIzaSyDmkFY64CWLyncOMlFh0LzB58xi0kij_QE",
  authDomain: "transport-na-zadanie.firebaseapp.com",
  databaseURL: "https://transport-na-zadanie-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "transport-na-zadanie",
  storageBucket: "transport-na-zadanie.firebasestorage.app",
  messagingSenderId: "711401354826",
  appId: "1:711401354826:web:8b56cb345f7909166c58b3"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { app, database, ref, onValue, set };
