import firebase from 'firebase/app';
import 'firebase/auth';

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

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // if already initialized, use that one
}
//const db = getFirestore(app);