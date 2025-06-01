import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, LogOut, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Header: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated, user, isAdmin, logout } = useAuth();
  const [isConnected, setIsConnected] = React.useState(false);
  const username = localStorage.getItem('username') || 'Guest';

  useEffect(() => {
    const checkConnection = () => {
      const discordId = localStorage.getItem('discord_id');
      setIsConnected(!!discordId);
    };
    checkConnection();
  }, []);

  const disconnectUser = () => {
    localStorage.removeItem('discord_id');
    setIsConnected(false);
    window.location.href = '/';
  };

  return (
    <header className="bg-background-light border-b border-gray-100">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold flex items-center gap-2 text-primary">
            <Shield className="h-6 w-6" />
            <span>Whitelist SAS</span>
          </Link>
          
          <nav className="flex items-center gap-6">
            {isConnected && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-gray-50 rounded-full px-4 py-2">
                  <User size={18} className="text-primary" />
                  <span className="text-sm font-medium">{username}</span>
                </div>
                <button
                  onClick={disconnectUser}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-50 transition-colors"
                  title="Disconnect"
                >
                  <LogOut size={18} />
                </button>
              </div>
            )}

            <div className="flex items-center gap-3">
              <Link 
                to="/" 
                className={`px-4 py-2 rounded-lg transition-colors ${
                  location.pathname === '/' 
                    ? 'bg-primary/10 text-primary font-medium' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Home
              </Link>
              
              {isAdmin && (
                <Link 
                  to="/admin" 
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    location.pathname === '/admin'
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Admin
                </Link>
              )}
              
              {!isAuthenticated && location.pathname !== '/admin' && (
                <Link
                  to="/admin"
                  className="btn btn-primary"
                >
                  Admin Login
                </Link>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;