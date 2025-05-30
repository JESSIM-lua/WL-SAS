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

  useEffect(() => {
    // Check if user is logged in on component mount
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const userStr = localStorage.getItem('auth_user');
        
        if (token && userStr) {
          const user = JSON.parse(userStr) as Admin;
          setAuthState({
            isAuthenticated: true,
            user,
            isAdmin: true, // In a real app, we'd validate this with the server
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

    checkAuth();
  }, []);

  const login = (token: string, user: Admin) => {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(user));
    
    setAuthState({
      isAuthenticated: true,
      user,
      isAdmin: true, // In a real app, we'd validate this with the server
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