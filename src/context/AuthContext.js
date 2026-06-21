import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token  = localStorage.getItem('smarthire_token');
    const stored = localStorage.getItem('smarthire_user');
    if (token && stored) {
      try { setUser(JSON.parse(stored)); }
      catch { logout(); }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token, user: u } = res.data;
    localStorage.setItem('smarthire_token', token);
    localStorage.setItem('smarthire_user',  JSON.stringify(u));
    setUser(u);
    return u;
  };

  const register = async (data) => {
    const res = await api.post('/auth/register', data);
    const { token, user: u } = res.data;
    localStorage.setItem('smarthire_token', token);
    localStorage.setItem('smarthire_user',  JSON.stringify(u));
    setUser(u);
    return u;
  };

  const logout = () => {
    localStorage.removeItem('smarthire_token');
    localStorage.removeItem('smarthire_user');
    setUser(null);
  };

  const updateUser = (data) => {
    const merged = { ...user, ...data };
    localStorage.setItem('smarthire_user', JSON.stringify(merged));
    setUser(merged);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);