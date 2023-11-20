import firebase, { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBio90n2KuIQaW__yeXvbSH2kMacfXoKW4",
  authDomain: "szakdolgozat-bohusfanni.firebaseapp.com",
  projectId: "szakdolgozat-bohusfanni",
  storageBucket: "szakdolgozat-bohusfanni.appspot.com",
  messagingSenderId: "347585002814",
  appId: "1:347585002814:web:ee804f22883936e3bf406f"
};

// Initialize Firebase
  export const FIREBASE_APP = initializeApp(firebaseConfig);
  export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
//const db = getFirestore(app);
