import { initializeApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile
} from 'firebase/auth';
import { 
  initializeFirestore,
  getFirestore, 
  doc, 
  getDocFromServer,
  collection,
  query,
  onSnapshot,
  setDoc,
  deleteDoc,
  Firestore
} from 'firebase/firestore';

// Safely discover local fallback config if firebase-applet-config.json exists
const configFiles = import.meta.glob<{ default: Record<string, any> }>('/firebase-applet-config.json', {
  eager: true,
});
const fileConfig = configFiles['/firebase-applet-config.json']?.default || {};

// Read Firebase configuration from environment variables with fallback to fileConfig
export const firebaseConfig = {
  apiKey:
    import.meta.env.FIREBASE_API_KEY ||
    import.meta.env.VITE_FIREBASE_API_KEY ||
    fileConfig.apiKey ||
    '',
  authDomain:
    import.meta.env.FIREBASE_AUTH_DOMAIN ||
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ||
    fileConfig.authDomain ||
    '',
  projectId:
    import.meta.env.FIREBASE_PROJECT_ID ||
    import.meta.env.VITE_FIREBASE_PROJECT_ID ||
    fileConfig.projectId ||
    '',
  storageBucket:
    import.meta.env.FIREBASE_STORAGE_BUCKET ||
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    fileConfig.storageBucket ||
    '',
  messagingSenderId:
    import.meta.env.FIREBASE_MESSAGING_SENDER_ID ||
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ||
    fileConfig.messagingSenderId ||
    '',
  appId:
    import.meta.env.FIREBASE_APP_ID ||
    import.meta.env.VITE_FIREBASE_APP_ID ||
    fileConfig.appId ||
    '',
  measurementId:
    import.meta.env.FIREBASE_MEASUREMENT_ID ||
    import.meta.env.VITE_FIREBASE_MEASUREMENT_ID ||
    fileConfig.measurementId ||
    '',
  firestoreDatabaseId:
    import.meta.env.FIREBASE_DATABASE_ID ||
    import.meta.env.FIREBASE_FIRESTORE_DATABASE_ID ||
    import.meta.env.VITE_FIREBASE_DATABASE_ID ||
    import.meta.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID ||
    fileConfig.firestoreDatabaseId ||
    '',
};

// Initialize Firebase App singleton
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// CRITICAL: Initialize Firestore using the configured database ID from environment variables / config
// Use experimentalForceLongPolling to ensure reliable connectivity within iframe and sandboxed environments
export const db: Firestore = initializeFirestore(
  app,
  {
    experimentalForceLongPolling: true,
  },
  firebaseConfig.firestoreDatabaseId || undefined
);

// Initialize Firebase Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Connection test helper
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore is currently operating in offline mode.');
    }
    return false;
  }
}

// Standard error reporting required by Firebase skill
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errCode = (error as any)?.code;
  const errMsg = error instanceof Error ? error.message : String(error);

  // If the error indicates transient offline status or unavailable backend, log as warning so offline cache continues operating
  if (errCode === 'unavailable' || errMsg.includes('client is offline') || errMsg.includes('Could not reach Cloud Firestore')) {
    console.warn(`Firestore operating offline for ${operationType} on ${path}: ${errMsg}`);
    return;
  }

  const errInfo: FirestoreErrorInfo = {
    error: errMsg,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Authentication Helpers
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
}

export async function loginWithEmail(email: string, pass: string) {
  try {
    const result = await signInWithEmailAndPassword(auth, email, pass);
    return result.user;
  } catch (error: any) {
    console.error('Error logging in with email:', error);
    throw error;
  }
}

export async function registerWithEmail(name: string, email: string, pass: string) {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, pass);
    if (name && result.user) {
      await updateProfile(result.user, { displayName: name });
    }
    return result.user;
  } catch (error: any) {
    console.error('Error registering user:', error);
    throw error;
  }
}

export async function logOut() {
  return firebaseSignOut(auth);
}

export { onAuthStateChanged };
export type { FirebaseUser };
export { authService } from '../services/authService';
