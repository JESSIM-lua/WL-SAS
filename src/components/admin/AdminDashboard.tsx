import React, { useEffect, useState } from 'react';
import { Users, Clock, CheckCircle, XCircle, ClipboardList, History } from 'lucide-react';
import ApplicationsList from './ApplicationsList';
import { useNavigate } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/players/stats');
        const data = await res.json();
        if (data.success) {
          setStats(data.data);
        }
      } catch (err) {
        console.error('Erreur récupération stats :', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card bg-background-light flex items-center gap-3">
          <div className="p-3 rounded-full bg-primary/10">
            <Users size={24} className="text-primary" />
          </div>
          <div>
            <p className="text-text-muted text-sm">Total Applications</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
        </div>

        <div className="card bg-background-light flex items-center gap-3">
          <div className="p-3 rounded-full bg-warning/10">
            <Clock size={24} className="text-warning" />
          </div>
          <div>
            <p className="text-text-muted text-sm">Pending</p>
            <p className="text-2xl font-bold">{stats.pending}</p>
          </div>
        </div>

        <div className="card bg-background-light flex items-center gap-3">
          <div className="p-3 rounded-full bg-success/10">
            <CheckCircle size={24} className="text-success" />
          </div>
          <div>
            <p className="text-text-muted text-sm">Approved</p>
            <p className="text-2xl font-bold">{stats.approved}</p>
          </div>
        </div>

        <div className="card bg-background-light flex items-center gap-3">
          <div className="p-3 rounded-full bg-error/10">
            <XCircle size={24} className="text-error" />
          </div>
          <div>
            <p className="text-text-muted text-sm">Rejected</p>
            <p className="text-2xl font-bold">{stats.rejected}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mt-4">
        <button
          className="btn btn-primary flex items-center gap-2"
          onClick={() => navigate('/admin/inscriptions')}
        >
          <ClipboardList size={16} />
          Créer une session
        </button>

        <button
          className="btn btn-secondary flex items-center gap-2"
          onClick={() => navigate('/inscription/history')}
        >
          <History size={16} />
          Historique des sessions
        </button>
      </div>

      <ApplicationsList />
    </div>
  );
};

export default AdminDashboard;
