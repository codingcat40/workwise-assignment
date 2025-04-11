import React, { createContext, useState, useContext } from 'react';
import { login as apiLogin, register as apiRegister } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const login = async (username, password) => {
    try {
      const response = await apiLogin(username, password);
      setUser({ id: response.userId, username });
      setError(null);
      return response;
    } catch (error) {
      setError('Login failed. Please check your credentials.');
      throw error;
    }
  };

  const register = async (username, password) => {
    try {
      const response = await apiRegister(username, password);
      setUser({ id: response.userId, username });
      setError(null);
      return response;
    } catch (error) {
      setError('Registration failed. Please try again.');
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ user, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 