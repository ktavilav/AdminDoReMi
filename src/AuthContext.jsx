// AuthContext.js
import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(!!localStorage.getItem('token'));
  const [token, setToken] = useState(localStorage.getItem('token'));

  const login = () => {
    setIsLogged(true);
    setToken(localStorage.getItem('token'));
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setIsLogged(false);
  };

  return (
    <AuthContext.Provider value={{ token, isLogged, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
