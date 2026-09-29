import { 
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
  Unsubscribe
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { syncUserProfile } from '../lib/firestoreService';
import { User } from '../types';

/**
 * Transforms a FirebaseUser instance into the Finova User domain model
 */
export function mapFirebaseUser(firebaseUser: FirebaseUser | null): User | null {
  if (!firebaseUser) return null;
  return {
    id: firebaseUser.uid,
    name: firebaseUser.displayName || (firebaseUser.email ? firebaseUser.email.split('@')[0] : 'Finova Member'),
    email: firebaseUser.email || '',
    role: 'Member',
    company: 'Personal Account',
    avatar: firebaseUser.photoURL || undefined,
  };
}

/**
 * Finova Auth Service
 * Provides unified interface for Email/Password and Google OAuth authentication
 */
export const authService = {
  /**
   * Authenticate with Google OAuth via popup
   */
  async signInWithGoogle(): Promise<User> {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Persist profile metadata to Firestore
      await syncUserProfile({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      });

      const mapped = mapFirebaseUser(user);
      if (!mapped) throw new Error('Failed to map user profile');
      return mapped;
    } catch (error: any) {
      console.error('Google Sign-In Error in AuthService:', error);
      throw error;
    }
  },

  /**
   * Register a new user using Email and Password
   */
  async signUpWithEmail(fullName: string, email: string, pass: string): Promise<User> {
    try {
      const cleanEmail = email.trim();
      const cleanName = fullName.trim();
      
      const result = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
      const user = result.user;

      if (cleanName && user) {
        await updateProfile(user, { displayName: cleanName });
      }

      // Persist profile metadata to Firestore
      await syncUserProfile({
        uid: user.uid,
        email: cleanEmail,
        displayName: cleanName || user.displayName,
        photoURL: user.photoURL,
      });

      const mapped = mapFirebaseUser(user);
      if (!mapped) throw new Error('Failed to map created user profile');
      return mapped;
    } catch (error: any) {
      if (error?.code === 'auth/operation-not-allowed') {
        console.warn('Firebase Email/Password provider is disabled in Firebase Console:', error.message);
      } else {
        console.error('Email Sign-Up Error in AuthService:', error);
      }
      throw error;
    }
  },

  /**
   * Log in an existing user using Email and Password
   */
  async signInWithEmail(email: string, pass: string): Promise<User> {
    try {
      const cleanEmail = email.trim();
      const result = await signInWithEmailAndPassword(auth, cleanEmail, pass);
      const user = result.user;

      // Sync latest profile metadata
      await syncUserProfile({
        uid: user.uid,
        email: user.email || cleanEmail,
        displayName: user.displayName,
        photoURL: user.photoURL,
      });

      const mapped = mapFirebaseUser(user);
      if (!mapped) throw new Error('Failed to map authenticated user profile');
      return mapped;
    } catch (error: any) {
      if (error?.code === 'auth/operation-not-allowed') {
        console.warn('Firebase Email/Password provider is disabled in Firebase Console:', error.message);
      } else {
        console.error('Email Sign-In Error in AuthService:', error);
      }
      throw error;
    }
  },

  /**
   * Sign out current active session
   */
  async logOut(): Promise<void> {
    try {
      await firebaseSignOut(auth);
    } catch (error: any) {
      console.error('Sign Out Error in AuthService:', error);
      throw error;
    }
  },

  /**
   * Listen to active Firebase authentication state changes
   */
  subscribeToAuthState(
    callback: (user: User | null, rawUser: FirebaseUser | null) => void
  ): Unsubscribe {
    return onAuthStateChanged(auth, (rawUser) => {
      const mapped = mapFirebaseUser(rawUser);
      callback(mapped, rawUser);
    });
  },

  /**
   * Check current synchronous authenticated user
   */
  getCurrentUser(): User | null {
    return mapFirebaseUser(auth.currentUser);
  },

  /**
   * Check if an active authenticated Firebase session exists
   */
  isAuthenticated(): boolean {
    return auth.currentUser !== null;
  }
};

export default authService;
