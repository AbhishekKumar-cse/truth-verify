import admin from "firebase-admin";
import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

try {
  const serviceAccount = require("../../serviceAccountKey.json");

  if (!getApps().length) {
    initializeApp({
      credential: cert(serviceAccount),
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
  }
} catch (error: any) {
    // This error is expected if the service account key is not yet present.
    // We will log a warning in development, but not crash the app.
    if (error.code === 'MODULE_NOT_FOUND') {
        if (process.env.NODE_ENV === 'development') {
            console.warn(
                "\n***********************************************************************\n" +
                "WARNING: 'serviceAccountKey.json' not found in root directory.\n" + 
                "Server-side Firebase operations (like submitting a claim) will fail.\n" +
                "This is expected until you complete the final setup step.\n" +
                "Please download the key from your Firebase project settings and add it to the project root.\n" +
                "***********************************************************************\n"
            );
        } else {
             console.error("CRITICAL: 'serviceAccountKey.json' is missing. Server-side Firebase functionality is disabled.");
        }
    } else {
        console.error("An unexpected error occurred during Firebase Admin initialization:", error);
    }
}

// Get the Firestore instance, but it might not be initialized if the key is missing.
const adminDb = getApps().length ? getFirestore() : null;

export { adminDb };
