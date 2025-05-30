import React from 'react';
import { LogIn } from 'lucide-react';

const DiscordLogin: React.FC = () => {
  const handleLoginClick = () => {
    // In a real application, this would redirect to Discord OAuth
    window.location.href = '/api/auth/discord';
  };

  return (
    <div className="card max-w-md w-full mx-auto text-center animate-fade-in">
      <h2 className="text-2xl font-bold mb-6">Admin Login</h2>
      
      <p className="mb-6 text-text-muted">
        Login with your Discord account to access the admin panel. Only users with admin roles
        on the Discord server will be granted access.
      </p>
      
      <button
        onClick={handleLoginClick}
        className="btn btn-primary w-full flex items-center justify-center gap-2"
      >
        <LogIn size={18} />
        Login with Discord
      </button>
    </div>
  );
};

export default DiscordLogin;