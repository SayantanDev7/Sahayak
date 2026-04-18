/**
 * Firebase Client SDK Configuration
 * 
 * This initializes the Firebase app on the frontend for authentication.
 * The backend uses firebase-admin for token verification; this is the
 * client counterpart that produces those tokens.
 * 
 * IMPORTANT: You MUST set VITE_FIREBASE_API_KEY in your .env file.
 * Get it from: Firebase Console → Project Settings → General → Web API Key
 */
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';

// Firebase project config — these are public keys, safe to commit.
// They match the backend's FIREBASE_PROJECT_ID.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "sahayak-2980.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "sahayak-2980",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "sahayak-2980.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
};

// Validate the critical API key — fail early with a clear message
if (!firebaseConfig.apiKey || firebaseConfig.apiKey.startsWith('YOUR_')) {
  console.error(
    '⚠️ VITE_FIREBASE_API_KEY is missing or still a placeholder!\n' +
    'Create/edit the file: sahayak/.env\n' +
    'Add: VITE_FIREBASE_API_KEY=your_real_key_here\n' +
    'Get it from: Firebase Console → Project Settings → General → Web API Key\n' +
    'Then restart the dev server (npm run dev)'
  );
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

export {
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  googleProvider,
  githubProvider,
  signOut,
  onAuthStateChanged,
  updateProfile
};
