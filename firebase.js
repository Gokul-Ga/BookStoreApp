// firebase.js
import firebase from 'firebase/app';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyA8F8GlSDuhY7TxnwqJgWxT-dEDYswqDRw',
  authDomain: 'books-store-app-mern.firebaseapp.com',
  projectId: 'books-store-app-mern',
  storageBucket: 'books-store-app-mern.appspot.com',
  messagingSenderId: '95693197333',
  appId: '1:95693197333:web:8f7531d0e63cce3e6b7e1c',
  measurementId: "G-CG78YGMMH1"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Export the Firebase storage instance
module.exports = {
  storage: firebase.storage(),
};