import { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, collection, addDoc, query, orderBy, limit, getDocs, where } from 'firebase/firestore';
import { auth, db } from '../firebase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

// Helper to convert numeric age to age group string
function getAgeGroup(age) {
  if (!age) return 'unknown';
  if (age <= 8) return '6-8';
  if (age <= 11) return '9-11';
  if (age <= 14) return '12-14';
  return '15+';
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign up with email/password
  async function signUp(email, password) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  }

  // Sign in with email/password
  async function signIn(email, password) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  }

  // Sign out
  async function signOut() {
    await firebaseSignOut(auth);
    setUserData(null);
  }

  // Save user profile after account setup
  async function saveUserProfile(profileData) {
    if (!currentUser) return;

    const userRef = doc(db, 'users', currentUser.uid);
    const now = new Date().toISOString();
    const newUserData = {
      ...profileData,
      balance: 100,
      portfolio: {},
      createdAt: now,
      lastPlayed: now
    };

    await setDoc(userRef, newUserData, { merge: true });
    setUserData(newUserData);

    // Create initial leaderboard entry so user appears immediately
    const leaderboardRef = doc(db, 'leaderboard', currentUser.uid);
    await setDoc(leaderboardRef, {
      userId: currentUser.uid,
      name: profileData.name || 'Anonymous',
      ageGroup: getAgeGroup(profileData.age),
      experience: profileData.experience || 'beginner',
      netWorth: 100,
      portfolioValue: 0,
      profitPercent: 0,
      lastUpdated: now,
      createdAt: now
    });
  }

  // Load user data from Firestore (accepts optional user param for use in onAuthStateChanged)
  async function loadUserData(user = null) {
    const targetUser = user || currentUser;
    if (!targetUser) return null;

    try {
      const userRef = doc(db, 'users', targetUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        setUserData(data);
        return data;
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
    return null;
  }

  // Save game state (balance, portfolio) - also updates local state
  async function saveGameState(balance, portfolio) {
    if (!currentUser) return;

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        balance,
        portfolio,
        lastPlayed: new Date().toISOString()
      });

      // Update local state so it persists across sessions
      setUserData(prev => ({
        ...prev,
        balance,
        portfolio
      }));
    } catch (error) {
      console.error('Error saving game state:', error);
    }
  }

  // Save a transaction
  async function saveTransaction(type, stockName, emoji, price, profit = null) {
    if (!currentUser) return;

    try {
      const transactionsRef = collection(db, 'users', currentUser.uid, 'transactions');
      await addDoc(transactionsRef, {
        type,
        stockName,
        emoji,
        price,
        profit,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error saving transaction:', error);
    }
  }

  // Load transaction history
  async function loadTransactionHistory() {
    if (!currentUser) return [];

    try {
      const transactionsRef = collection(db, 'users', currentUser.uid, 'transactions');
      const q = query(transactionsRef, orderBy('timestamp', 'desc'), limit(50));
      const snapshot = await getDocs(q);

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error loading transaction history:', error);
      return [];
    }
  }

  // Update leaderboard entry for current user
  async function updateLeaderboardEntry(netWorth, portfolioValue) {
    if (!currentUser || !userData) return;

    try {
      const startingBalance = 100;
      const profitPercent = ((netWorth - startingBalance) / startingBalance) * 100;

      const leaderboardRef = doc(db, 'leaderboard', currentUser.uid);
      await setDoc(leaderboardRef, {
        userId: currentUser.uid,
        name: userData.name || 'Anonymous',
        ageGroup: getAgeGroup(userData.age),
        experience: userData.experience || 'beginner',
        netWorth: netWorth,
        portfolioValue: portfolioValue,
        profitPercent: profitPercent,
        lastUpdated: new Date().toISOString(),
        createdAt: userData.createdAt || new Date().toISOString()
      }, { merge: true });
    } catch (error) {
      console.error('Error updating leaderboard:', error);
    }
  }

  // Get leaderboard with filters
  async function getLeaderboard(timeFilter = 'all', ageGroup = null, experience = null) {
    try {
      const leaderboardRef = collection(db, 'leaderboard');
      let constraints = [orderBy('netWorth', 'desc'), limit(50)];

      // Time-based filtering
      if (timeFilter === 'daily') {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        constraints.unshift(where('lastUpdated', '>=', today.toISOString()));
      } else if (timeFilter === 'weekly') {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        constraints.unshift(where('lastUpdated', '>=', weekAgo.toISOString()));
      }

      const q = query(leaderboardRef, ...constraints);
      const snapshot = await getDocs(q);

      let results = snapshot.docs.map(doc => ({
        userId: doc.id,
        ...doc.data()
      }));

      // Client-side filtering for age group and experience
      // (Firestore doesn't allow multiple inequality filters)
      if (ageGroup) {
        results = results.filter(r => r.ageGroup === ageGroup);
      }
      if (experience) {
        results = results.filter(r => r.experience === experience);
      }

      return results;
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      return [];
    }
  }

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Pass user directly to avoid closure issues
        await loadUserData(user);
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userData,
    loading,
    signUp,
    signIn,
    signOut,
    saveUserProfile,
    loadUserData,
    saveGameState,
    saveTransaction,
    loadTransactionHistory,
    updateLeaderboardEntry,
    getLeaderboard
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
