import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";  // Import Firebase Auth and GoogleAuthProvider
import { getFirestore } from "firebase/firestore";  // Import Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBvoNMdP19ABc2vstBW4CDAfmomVap58jM",
  authDomain: "synthetica-3bf2d.firebaseapp.com",
  projectId: "synthetica-3bf2d",
  storageBucket: "synthetica-3bf2d.appspot.com",
  messagingSenderId: "44154583468",
  appId: "1:44154583468:web:2f4c5659f3853b196a6209",
  measurementId: "G-RCM38WXWL0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);  // Initialize Firebase Auth
const provider = new GoogleAuthProvider();  // Initialize Google Auth Provider
const db = getFirestore(app);  // Initialize Firestore

export { auth, provider, db };  // Export auth, provider, and db
