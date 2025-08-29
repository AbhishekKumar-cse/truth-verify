import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDtu02p-rL4F4NJ4MOVh1yA1_-kii16-Dw",
  authDomain: "truth-lens-z6wwx.firebaseapp.com",
  projectId: "truth-lens-z6wwx",
  storageBucket: "truth-lens-z6wwx.firebasestorage.app",
  messagingSenderId: "852170486176",
  appId: "1:852170486176:web:455d31760aab9179a074c5",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
