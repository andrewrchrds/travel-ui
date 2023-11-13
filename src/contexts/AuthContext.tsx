import React, { createContext, useState, useContext } from 'react';

type User = {
  name: string;
  email: string;
};

type AuthContextType = {
  currentUser: User | null;
  token: string | null;
  setToken: (token: string) => void;
  setCurrentUser: (user: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>(null!);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // getters and setters
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [token, _setToken] = useState<string | null>(localStorage.getItem('ACCESS_TOKEN')); // default value comes from local storage

  const setToken = (token: string | null) => {
    _setToken(token);
    if (token) {
      localStorage.setItem('ACCESS_TOKEN', token); // keep the token in local storage
    } else {
      localStorage.removeItem('ACCESS_TOKEN'); // remove token if there is none
    }
  }

  const logout = () => {
    setCurrentUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, token, setToken, setCurrentUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
