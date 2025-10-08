// "use client";
// import { useContext, createContext, useState, useEffect } from "react";
// import {
//   signInWithPopup,
//   signOut,
//   onAuthStateChanged,
//   GoogleAuthProvider,
//   setPersistence,
//   browserLocalPersistence,
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
// } from "firebase/auth";
// import { auth, db } from "@/lib/firebase";
// import { doc, setDoc, getDoc } from "firebase/firestore";

// // Create Auth Context
// const AuthContext = createContext();

// export const useAuth = () => useContext(AuthContext);

// export const AuthContextProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   console.log(user, "uuussserr");

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       if (currentUser) {
//         const userDoc = await getDoc(doc(db, "users", currentUser?.uid));
//         if (userDoc.exists()) {
//           setUser({
//             ...currentUser,
//             ...userDoc.data(),
//           });
//         } else {
//           setUser(currentUser);
//         }
//       } else {
//         setUser(null);
//       }
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

//   // Google Sign-In
//   const googleSignIn = async () => {
//     const provider = new GoogleAuthProvider();
//     try {
//       await setPersistence(auth, browserLocalPersistence);
//       const result = await signInWithPopup(auth, provider);

//       // Save user data to Firestore if not exists
//       const userDocRef = doc(db, "users", result.user.uid);
//       const userDoc = await getDoc(userDocRef);

//       if (!userDoc.exists()) {
//         await setDoc(userDocRef, {
//           displayName: result.user.displayName,
//           email: result.user.email,
//           createdAt: new Date().toISOString(),
//         });
//       }
//     } catch (error) {
//       console.error("Google Sign-In Error:", error);
//     }
//   };

//   // Email/Password Signup
//   const signup = async (email, password, displayName) => {
//     const userCredential = await createUserWithEmailAndPassword(
//       auth,
//       email,
//       password
//     );

//     // Save user data in Firestore
//     await setDoc(doc(db, "users", userCredential.user.uid), {
//       displayName,
//       email,
//       createdAt: new Date().toISOString(),
//     });

//     return userCredential;
//   };

//   // Email/Password Login
//   const login = async (email, password) => {
//     return signInWithEmailAndPassword(auth, email, password);
//   };

//   // Logout
//   const logout = async () => {
//     try {
//       await signOut(auth);
//       setUser(null);
//     } catch (error) {
//       console.error("Logout Error:", error);
//     }
//   };

//   if (loading) {
//     return <p>Loading...</p>;
//   }

//   return (
//     <AuthContext.Provider value={{ user, googleSignIn, signup, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
