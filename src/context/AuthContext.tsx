"use client";

import { createContext, useContext, useState, useEffect } from "react";
import {
  OAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { User } from "@/types/types";
import { AuthContextState } from "@/types/contextTypes";

const AuthContext = createContext<AuthContextState | null>(null);

export const useAuthContext = (): AuthContextState => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "useAuthContext must be used within an AuthContextProvider"
    );
  }
  return context;
};

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const [authUser, setAuthUser] = useState<User | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      setAuthUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        let userData = {
          id: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        };

        if (userSnap.exists()) {
          userData = { ...userData, ...userSnap.data() };
        } else {
          await setDoc(userRef, userData);
        }

        setAuthUser(userData);
        localStorage.setItem("userData", JSON.stringify(userData));
      } else {
        setAuthUser(null);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const userData = {
        id: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      };

      await saveUserToFirestore(userData);
    } catch (error) {
      console.error("Google sign-in error:", error);
    }
  };

  const signInWithApple = async () => {
    const provider = new OAuthProvider("apple.com");
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const userData = {
        id: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      };

      await saveUserToFirestore(userData);
    } catch (error) {
      console.error("Apple sign-in error:", error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setAuthUser(null);
      localStorage.removeItem("userData");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const saveUserToFirestore = async (user: User) => {
    const userRef = doc(db, "users", user.id);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        ...user,
        createdAt: new Date(),
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        authUser,
        setAuthUser,
        signInWithGoogle,
        signInWithApple,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
