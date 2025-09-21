import admin from "firebase-admin";
import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

let adminDb: admin.firestore.Firestore | null = null;

try {
  if (!getApps().length) {
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (!serviceAccountKey) {
       if (process.env.NODE_ENV === 'development') {
            console.warn(
                "\n***********************************************************************\n" +
                "WARNING: FIREBASE_SERVICE_ACCOUNT_KEY environment variable not set.\n" + 
                "Server-side Firebase operations will fail.\n" +
                "This is expected until you configure your service account.\n" +
                "Add the key to your .env.local file for local development.\n" +
                "***********************************************************************\n"
            );
        } else {
             console.error("CRITICAL: FIREBASE_SERVICE_ACCOUNT_KEY is missing. Server-side Firebase functionality is disabled.");
        }
    } else {
       const serviceAccount = JSON.parse(serviceAccountKey);
       initializeApp({
         credential: cert(serviceAccount),
         projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
       });
       adminDb = getFirestore();
    }
  } else {
    adminDb = getFirestore();
  }
} catch (error: any) {
    console.error("An unexpected error occurred during Firebase Admin initialization:", error);
}

export { adminDb };
