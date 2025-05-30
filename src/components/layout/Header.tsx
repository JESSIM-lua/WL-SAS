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
      if (discordId) {
        setIsConnected(true);
      } else {
        setIsConnected(false);
      }
    };

    checkConnection();
  }
, []);

const disconnectUser = () => {
    localStorage.removeItem('discord_id');
    setIsConnected(false);
    window.location.href = '/'; // Redirige vers la page d'accueil après déconnexion
  }



  
  return (
    <header className="bg-background-dark shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold flex items-center">
            <Shield className="text-primary mr-2" />
            <span>Whitelist SAS</span>
          </Link>
          
          <nav className="flex items-center gap-4">

            {isConnected && (
              <div className="flex items-center gap-2">
              <div className="flex items-center bg-background-light rounded-full px-3 py-1">
                  <User size={16} className="mr-2 text-primary" />
                  <span className="text-sm">{username || "-"}</span>
                  
                </div>
                <button
                onClick={disconnectUser}
                className="px-3 py-2 rounded transition-colors hover:bg-background-light text-text"
                title="Disconnect User"
              > 
                <LogOut size={18} />
              </button>
          
              </div>
            )
              }

            <Link 
              to="/" 
              className={`px-3 py-2 rounded transition-colors hover:bg-background-light ${
                location.pathname === '/' ? 'text-primary' : 'text-text'
              }`}
            >
              Home
            </Link>
            
            {isAdmin && (
              <Link 
                to="/admin" 
                className={`px-3 py-2 rounded transition-colors hover:bg-background-light ${
                  location.pathname === '/admin' ? 'text-primary' : 'text-text'
                }`}
              >
                Admin
              </Link>
            )}
            
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-background-light rounded-full px-3 py-1">
                  <Shield  size={16} className="mr-2 text-primary" />
                  <span className="text-sm">{user?.username || 'Admin'}</span>
                </div>
                
                <button 
                  onClick={logout}
                  className="p-2 text-text-muted hover:text-text rounded-full hover:bg-background-light transition-colors"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              location.pathname !== '/admin' && (
                <Link
                  to="/admin"
                  className="px-3 py-2 rounded transition-colors hover:bg-background-light text-text"
                >
                  Admin Login
                </Link>
              )
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;