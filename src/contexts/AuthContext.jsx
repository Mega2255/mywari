import { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateEmail,
  updatePassword,
} from 'firebase/auth';
import { ref, set, get, update } from 'firebase/database';
import { auth, db } from '../firebase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const register = async (email, password, name, phone) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await set(ref(db, `users/${cred.user.uid}`), {
      uid: cred.user.uid,
      email,
      name,
      phone,
      role: 'user',
      createdAt: Date.now(),
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6b8e23&color=fff`,
    });
    return cred;
  };

  const login = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => signOut(auth);

  const createAgent = async (email, password, name, phone, flwSubaccount) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await set(ref(db, `users/${cred.user.uid}`), {
      uid: cred.user.uid,
      email,
      name,
      phone,
      role: 'agent',
      flwSubaccount: flwSubaccount || '',
      createdAt: Date.now(),
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=5C3D2E&color=fff`,
    });
    return cred;
  };

  const updateAgentCredentials = async (uid, newEmail, newPassword) => {
    // Admin updates via Firebase Admin SDK (backend) — here we update DB record
    await update(ref(db, `users/${uid}`), { email: newEmail });
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const snap = await get(ref(db, `users/${user.uid}`));
        if (snap.exists()) {
          const data = snap.val();
          setUserData(data);
          setUserRole(data.role);
        }
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
        setUserRole(null);
        setUserData(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const value = {
    currentUser,
    userRole,
    userData,
    loading,
    authLoading: loading,
    register,
    login,
    logout,
    createAgent,
    updateAgentCredentials,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};