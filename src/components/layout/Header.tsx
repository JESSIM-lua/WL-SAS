import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, LogOut, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Header: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated, user, isAdmin, logout } = useAuth();
  
  return (
    <header className="bg-background-dark shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold flex items-center">
            <Shield className="text-primary mr-2" />
            <span>RP Whitelist</span>
          </Link>
          
          <nav className="flex items-center gap-4">
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
                  <User size={16} className="mr-2 text-primary" />
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