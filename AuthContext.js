import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]   = useState(null);
  const [token, setToken] = useState(null);
  const [ready, setReady] = useState(false);

  // Rehydrate from localStorage on mount
  useEffect(() => {
    try {
      const savedToken = localStorage.getItem('pp_token');
      const savedUser  = localStorage.getItem('pp_user');
      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      }
    } catch (_) {}
    setReady(true);
  }, []);

  function saveAuth(userData, accessToken) {
    setUser(userData);
    setToken(accessToken);
    localStorage.setItem('pp_token', accessToken);
    localStorage.setItem('pp_user', JSON.stringify(userData));
  }

  function clearAuth() {
    setUser(null);
    setToken(null);
    localStorage.removeItem('pp_token');
    localStorage.removeItem('pp_user');
  }

  return (
    <AuthContext.Provider value={{ user, token, ready, saveAuth, clearAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
