import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions';
import 'firebase/storage';

export const firebaseApp = firebase.initializeApp({
  apiKey: 'AIzaSyARuH6cqgXZFf9AzYmlx12WGOAMfG2Lelg',
  authDomain: 'taboo-21d5d.firebaseapp.com',
  projectId: 'taboo-21d5d',
  storageBucket: 'taboo-21d5d.appspot.com',
  messagingSenderId: '923028723412',
  appId: '1:923028723412:web:46f0bb613b4e29ff4b8d41',
  measurementId: 'G-V6DZLCPYZD',
});

if (process.env.NODE_ENV === 'development') {
  // firebase.auth().useEmulator('http://localhost:9099/');
}

export const generateKeypair = firebase
  .functions()
  .httpsCallable('generateKeypair');
