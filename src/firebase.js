import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyDG5F39xBinada7ItbgnQhA2mGcTuzt27g",
  authDomain: "star-e-hub.firebaseapp.com",
  projectId: "star-e-hub",
  storageBucket: "star-e-hub.firebasestorage.app",
  messagingSenderId: "945175849761",
  appId: "1:945175849761:web:734f3b22befe479be4ac60",
  measurementId: "G-4FE04YEPJC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const db = getFirestore(app);
export const auth = getAuth(app);

let analytics = null;
try {
  analytics = getAnalytics(app);
} catch (error) {
  console.warn("Firebase Analytics failed to initialize:", error);
}

export { analytics };
