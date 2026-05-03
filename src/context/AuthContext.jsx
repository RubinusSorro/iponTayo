import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updatePassword,
  updateEmail,
  GoogleAuthProvider,
  signInWithPopup,
  deleteUser,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("iponTayoTheme") || "ivory";
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  async function signup(data) {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );

    return userCredential.user;
  }

  async function login(email, password) {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    return userCredential.user;
  }

  async function logout() {
    await signOut(auth);
  }

  function changeTheme(newTheme) {
    setTheme(newTheme);
    localStorage.setItem("iponTayoTheme", newTheme);
  }

  async function updateProfile(updatedData) {
    if (updatedData.email && updatedData.email !== user.email) {
      await updateEmail(user, updatedData.email);
    }

    return true;
  }

  async function changePassword(oldPassword, newPassword) {
    try {
      await updatePassword(user, newPassword);

      return {
        success: true,
        message: "Password changed successfully.",
      };
    } catch {
      return {
        success: false,
        message: "Please log in again before changing password.",
      };
    }
  }

  async function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    return result.user;
  }

  async function deleteAccount() {
    if (!user) return;

    await deleteUser(user);
  }

  async function forgotPassword(email) {
    await sendPasswordResetEmail(auth, email);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        signup,
        login,
        logout,
        updateProfile,
        changePassword,
        theme,
        changeTheme,
        loading,
        loginWithGoogle,
        deleteAccount,
        forgotPassword,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}