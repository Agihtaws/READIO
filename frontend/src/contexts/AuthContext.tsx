'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  GoogleAuthProvider, 
  signInWithPopup,
  User as FirebaseUser
} from 'firebase/auth';
import { auth } from '@/lib/firebase'
import { usageTracker } from '@/lib/usageTracker';

// Define types for our user
interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

// Define the shape of our context
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<any>;
  signup: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  signInWithGoogle: () => Promise<any>;
}

// Create context with proper type
const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => null,
  signup: async () => null,
  logout: async () => {},
  signInWithGoogle: async () => null
});

export const useAuth = () => useContext(AuthContext);

interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: FirebaseUser | null) => {
      if (user) {
        setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signup = async (email: string, password: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    // Reset usage count when user signs up
    await usageTracker.resetUsage();
    return result;
  };

  const login = async (email: string, password: string) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    // Reset usage count when user logs in
    await usageTracker.resetUsage();
    return result;
  };

  const logout = async () => {
    setUser(null);
    await signOut(auth);
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    // Reset usage count when user logs in with Google
    await usageTracker.resetUsage();
    return result;
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, signInWithGoogle }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
