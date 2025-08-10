"use client";

import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBQ255kzjhaeC2S7hlcj8Tb72yV-ybdyRM",
  authDomain: "linkora-48d67.firebaseapp.com",
  projectId: "linkora-48d67",
  storageBucket: "linkora-48d67.firebasestorage.app",
  messagingSenderId: "34841223271",
  appId: "1:34841223271:web:77e5db106ca176336834c2",
  measurementId: "G-RT7FLNN8R1"
};

let app;
let auth;

if (typeof window !== 'undefined') {
  try {
    // Check if Firebase is already initialized
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0];
    }
    
    // Initialize Auth
    auth = getAuth(app);
    
    // Set persistence and timeout
    auth.settings = {
      ...auth.settings,
      appVerificationDisabledForTesting: process.env.NODE_ENV === 'development'
    };
  } catch (error) {
    console.error('Firebase initialization error:', error);
  }
}

export { auth };