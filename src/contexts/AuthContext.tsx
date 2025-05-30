import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthState, Admin } from '../types';

interface AuthContextType extends AuthState {
  login: (token: string, user: Admin) => void;
  logout: () => void;
}

const defaultAuthState: AuthState = {
  isAuthenticated: false,
  user: null,
  isAdmin: false,
  loading: true,
  error: null,
};

const AuthContext = createContext<AuthContextType>({
  ...defaultAuthState,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(defaultAuthState);

  const checkAuth = () => {
    try {
      const token = localStorage.getItem('auth_token');
      const userStr = localStorage.getItem('auth_user');

      if (token && userStr) {
        const user = JSON.parse(userStr) as Admin;
        setAuthState({
          isAuthenticated: true,
          user,
          isAdmin: true, // Ici on suppose qu’un admin est connecté
          loading: false,
          error: null,
        });
      } else {
        setAuthState({
          ...defaultAuthState,
          loading: false,
        });
      }
    } catch (error) {
      setAuthState({
        ...defaultAuthState,
        loading: false,
        error: 'Failed to authenticate',
      });
    }
  };

  // 👉 Un seul useEffect pour la détection initiale + lecture URL
  useEffect(() => {
    const url = new URL(window.location.href);
    const token = url.searchParams.get('token');
    const userStr = url.searchParams.get('user');

    if (token && userStr) {
      login(token, JSON.parse(decodeURIComponent(userStr)));
      window.history.replaceState({}, '', '/admin'); // Nettoie l’URL
    } else {
      checkAuth(); // Auth classique via localStorage
    }
  }, []);

  useEffect(() => {
  const url = new URL(window.location.href);
  const token = url.searchParams.get('token');
  const discordId = url.searchParams.get('discordId');
  const username = url.searchParams.get('username');

  if (token && discordId) {
    localStorage.setItem('user_token', token);
    localStorage.setItem('discord_id', discordId);
    localStorage.setItem('username', username || '');
    window.history.replaceState({}, '', '/form'); // Nettoie l’URL
  }
}, []);


  const login = (token: string, user: Admin) => {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(user));

    setAuthState({
      isAuthenticated: true,
      user,
      isAdmin: true,
      loading: false,
      error: null,
    });
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');

    setAuthState({
      ...defaultAuthState,
      loading: false,
    });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
