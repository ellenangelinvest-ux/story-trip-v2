// Authentication Context Provider
// Manages Firebase auth state throughout the app

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from 'firebase/auth';
import {
  onAuthChange,
  signInWithGoogle,
  signInWithFacebook,
  signInWithEmail,
  createAccountWithEmail,
  logOut,
  saveUserProfile,
  getUserProfile,
  isFirebaseConfigured,
  UserProfileData
} from './firebase';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfileData | null;
  loading: boolean;
  isConfigured: boolean;
  error: string | null;
  signInGoogle: () => Promise<{ success: boolean; error: string | null }>;
  signInFacebook: () => Promise<{ success: boolean; error: string | null }>;
  signInEmailPassword: (email: string, password: string, isNewUser?: boolean) => Promise<{ success: boolean; error: string | null }>;
  signOutUser: () => Promise<void>;
  updateProfile: (data: Partial<UserProfileData>) => Promise<{ success: boolean; error: string | null }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isConfigured = isFirebaseConfigured();

  // Listen to auth state changes
  useEffect(() => {
    if (!isConfigured) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthChange(async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        // Fetch user profile from Firestore
        const { profile } = await getUserProfile(firebaseUser.uid);
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [isConfigured]);

  const signInGoogle = async () => {
    if (!isConfigured) {
      return { success: false, error: 'Firebase not configured' };
    }

    setError(null);
    const { user: firebaseUser, error: authError } = await signInWithGoogle();

    if (authError) {
      setError(authError);
      return { success: false, error: authError };
    }

    if (firebaseUser) {
      // Create/update user profile with Google info
      await saveUserProfile(firebaseUser.uid, {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        name: firebaseUser.displayName || ''
      });
    }

    return { success: true, error: null };
  };

  const signInFacebook = async () => {
    if (!isConfigured) {
      return { success: false, error: 'Firebase not configured' };
    }

    setError(null);
    const { user: firebaseUser, error: authError } = await signInWithFacebook();

    if (authError) {
      setError(authError);
      return { success: false, error: authError };
    }

    if (firebaseUser) {
      // Create/update user profile with Facebook info
      await saveUserProfile(firebaseUser.uid, {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        name: firebaseUser.displayName || ''
      });
    }

    return { success: true, error: null };
  };

  const signInEmailPassword = async (email: string, password: string, isNewUser = false) => {
    if (!isConfigured) {
      return { success: false, error: 'Firebase not configured' };
    }

    setError(null);
    let result;

    if (isNewUser) {
      result = await createAccountWithEmail(email, password);
    } else {
      result = await signInWithEmail(email, password);
    }

    if (result.error) {
      setError(result.error);
      return { success: false, error: result.error };
    }

    if (result.user) {
      // Create/update user profile
      await saveUserProfile(result.user.uid, {
        uid: result.user.uid,
        email: result.user.email,
        name: result.user.email?.split('@')[0] || ''
      });
    }

    return { success: true, error: null };
  };

  const signOutUser = async () => {
    await logOut();
    setUser(null);
    setUserProfile(null);
  };

  const updateProfile = async (data: Partial<UserProfileData>) => {
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const result = await saveUserProfile(user.uid, data);

    if (result.success) {
      // Refresh profile
      const { profile } = await getUserProfile(user.uid);
      setUserProfile(profile);
    }

    return result;
  };

  const refreshProfile = async () => {
    if (user) {
      const { profile } = await getUserProfile(user.uid);
      setUserProfile(profile);
    }
  };

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    isConfigured,
    error,
    signInGoogle,
    signInFacebook,
    signInEmailPassword,
    signOutUser,
    updateProfile,
    refreshProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
