// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBQ255kzjhaeC2S7hlcj8Tb72yV-ybdyRM",
  authDomain: "linkora-48d67.firebaseapp.com",
  projectId: "linkora-48d67",
  storageBucket: "linkora-48d67.firebasestorage.app",
  messagingSenderId: "34841223271",
  appId: "1:34841223271:web:77e5db106ca176336834c2",
  measurementId: "G-RT7FLNN8R1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);