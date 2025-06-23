// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA1S6-DKAeCCxwlKpKlm1vuFpIUize74lQ",
  authDomain: "aucmaservicemanagement.firebaseapp.com",
  projectId: "aucmaservicemanagement",
  storageBucket: "aucmaservicemanagement.firebasestorage.app",
  messagingSenderId: "391005941352",
  appId: "1:391005941352:web:9a51fd1546472ce29515dd",
  measurementId: "G-2S4F1Y1HP2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth()
export const db = getFirestore(app);

export default app
