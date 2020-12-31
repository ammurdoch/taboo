import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions';

export const firebaseApp = firebase.initializeApp({
  apiKey: 'AIzaSyD_w9c7g98WbGsJ0jB1nZVaFCoJLxzOdMQ',
  authDomain: 'theora-clear-deployments.firebaseapp.com',
  databaseURL: 'https://theora-clear-deployments.firebaseio.com',
  projectId: 'theora-clear-deployments',
  storageBucket: 'theora-clear-deployments.appspot.com',
  messagingSenderId: '879012174755',
  appId: '1:879012174755:web:b3366d7d27ca17969f5816',
});

export const generateKeypair = firebase
  .functions()
  .httpsCallable('generateKeypair');
