import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions';
import 'firebase/storage';

export const firebaseApp = firebase.initializeApp({
  apiKey: 'AIzaSyDx69_J-1pT0yLaG_UmykU8yZ1WSqvYmpc',
  authDomain: 'check-supply.firebaseapp.com',
  projectId: 'check-supply',
  storageBucket: 'check-supply.appspot.com',
  messagingSenderId: '740012492538',
  appId: '1:740012492538:web:8fe8277ea17f7a8a70ab43',
  measurementId: 'G-1VYKLBYGFK',
});

if (process.env.NODE_ENV === 'development') {
  // firebase.auth().useEmulator('http://localhost:9099/');
}

export const generateKeypair = firebase
  .functions()
  .httpsCallable('generateKeypair');
