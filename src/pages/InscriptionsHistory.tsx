import React, { useEffect, useState } from 'react';

interface Session {
  id: number;
  date: string;
  heure: string;
  maxPlayers: number;
  isActive: boolean;
  participants: { discordId: string }[];
}

const InscriptionsHistory: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [error, setError] = useState('');

  const fetchSessions = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/inscriptions');
      const data = await res.json();
      if (Array.isArray(data)) {
        setSessions(data);
      } else {
        setError(data.error || 'Erreur de chargement des sessions');
      }
    } catch (e) {
      setError('Erreur réseau');
    }
  };

  const toggleActive = async (id: number, current: boolean) => {
    try {
      const res = await fetch(`http://localhost:3001/api/inscriptions/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !current }),
      });

      const data = await res.json();

      if (data.success) {
        setSessions(prev =>
          prev.map(session =>
            session.id === id ? { ...session, isActive: !current } : session
          )
        );
      } else {
        alert(data.error || 'Erreur de mise à jour du statut');
      }
    } catch {
      alert('Erreur réseau lors de la mise à jour');
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  return (
    <div className="card max-w-5xl mx-auto p-6 space-y-4">
      <h2 className="text-xl font-bold">Historique des sessions</h2>
      {error && <p className="text-red-600">{error}</p>}

      <table className="w-full table-auto border mt-4 text-sm">
        <thead>
          <tr className="text-left border-b bg-gray-100">
            <th className="p-2">Date</th>
            <th className="p-2">Heure</th>
            <th className="p-2">Inscrits</th>
            <th className="p-2">Participants (Discord ID)</th>
            <th className="p-2">Statut</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((session) => (
            <tr key={session.id} className="border-b align-top">
              <td className="p-2">{session.date}</td>
              <td className="p-2">{session.heure}</td>
              <td className="p-2">
                {session.participants?.length || 0} / {session.maxPlayers}
              </td>
              <td className="p-2 whitespace-pre-wrap">
                {session.participants && session.participants.length > 0
                  ? session.participants.map(p => `• ${p.discordId}`).join('\n')
                  : 'Aucun inscrit'}
              </td>
              <td className="p-2">
                {session.isActive ? (
                  <span className="text-green-600 font-medium">Active</span>
                ) : (
                  <span className="text-gray-500">Inactive</span>
                )}
              </td>
              <td className="p-2">
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() => toggleActive(session.id, session.isActive)}
                >
                  {session.isActive ? 'Désactiver' : 'Activer'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InscriptionsHistory;
