// Server-side Firebase configuration for API routes
import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

const firebaseAdminConfig = {
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
  projectId: process.env.FIREBASE_PROJECT_ID,
}

// Initialize Firebase Admin (server-side)
const adminApp = !getApps().length ? initializeApp(firebaseAdminConfig, "admin") : getApps()[0]
const adminDb = getFirestore(adminApp)

export { adminDb }
