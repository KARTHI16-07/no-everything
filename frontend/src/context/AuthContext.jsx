import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ne_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('ne_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If token exists, verify session
    if (token) {
      authApi.getMe()
        .then((res) => {
          if (res.data && res.data.data) {
            setUser(prev => ({
              ...prev,
              ...res.data.data
            }));
          }
        })
        .catch(() => {
          logout();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (credentials) => {
    const res = await authApi.login(credentials);
    const authData = res.data.data;
    setToken(authData.token);
    setUser(authData);
    localStorage.setItem('ne_token', authData.token);
    localStorage.setItem('ne_user', JSON.stringify(authData));
    return authData;
  };

  const register = async (userData) => {
    const res = await authApi.register(userData);
    const authData = res.data.data;
    setToken(authData.token);
    setUser(authData);
    localStorage.setItem('ne_token', authData.token);
    localStorage.setItem('ne_user', JSON.stringify(authData));
    return authData;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('ne_token');
    localStorage.removeItem('ne_user');
  };

  const updateUser = (updatedFields) => {
    setUser(prev => {
      const merged = { ...prev, ...updatedFields };
      localStorage.setItem('ne_user', JSON.stringify(merged));
      return merged;
    });
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated: !!token,
      loading,
      login,
      register,
      logout,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
