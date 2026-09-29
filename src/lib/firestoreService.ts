import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  getDoc,
  Unsubscribe 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { Account, Transaction, User } from '../types';

export interface UserInvestSettings {
  initialPrincipal: number;
  monthlyContribution: number;
  riskLevel: 'conservative' | 'balanced' | 'growth' | 'aggressive';
  selectedPortfolio: string;
  isAutoInvestActive: boolean;
}

export interface UserLearnProgress {
  completedLessonIds: string[];
}

/**
 * Sync user profile to Firestore
 */
export async function syncUserProfile(user: { uid: string; email?: string | null; displayName?: string | null; photoURL?: string | null }) {
  const path = `users/${user.uid}`;
  try {
    const userDocRef = doc(db, 'users', user.uid);
    await setDoc(userDocRef, {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || 'Finova Member',
      photoURL: user.photoURL || '',
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Subscribe to real-time user profile data in Firestore
 */
export function subscribeToUserProfile(
  userId: string,
  onUpdate: (profile: Partial<User>) => void
): Unsubscribe {
  const path = `users/${userId}`;
  try {
    const userDocRef = doc(db, 'users', userId);
    return onSnapshot(
      userDocRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          onUpdate({
            id: userId,
            name: data.displayName || data.name || 'Finova Member',
            email: data.email || '',
            role: data.role || 'Member',
            company: data.company || 'Personal Account',
            avatar: data.photoURL || data.avatar || undefined,
            avatarAttribution: data.avatarAttribution,
            phone: data.phone,
            bio: data.bio,
            jobTitle: data.jobTitle,
            location: data.location,
            currencyPreference: data.currencyPreference,
            twoFactorEnabled: data.twoFactorEnabled,
            emailNotifications: data.emailNotifications,
            smsNotifications: data.smsNotifications,
          });
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, path);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return () => {};
  }
}

/**
 * Persist updated user profile fields to Firestore
 */
export async function updateUserProfile(userId: string, data: Partial<User>): Promise<void> {
  const path = `users/${userId}`;
  try {
    const userDocRef = doc(db, 'users', userId);
    const updatePayload: Record<string, any> = {
      updatedAt: new Date().toISOString(),
    };

    if (data.name !== undefined) {
      updatePayload.displayName = data.name;
      updatePayload.name = data.name;
    }
    if (data.email !== undefined) updatePayload.email = data.email;
    if (data.role !== undefined) updatePayload.role = data.role;
    if (data.company !== undefined) updatePayload.company = data.company;
    if (data.avatar !== undefined) {
      updatePayload.photoURL = data.avatar || '';
      updatePayload.avatar = data.avatar || '';
    }
    if (data.avatarAttribution !== undefined) updatePayload.avatarAttribution = data.avatarAttribution;
    if (data.phone !== undefined) updatePayload.phone = data.phone;
    if (data.bio !== undefined) updatePayload.bio = data.bio;
    if (data.jobTitle !== undefined) updatePayload.jobTitle = data.jobTitle;
    if (data.location !== undefined) updatePayload.location = data.location;
    if (data.currencyPreference !== undefined) updatePayload.currencyPreference = data.currencyPreference;
    if (data.twoFactorEnabled !== undefined) updatePayload.twoFactorEnabled = data.twoFactorEnabled;
    if (data.emailNotifications !== undefined) updatePayload.emailNotifications = data.emailNotifications;
    if (data.smsNotifications !== undefined) updatePayload.smsNotifications = data.smsNotifications;

    await setDoc(userDocRef, updatePayload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
}

/**
 * Subscribe to real-time accounts for an authenticated user
 */
export function subscribeToAccounts(
  userId: string, 
  onUpdate: (accounts: Account[]) => void
): Unsubscribe {
  const path = `users/${userId}/accounts`;
  try {
    const colRef = collection(db, 'users', userId, 'accounts');
    return onSnapshot(
      colRef,
      (snapshot) => {
        const accounts: Account[] = [];
        snapshot.forEach((docSnap) => {
          accounts.push(docSnap.data() as Account);
        });
        onUpdate(accounts);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return () => {};
  }
}

/**
 * Save or update an account in Firestore
 */
export async function saveAccount(userId: string, account: Account): Promise<void> {
  const path = `users/${userId}/accounts/${account.id}`;
  try {
    const docRef = doc(db, 'users', userId, 'accounts', account.id);
    await setDoc(docRef, {
      ...account,
      userId,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Delete an account from Firestore
 */
export async function removeAccount(userId: string, accountId: string): Promise<void> {
  const path = `users/${userId}/accounts/${accountId}`;
  try {
    const docRef = doc(db, 'users', userId, 'accounts', accountId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Subscribe to real-time transactions for an authenticated user
 */
export function subscribeToTransactions(
  userId: string, 
  onUpdate: (transactions: Transaction[]) => void
): Unsubscribe {
  const path = `users/${userId}/transactions`;
  try {
    const colRef = collection(db, 'users', userId, 'transactions');
    return onSnapshot(
      colRef,
      (snapshot) => {
        const txs: Transaction[] = [];
        snapshot.forEach((docSnap) => {
          txs.push(docSnap.data() as Transaction);
        });
        // Sort newest first
        txs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        onUpdate(txs);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return () => {};
  }
}

/**
 * Save a transaction in Firestore
 */
export async function saveTransaction(userId: string, transaction: Transaction): Promise<void> {
  const path = `users/${userId}/transactions/${transaction.id}`;
  try {
    const docRef = doc(db, 'users', userId, 'transactions', transaction.id);
    await setDoc(docRef, {
      ...transaction,
      userId,
      createdAt: transaction.date || new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Subscribe to micro-invest settings
 */
export function subscribeToInvestSettings(
  userId: string,
  onUpdate: (settings: UserInvestSettings) => void
): Unsubscribe {
  const path = `users/${userId}/investSettings/current`;
  try {
    const docRef = doc(db, 'users', userId, 'investSettings', 'current');
    return onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          onUpdate(snapshot.data() as UserInvestSettings);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, path);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return () => {};
  }
}

/**
 * Save micro-invest settings in Firestore
 */
export async function saveInvestSettings(userId: string, settings: UserInvestSettings): Promise<void> {
  const path = `users/${userId}/investSettings/current`;
  try {
    const docRef = doc(db, 'users', userId, 'investSettings', 'current');
    await setDoc(docRef, {
      ...settings,
      userId,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Subscribe to academy learn progress
 */
export function subscribeToLearnProgress(
  userId: string,
  onUpdate: (progress: UserLearnProgress) => void
): Unsubscribe {
  const path = `users/${userId}/learnProgress/current`;
  try {
    const docRef = doc(db, 'users', userId, 'learnProgress', 'current');
    return onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          onUpdate(snapshot.data() as UserLearnProgress);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, path);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return () => {};
  }
}

/**
 * Save academy learn progress
 */
export async function saveLearnProgress(userId: string, completedLessonIds: string[]): Promise<void> {
  const path = `users/${userId}/learnProgress/current`;
  try {
    const docRef = doc(db, 'users', userId, 'learnProgress', 'current');
    await setDoc(docRef, {
      userId,
      completedLessonIds,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}
