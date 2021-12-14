import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCiUk_nnR70MK0-evnJ3HLql9-yRy9SYLs',
  authDomain: 'movie-app-c872a.firebaseapp.com',
  projectId: 'movie-app-c872a',
  storageBucket: 'movie-app-c872a.appspot.com',
  messagingSenderId: '549243904003',
  appId: '1:549243904003:web:bb0bb9197597c0fb04ee36',
  measurementId: 'G-1METE7YH8K',
};

initializeApp(firebaseConfig);
export const db = getFirestore();
