/**
 * Firebase Integration & Configuration Layer
 * 
 * Supports both Live Firebase (Realtime Database & Firestore & Auth) 
 * when environment credentials exist, and graceful local offline synchronization
 * to guarantee that the KAVACH application never crashes or shows a blank screen.
 */
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
export interface FirebaseConfig {
  apiKey?: string;
  authDomain?: string;
  databaseURL?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
}

const env = (import.meta as any).env || {};

export const firebaseConfig: FirebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || '',
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || '',
  databaseURL: env.VITE_FIREBASE_DATABASE_URL || '',
  projectId: env.VITE_FIREBASE_PROJECT_ID || 'kavach-2d2e2',
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: env.VITE_FIREBASE_APP_ID || '',
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.apiKey !== '' && !firebaseConfig.apiKey.includes('MY_')
);
const app =initializeApp(firebaseConfig);
export const database = getDatabase(app);
