import React, { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export const AuthContext = createContext(null);

import { auth } from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { authService } from '../services/authService';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();
        localStorage.setItem('sahayak_token', token);
        localStorage.setItem('sahayak_user', JSON.stringify({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL
        }));
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL
        });
      } else {
        localStorage.removeItem('sahayak_token');
        localStorage.removeItem('sahayak_user');
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (credentials) => {
    // This is now handled by authService in the component, 
    // but we keep it here for context compatibility if needed.
    return await authService.doLogin(credentials);
  };

  const logout = async () => {
    try {
      await authService.doLogout();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
