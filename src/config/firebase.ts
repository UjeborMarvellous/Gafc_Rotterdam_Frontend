import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Validate required configuration
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  const missingVars = [];
  if (!firebaseConfig.apiKey) missingVars.push('REACT_APP_FIREBASE_API_KEY');
  if (!firebaseConfig.authDomain) missingVars.push('REACT_APP_FIREBASE_AUTH_DOMAIN');
  if (!firebaseConfig.projectId) missingVars.push('REACT_APP_FIREBASE_PROJECT_ID');
  if (!firebaseConfig.storageBucket) missingVars.push('REACT_APP_FIREBASE_STORAGE_BUCKET');
  if (!firebaseConfig.appId) missingVars.push('REACT_APP_FIREBASE_APP_ID');

  throw new Error(
    `Firebase configuration is incomplete. Missing environment variables: ${missingVars.join(', ')}\n` +
    'Please check your .env file and ensure all Firebase variables are set.'
  );
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Connect to emulators in development
if (process.env.NODE_ENV === 'development') {
  // Uncomment these lines if you want to use Firebase emulators
  // connectAuthEmulator(auth, 'http://localhost:9099');
  // connectFirestoreEmulator(db, 'localhost', 8080);
}

// Add error handling for Firebase initialization
auth.onAuthStateChanged((user) => {
  if (user) {
    console.log('Firebase auth state: User signed in');
  } else {
    console.log('Firebase auth state: User signed out');
  }
}, (error) => {
  console.error('Firebase auth state error:', error);
});

export default app;
