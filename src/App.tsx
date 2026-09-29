import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { SignUpPage } from './components/SignUpPage';
import { LoginPage } from './components/LoginPage';
import { DashboardView } from './components/DashboardView';
import { AccountsView } from './components/AccountsView';
import { TransactionsView } from './components/TransactionsView';
import { InvestView } from './components/InvestView';
import { ConvertView } from './components/ConvertView';
import { CalculateView } from './components/CalculateView';
import { LearnView } from './components/LearnView';
import { AddTransactionModal } from './components/AddTransactionModal';
import { AddAccountModal } from './components/AddAccountModal';
import { ProfileEditView } from './components/ProfileEditView';
import { Footer } from './components/Footer';
import { Account, Transaction, CashFlowPoint, CategorySpend, User } from './types';
import { auth, onAuthStateChanged } from './lib/firebase';
import { updateProfile } from 'firebase/auth';
import { authService, mapFirebaseUser } from './services/authService';
import { 
  subscribeToAccounts, 
  subscribeToTransactions, 
  subscribeToInvestSettings, 
  subscribeToLearnProgress,
  subscribeToUserProfile,
  saveAccount,
  saveTransaction,
  saveInvestSettings,
  saveLearnProgress,
  updateUserProfile,
  UserInvestSettings
} from './lib/firestoreService';

export default function App() {
  // Routes: 'landing' (default) | 'signup' | 'login' | 'dashboard' | 'accounts' | 'transactions' | 'invest' | 'convert' | 'calculate' | 'learn'
  const [currentRoute, setCurrentRoute] = useState<string>('landing');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState<boolean>(false);

  // Active Authenticated User session from Firebase
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authInitialized, setAuthInitialized] = useState<boolean>(false);
  const [authNotice, setAuthNotice] = useState<string>('');

  // Real-time Cloud Firestore State isolated per authenticated user
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [investSettings, setInvestSettings] = useState<UserInvestSettings | undefined>(undefined);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);

  // Listen to Firebase Authentication lifecycle and attach Firestore subscriptions
  useEffect(() => {
    let unsubAccounts: (() => void) | undefined;
    let unsubTransactions: (() => void) | undefined;
    let unsubInvest: (() => void) | undefined;
    let unsubLearn: (() => void) | undefined;
    let unsubProfile: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      // Clean up any previous subscriptions
      if (unsubAccounts) unsubAccounts();
      if (unsubTransactions) unsubTransactions();
      if (unsubInvest) unsubInvest();
      if (unsubLearn) unsubLearn();
      if (unsubProfile) unsubProfile();

      if (firebaseUser) {
        const userObj = mapFirebaseUser(firebaseUser);
        setCurrentUser(userObj);

        // Bind real-time Firestore listeners for user profile & data
        unsubProfile = subscribeToUserProfile(firebaseUser.uid, (profileData) => {
          setCurrentUser((prev) => (prev ? { ...prev, ...profileData } : mapFirebaseUser(firebaseUser)));
        });

        unsubAccounts = subscribeToAccounts(firebaseUser.uid, (syncedAccounts) => {
          setAccounts(syncedAccounts);
        });

        unsubTransactions = subscribeToTransactions(firebaseUser.uid, (syncedTxs) => {
          setTransactions(syncedTxs);
        });

        unsubInvest = subscribeToInvestSettings(firebaseUser.uid, (syncedSettings) => {
          setInvestSettings(syncedSettings);
        });

        unsubLearn = subscribeToLearnProgress(firebaseUser.uid, (syncedProgress) => {
          setCompletedLessonIds(syncedProgress.completedLessonIds || []);
        });

        // If an active session is detected while on auth pages, redirect to dashboard
        setCurrentRoute((prev) => (prev === 'login' || prev === 'signup' ? 'dashboard' : prev));
      } else {
        // Logged out - reset all user-specific data to empty state
        setCurrentUser(null);
        setAccounts([]);
        setTransactions([]);
        setInvestSettings(undefined);
        setCompletedLessonIds([]);

        // Protect Dashboard and Profile from unauthenticated users
        setCurrentRoute((prev) => (prev === 'dashboard' || prev === 'profile' ? 'login' : prev));
      }
      setAuthInitialized(true);
    });

    return () => {
      unsubscribeAuth();
      if (unsubAccounts) unsubAccounts();
      if (unsubTransactions) unsubTransactions();
      if (unsubInvest) unsubInvest();
      if (unsubLearn) unsubLearn();
      if (unsubProfile) unsubProfile();
    };
  }, []);

  // Route Protection & Auto-Redirect Guard
  useEffect(() => {
    if (!authInitialized) return;

    if (currentUser) {
      // If user already has an active authenticated Firebase session, redirect to Dashboard instead of login/signup
      if (currentRoute === 'login' || currentRoute === 'signup') {
        setCurrentRoute('dashboard');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      // Protect the Dashboard and Profile so unauthenticated users cannot access it
      if (currentRoute === 'dashboard' || currentRoute === 'profile') {
        setAuthNotice('Please log in or sign up to access your Finova account.');
        setCurrentRoute('login');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [currentUser, currentRoute, authInitialized]);

  // Dynamically compute cash flow history from actual user transactions
  const cashFlowHistory = useMemo<CashFlowPoint[]>(() => {
    if (transactions.length === 0) return [];
    const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
    return months.map((month) => {
      let inflow = 0;
      let outflow = 0;
      transactions.forEach((tx) => {
        try {
          const txMonth = new Date(tx.date).toLocaleString('en-US', { month: 'short' });
          if (txMonth === month) {
            if (tx.type === 'inflow') inflow += tx.amount;
            else outflow += tx.amount;
          }
        } catch {
          // ignore malformed date
        }
      });
      return {
        month,
        inflow,
        outflow,
        netReserve: inflow - outflow,
      };
    });
  }, [transactions]);

  // Dynamically compute category spending breakdown from actual user outflow transactions
  const categorySpends = useMemo<CategorySpend[]>(() => {
    const map: Record<string, number> = {};
    transactions
      .filter((t) => t.type === 'outflow')
      .forEach((t) => {
        map[t.category] = (map[t.category] || 0) + t.amount;
      });

    const entries = Object.entries(map);
    if (entries.length === 0) return [];
    const total = entries.reduce((sum, [, amt]) => sum + amt, 0);
    const colors = ['#659B5E', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#10B981', '#06B6D4'];

    return entries.map(([name, amount], idx) => ({
      name,
      amount,
      share: total > 0 ? `${Math.round((amount / total) * 100)}%` : '0%',
      color: colors[idx % colors.length],
    }));
  }, [transactions]);

  // Navigation handlers
  const handleOpenAuth = (mode: 'login' | 'signup') => {
    // If a user already has an active authenticated session, automatically redirect to Dashboard
    if (currentUser) {
      setCurrentRoute('dashboard');
    } else {
      setAuthNotice('');
      setCurrentRoute(mode);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateHome = () => {
    setAuthNotice('');
    setCurrentRoute('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateTab = (tab: string) => {
    // Protect the Dashboard and Profile so unauthenticated users cannot access it
    if ((tab === 'dashboard' || tab === 'profile') && !currentUser) {
      setAuthNotice('Please log in or sign up to access your Finova account.');
      setCurrentRoute('login');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setAuthNotice('');
    setCurrentRoute(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Profile Update Handler
  const handleUpdateProfile = async (updatedData: Partial<User>) => {
    if (currentUser?.id) {
      // Persist to Firestore
      await updateUserProfile(currentUser.id, updatedData);

      // Sync Firebase Auth object if name or avatar was updated
      if (auth.currentUser) {
        try {
          const authUpdates: { displayName?: string; photoURL?: string } = {};
          if (updatedData.name) authUpdates.displayName = updatedData.name;
          if (updatedData.avatar !== undefined) authUpdates.photoURL = updatedData.avatar || '';
          if (Object.keys(authUpdates).length > 0) {
            await updateProfile(auth.currentUser, authUpdates);
          }
        } catch (authErr) {
          console.warn('Could not sync to Firebase auth user object:', authErr);
        }
      }
    }

    // Immediately update local state
    setCurrentUser((prev) => (prev ? { ...prev, ...updatedData } : null));
  };

  // Auth Success Handlers
  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    setAuthNotice('');
    setCurrentRoute('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = async () => {
    try {
      await authService.logOut();
    } catch (e) {
      console.error('Logout error in App:', e);
    }
    setCurrentUser(null);
    setAccounts([]);
    setTransactions([]);
    setAuthNotice('');
    setCurrentRoute('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler to add a new account in Firestore
  const handleAddAccount = async (newAccData: Omit<Account, 'id' | 'lastSynced'>) => {
    const accountId = `acc_${Date.now()}`;
    const newAcc: Account = {
      ...newAccData,
      id: accountId,
      lastSynced: 'Just now',
    };

    if (currentUser?.id) {
      await saveAccount(currentUser.id, newAcc);
    } else {
      setAccounts((prev) => [...prev, newAcc]);
    }
  };

  // Handler to transfer funds between accounts in Firestore
  const handleTransferFunds = async (fromId: string, toId: string, amount: number) => {
    const fromAccount = accounts.find((a) => a.id === fromId);
    const toAccount = accounts.find((a) => a.id === toId);

    if (fromAccount && toAccount) {
      const updatedFrom: Account = {
        ...fromAccount,
        balance: fromAccount.balance - amount,
        availableBalance: fromAccount.availableBalance - amount,
        lastSynced: 'Just now',
      };

      const updatedTo: Account = {
        ...toAccount,
        balance: toAccount.balance + amount,
        availableBalance: toAccount.availableBalance + amount,
        lastSynced: 'Just now',
      };

      if (currentUser?.id) {
        await Promise.all([
          saveAccount(currentUser.id, updatedFrom),
          saveAccount(currentUser.id, updatedTo),
        ]);
      } else {
        setAccounts((prev) =>
          prev.map((acc) => {
            if (acc.id === fromId) return updatedFrom;
            if (acc.id === toId) return updatedTo;
            return acc;
          })
        );
      }
    }
  };

  // Handler to add a new transaction in Firestore
  const handleAddTransaction = async (newTxData: Omit<Transaction, 'id'>) => {
    const txId = `tx_${Date.now()}`;
    const newTx: Transaction = {
      ...newTxData,
      id: txId,
    };

    if (currentUser?.id) {
      await saveTransaction(currentUser.id, newTx);

      // Also adjust account balance in Firestore if linked
      const matchedAcc = accounts.find((a) => a.id === newTx.accountId);
      if (matchedAcc) {
        const delta = newTx.type === 'inflow' ? newTx.amount : -newTx.amount;
        const updatedAcc: Account = {
          ...matchedAcc,
          balance: matchedAcc.balance + delta,
          availableBalance: matchedAcc.availableBalance + delta,
          lastSynced: 'Just now',
        };
        await saveAccount(currentUser.id, updatedAcc);
      }
    } else {
      setTransactions((prev) => [newTx, ...prev]);
      setAccounts((prev) =>
        prev.map((acc) => {
          if (acc.id === newTx.accountId) {
            const delta = newTx.type === 'inflow' ? newTx.amount : -newTx.amount;
            return {
              ...acc,
              balance: acc.balance + delta,
              availableBalance: acc.availableBalance + delta,
              lastSynced: 'Just now',
            };
          }
          return acc;
        })
      );
    }
  };

  // Handler to persist user's micro-invest settings
  const handleSaveInvestSettings = async (settings: UserInvestSettings) => {
    setInvestSettings(settings);
    if (currentUser?.id) {
      await saveInvestSettings(currentUser.id, settings);
    }
  };

  // Handler to persist user's academy learn progress
  const handleToggleLessonCompleted = async (lessonId: string) => {
    const nextList = completedLessonIds.includes(lessonId)
      ? completedLessonIds.filter((id) => id !== lessonId)
      : [...completedLessonIds, lessonId];

    setCompletedLessonIds(nextList);
    if (currentUser?.id) {
      await saveLearnProgress(currentUser.id, nextList);
    }
  };

  // Dedicated full-screen auth pages (Wireframe 2)
  if (currentRoute === 'signup') {
    return (
      <SignUpPage
        onSuccessSignUp={handleAuthSuccess}
        onNavigateLogin={() => {
          setAuthNotice('');
          setCurrentRoute('login');
        }}
        onNavigateHome={handleNavigateHome}
        onNavigateTab={handleNavigateTab}
      />
    );
  }

  if (currentRoute === 'login') {
    return (
      <LoginPage
        onSuccessLogin={handleAuthSuccess}
        onNavigateSignUp={() => {
          setAuthNotice('');
          setCurrentRoute('signup');
        }}
        onNavigateHome={handleNavigateHome}
        onNavigateTab={handleNavigateTab}
        authNotice={authNotice}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1E293B] font-inter flex flex-col">
      {/* 
        Full-width horizontal green navbar (#659B5E)
        Logo on left with tree icon, center links: Dashboard, Invest, Convert, Calculate, Learn
        Right: Log In, white rounded Sign Up
      */}
      <Navbar
        currentTab={currentRoute}
        setCurrentTab={handleNavigateTab}
        onNavigateHome={handleNavigateHome}
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
      />

      {/* Main Content Router */}
      {currentRoute === 'landing' ? (
        /* Wireframe 1: Landing Page (Hero, Smart Tools 2x2, Testimonials, Navy Footer) */
        <LandingPage
          onOpenAuth={handleOpenAuth}
          onNavigateTab={handleNavigateTab}
        />
      ) : (
        /* Multipage Desktop Views with Global Footer */
        <>
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {currentRoute === 'dashboard' && (
              <DashboardView
                accounts={accounts}
                transactions={transactions}
                cashFlowHistory={cashFlowHistory}
                categorySpends={categorySpends}
                currentUser={currentUser}
                onNavigateTab={handleNavigateTab}
                onOpenAddModal={() => setIsAddModalOpen(true)}
                onOpenAddAccountModal={() => setIsAddAccountModalOpen(true)}
              />
            )}

            {currentRoute === 'accounts' && (
              <AccountsView
                accounts={accounts}
                onTransferFunds={handleTransferFunds}
                onOpenAddAccountModal={() => setIsAddAccountModalOpen(true)}
              />
            )}

            {currentRoute === 'transactions' && (
              <TransactionsView
                transactions={transactions}
                accounts={accounts}
                onOpenAddModal={() => setIsAddModalOpen(true)}
              />
            )}

            {currentRoute === 'invest' && (
              <InvestView 
                investSettings={investSettings}
                onSaveSettings={handleSaveInvestSettings}
              />
            )}

            {currentRoute === 'convert' && (
              <ConvertView accounts={accounts} />
            )}

            {currentRoute === 'calculate' && (
              <CalculateView />
            )}

            {currentRoute === 'learn' && (
              <LearnView 
                completedLessonIds={completedLessonIds}
                onToggleLessonCompleted={handleToggleLessonCompleted}
              />
            )}

            {currentRoute === 'profile' && (
              <ProfileEditView
                currentUser={currentUser}
                onUpdateProfile={handleUpdateProfile}
                onNavigateTab={handleNavigateTab}
              />
            )}
          </main>

          {/* Consistent Dark Navy Footer across all multipage views */}
          <Footer onNavigateTab={handleNavigateTab} />
        </>
      )}

      {/* Record Entry Modal for Dashboard & Ledger */}
      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        accounts={accounts}
        onAddTransaction={handleAddTransaction}
      />

      {/* Connect Account Modal */}
      <AddAccountModal
        isOpen={isAddAccountModalOpen}
        onClose={() => setIsAddAccountModalOpen(false)}
        onAddAccount={handleAddAccount}
      />
    </div>
  );
}
