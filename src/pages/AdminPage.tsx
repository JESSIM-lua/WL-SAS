import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import AdminDashboard from '../components/admin/AdminDashboard';
import DiscordLogin from '../components/auth/DiscordLogin';
import { Loader2 } from 'lucide-react';

const AdminPage: React.FC = () => {
  const { isAuthenticated, isAdmin, loading, error } = useAuth();
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="text-center">
          <Loader2 size={40} className="animate-spin mx-auto text-primary mb-4" />
          <p className="text-lg text-text-muted">Loading authentication...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="bg-error/10 text-error p-6 rounded-lg max-w-md mx-auto text-center">
          <p className="font-medium">{error}</p>
          <p className="mt-2 text-sm">Please try again or contact support.</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16">
        <DiscordLogin />
      </div>
    );
  }
  
  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="card max-w-md mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-text-muted mb-6">
            You don't have admin privileges. Only users with admin roles on the Discord server can access this page.
          </p>
          <button className="btn btn-primary" onClick={() => window.location.href = '/'}>
            Return to Home
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <AdminDashboard />
    </div>
  );
};

export default AdminPage;