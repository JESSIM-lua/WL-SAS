import React from 'react';
import { Users, Clock, CheckCircle, XCircle } from 'lucide-react';
import ApplicationsList from './ApplicationsList';

const AdminDashboard: React.FC = () => {
  // In a real app, these would be fetched from the API
  const stats = {
    total: 24,
    pending: 8,
    approved: 12,
    rejected: 4
  };

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
      
      <ApplicationsList />
    </div>
  );
};

export default AdminDashboard;