"use client";

import { createContext, useState, useContext, useEffect } from "react";
import {
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

const UserContext = createContext();

export const useUserContext = () => useContext(UserContext);

export const UserContextProvider = ({ children }) => {
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        if (user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
          setIsSuperAdmin(true);
        }
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUser({
            ...user,
            ...userDoc.data(),
            userType: isSuperAdmin ? "superadmin" : "admin",
          });
        } else {
          setUser(user);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (inputEmail, inputPassword) => {
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

    if (inputEmail === adminEmail && inputPassword === adminPassword) {
      setIsSuperAdmin(true);
      setIsAdmin(false);
      localStorage.setItem("userType", JSON.stringify("superadmin"));
    } else {
      setIsAdmin(true);
      setIsSuperAdmin(false);
      localStorage.setItem("userType", JSON.stringify("schooladmin"));
    }

    try {
      const result = await signInWithEmailAndPassword(
        auth,
        inputEmail,
        inputPassword
      );

      localStorage.setItem("userID", JSON.stringify(result?.user?.uid));

      return result;
    } catch (error) {
      console.log(error.message);
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);

      const dbName = "firebase-heartbeat-database";
      const deleteRequest = indexedDB.deleteDatabase(dbName);

      deleteRequest.onsuccess = function () {
        console.log("Firebase Heartbeat database deleted successfully.");
      };

      deleteRequest.onerror = function () {
        console.error("Error deleting Firebase Heartbeat database.");
      };

      deleteRequest.onblocked = function () {
        console.warn(
          "Firebase Heartbeat database deletion blocked. Try reloading the page."
        );
      };

      localStorage.removeItem("userType");
      localStorage.removeItem("userID");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        isAdmin,
        isSuperAdmin,
        login,
        user,
        logOut,
        loading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
