import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const firebaseAdminConfig = {
  projectId: process.env.GOOGLE_CLOUD_PROJECT,
};

if (!firebaseAdminConfig.projectId) {
  throw new Error("GOOGLE_CLOUD_PROJECT environment variable is required");
}

// Initialize Firebase Admin only if not already initialized
if (!getApps().length) {
  // In Cloud Run, we use Application Default Credentials
  initializeApp(firebaseAdminConfig);
}

export const db = getFirestore();
