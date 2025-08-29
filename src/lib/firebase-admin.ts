import admin from "firebase-admin";
import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// IMPORTANT: You must provide your own service account key file.
// 1. Go to your Firebase Project Settings -> Service accounts.
// 2. Click "Generate new private key" and download the JSON file.
// 3. Rename it to 'serviceAccountKey.json' and place it in your project's root directory.
// 4. Make sure this file is added to .gitignore and is NOT committed to source control.
try {
  const serviceAccount = require("../../serviceAccountKey.json");

  if (!getApps().length) {
    initializeApp({
      credential: cert(serviceAccount),
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
  }
} catch (error) {
    if (process.env.NODE_ENV !== 'production') {
        console.warn("Could not find 'serviceAccountKey.json'. Server-side Firebase operations will fail. This is expected during client-side development if the file is not present.");
    } else {
        console.error("CRITICAL: 'serviceAccountKey.json' is missing. Server-side Firebase functionality is disabled.");
    }
}

const adminDb = getFirestore();

export { adminDb };
