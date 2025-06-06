import React, { useEffect, useState } from 'react';

interface Participant {
  discordId: string;
}

interface Inscription {
  id: number;
  date: string;
  heure: string;
  maxPlayers: number;
  isActive: boolean;
  participants: Participant[];
}

const InscriptionPage: React.FC = () => {
  const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
  const [error, setError] = useState('');
  const discordId = localStorage.getItem('discord_id');

  useEffect(() => {
    const fetchInscriptions = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/inscriptions');
        const data = await res.json();
        setInscriptions(data);
      } catch {
        setError('❌ Erreur chargement des inscriptions');
      }
    };

    fetchInscriptions();
  }, []);

  const handleJoin = async (inscriptionId: number) => {
    if (!discordId) return alert('Non connecté');

    try {
      const res = await fetch(`http://localhost:3001/api/inscriptions/${inscriptionId}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ discordId }),
      });

      const result = await res.json();

      if (res.ok) {
        alert('✅ Inscription confirmée !');
        window.location.reload();
      } else {
        alert(`❌ ${result.error}`);
      }
    } catch {
      alert('❌ Une erreur est survenue');
    }
  };

  const handleLeave = async (inscriptionId: number) => {
    if (!discordId) return alert('Non connecté');

    try {
      const res = await fetch(`http://localhost:3001/api/inscriptions/${inscriptionId}/leave`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ discordId }),
      });

      const result = await res.json();

      if (res.ok) {
        alert('❎ Désinscription confirmée !');
        window.location.reload();
      } else {
        alert(`❌ ${result.error}`);
      }
    } catch {
      alert('❌ Une erreur est survenue');
    }
  };

  const activeSessions = inscriptions.filter(s => s.isActive);

  // Vérifie si l’utilisateur est déjà inscrit à une autre session active
  const inscritAilleurs = activeSessions.some(s =>
    s.participants.some(p => p.discordId === discordId)
  );

  return (
    <div className="max-w-2xl mx-auto card p-6 space-y-4">
      <h2 className="text-xl font-bold text-center">Inscriptions ouvertes</h2>
      {error && <div className="text-red-500">{error}</div>}

      {activeSessions.map(session => {
        const spotsLeft = session.maxPlayers - session.participants.length;
        const isParticipant = session.participants.some(p => p.discordId === discordId);

        return (
          <div key={session.id} className="p-4 border rounded space-y-2">
            <p>📅 <strong>Date :</strong> {session.date}</p>
            <p>🕐 <strong>Heure :</strong> {session.heure}</p>
            <p>👥 <strong>Places :</strong> {session.participants.length} / {session.maxPlayers}</p>

            {!isParticipant ? (
              <button
                onClick={() => handleJoin(session.id)}
                disabled={spotsLeft <= 0 || inscritAilleurs}
                className={`btn w-full ${spotsLeft <= 0 || inscritAilleurs ? 'btn-disabled' : 'btn-primary'}`}
              >
                {spotsLeft <= 0
                  ? 'Complet'
                  : inscritAilleurs
                    ? 'Déjà inscrit à une session active'
                    : 'S’inscrire'}
              </button>
            ) : (
              <button
                onClick={() => handleLeave(session.id)}
                className="btn btn-warning w-full"
              >
                Se désinscrire
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default InscriptionPage;
