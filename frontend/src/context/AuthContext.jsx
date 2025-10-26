// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useMemo } from "react";

// Create context
const AuthContext = createContext(null);

// Reusable localStorage hook
const useLocalStorage = (key, initialValue) => {
  const [state, setState] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch (error) {
      console.error(`[useLocalStorage] Failed to read key "${key}":`, error);
      return initialValue;
    }
  });

  const setLocalStorage = (value) => {
    try {
      setState(value);
      if (value === null || value === undefined) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error(`[useLocalStorage] Failed to set key "${key}":`, error);
    }
  };

  return [state, setLocalStorage];
};

// Context Provider
export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useLocalStorage("USER_ID", null);
  const [token, setToken] = useLocalStorage("ACCESS_TOKEN", null);
  const [refreshToken, setRefreshToken] = useLocalStorage("REFRESH_TOKEN", null);

  // Derived state: user is authenticated if a token exists
  const isAuthenticated = useMemo(() => !!token, [token]);

  // Combine into a stable value (memoized to prevent unnecessary re-renders)
  const value = useMemo(
    () => ({
      userId,
      token,
      refreshToken,
      setUserId,
      setToken,
      setRefreshToken,
      isAuthenticated,
      logout: () => {
        setUserId(null);
        setToken(null);
        setRefreshToken(null);
      },
    }),
    [userId, token, refreshToken, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>;
};

// Custom Hook
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
