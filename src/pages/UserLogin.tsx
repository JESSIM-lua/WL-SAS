import React, { useEffect } from 'react';
import { LogIn } from 'lucide-react';

const UserLogin: React.FC = () => {
  const handleUserLogin = () => {
    window.location.href = 'http://localhost:3001/api/auth/discord-user';
  };

  useEffect(() => {
    const discordId = localStorage.getItem('discord_id');
    if (discordId) {
      window.location.href = '/form'; // Redirige vers le formulaire si déjà connecté
    }
  }, []);

  return (
    <div className="card max-w-md w-full mx-auto text-center animate-fade-in mt-20">
      <h2 className="text-2xl font-bold mb-6">Connexion Joueur</h2>

      <p className="mb-6 text-text-muted">
        Connecte-toi avec ton compte Discord pour accéder au formulaire de whitelist RP.
      </p>

      <button
        onClick={handleUserLogin}
        className="btn btn-primary w-full flex items-center justify-center gap-2"
      >
        <LogIn size={18} />
        Connexion via Discord
      </button>
    </div>
  );
};

export default UserLogin;
