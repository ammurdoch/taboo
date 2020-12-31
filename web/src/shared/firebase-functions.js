import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions';

export const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyDx69_J-1pT0yLaG_UmykU8yZ1WSqvYmpc",
  authDomain: "check-supply.firebaseapp.com",
  projectId: "check-supply",
  storageBucket: "check-supply.appspot.com",
  messagingSenderId: "740012492538",
  appId: "1:740012492538:web:8fe8277ea17f7a8a70ab43",
  measurementId: "G-1VYKLBYGFK"
});

export const generateKeypair = firebase
  .functions()
  .httpsCallable('generateKeypair');
