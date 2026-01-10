import { initializeApp } from 'firebase/app';
import {
  initializeAuth,
  getReactNativePersistence,
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBio90n2KuIQaW__yeXvbSH2kMacfXoKW4",
  authDomain: "szakdolgozat-bohusfanni.firebaseapp.com",
  projectId: "szakdolgozat-bohusfanni",
  storageBucket: "szakdolgozat-bohusfanni.appspot.com",
  messagingSenderId: "347585002814",
  appId: "1:347585002814:web:ee804f22883936e3bf406f",
};

export const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);