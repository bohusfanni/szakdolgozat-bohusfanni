// Import the functions you need from the SDKs you need
//import firebase from '@react-native-firebase/app';
//import  '@react-native-firebase/auth';
import { initializeApp } from 'firebase/app';
//import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
// Other Firebase services you may need

//import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
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

const app = initializeApp(firebaseConfig);
//const db = getFirestore(app);
firebase.initializeApp(firebaseConfig);