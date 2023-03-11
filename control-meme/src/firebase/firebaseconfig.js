// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCNIMIUDxulPRqtCfKphdaVZzXGpTmPnMk",
  authDomain: "control-meme-67c47.firebaseapp.com",
  projectId: "control-meme-67c47",
  storageBucket: "control-meme-67c47.appspot.com",
  messagingSenderId: "394361946394",
  appId: "1:394361946394:web:2bc6547da1e6fc8826aca3",
  measurementId: "G-9FQRHEMYWP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
