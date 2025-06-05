import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateInscriptionPage: React.FC = () => {
  const [date, setDate] = useState('');
  const [heure, setHeure] = useState('');
  const [maxPlayers, setMaxPlayers] = useState(10);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    const discordId = localStorage.getItem('discord_id');

    if (!discordId) {
      setError('Identifiant Discord manquant.');
      return;
    }

    try {
      const res = await fetch('http://localhost:3001/api/inscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date,
          heure,
          maxPlayers,
          createdBy: discordId,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erreur lors de la création.');
      }

      setSuccess(true);
      setTimeout(() => navigate('/admin/inscriptions'), 1500);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="card max-w-lg mx-auto p-6 space-y-6">
      <h2 className="text-xl font-bold text-center">Créer une Session d’Inscription</h2>

      {success && <p className="text-green-600 font-semibold">✅ Session créée avec succès.</p>}
      {error && <p className="text-red-600 font-medium">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Date</label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="input w-full"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Heure</label>
          <input
            type="time"
            value={heure}
            onChange={e => setHeure(e.target.value)}
            className="input w-full"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Nombre maximum de joueurs</label>
          <input
            type="number"
            value={maxPlayers}
            onChange={e => setMaxPlayers(parseInt(e.target.value))}
            className="input w-full"
            min={1}
            required
          />
        </div>

        <button className="btn btn-primary w-full" type="submit">
          Créer la session
        </button>
      </form>
    </div>
  );
};

export default CreateInscriptionPage;
