import { useEffect, useState } from 'react';

interface AuthUser {
  id: number;
  discordId: string;
  username: string;
  avatarUrl: string;
  discordRoles: string[];
}

export const useAuthUser = () => {
  const [userAcc, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');

    if (storedToken && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch (e) {
        console.error('Erreur parsing user:', e);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    setUser(null);
    setToken(null);
  };

  return { userAcc, token, isAuthenticated: !!userAcc, logout };
};
