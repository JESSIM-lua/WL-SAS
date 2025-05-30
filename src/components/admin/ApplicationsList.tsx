import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Loader2, ExternalLink, Filter } from 'lucide-react';
import { getApplications, updateApplicationStatus } from '../../utils/api';
import { ApplicationStatus, Player } from '../../types';

const ApplicationsList: React.FC = () => {
  const [applications, setApplications] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [filter, setFilter] = useState<ApplicationStatus | 'all'>('all');
  
  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await getApplications();
      if (response.success && response.data) {
        setApplications(response.data);
      } else {
        setError(response.error || 'Failed to fetch applications');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchApplications();
  }, []);
  
  const handleStatusUpdate = async (id: number, status: 'approved' | 'rejected') => {
    if (!id) return;
    
    setActionLoading(id);
    try {
      const response = await updateApplicationStatus(id, status);
      if (response.success && response.data) {
        // Update the local state with the updated application
        setApplications(applications.map(app => 
          app.id === id ? { ...app, status: status as ApplicationStatus } : app
        ));
      } else {
        setError(response.error || `Failed to ${status} application`);
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setActionLoading(null);
    }
  };
  
  const filteredApplications = applications.filter(app => 
    filter === 'all' || app.status === filter
  );
  
  const getStatusBadge = (status: ApplicationStatus) => {
    const baseClasses = "px-2 py-1 rounded text-xs font-medium";
    switch (status) {
      case ApplicationStatus.PENDING:
        return <span className={`${baseClasses} bg-warning/20 text-warning`}>Pending</span>;
      case ApplicationStatus.APPROVED:
        return <span className={`${baseClasses} bg-success/20 text-success`}>Approved</span>;
      case ApplicationStatus.REJECTED:
        return <span className={`${baseClasses} bg-error/20 text-error`}>Rejected</span>;
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 size={40} className="animate-spin text-primary" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-error/10 text-error p-4 rounded-md">
        {error}
      </div>
    );
  }
  
  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Whitelist Applications</h2>
        
        <div className="flex items-center gap-2">
          <Filter size={16} />
          <select
            className="input py-1"
            value={filter}
            onChange={(e) => setFilter(e.target.value as ApplicationStatus | 'all')}
          >
            <option value="all">All</option>
            <option value={ApplicationStatus.PENDING}>Pending</option>
            <option value={ApplicationStatus.APPROVED}>Approved</option>
            <option value={ApplicationStatus.REJECTED}>Rejected</option>
          </select>
        </div>
      </div>
      
      {filteredApplications.length === 0 ? (
        <div className="bg-background-light rounded-lg p-8 text-center">
          <p className="text-lg text-text-muted">No applications found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((application) => (
            <div 
              key={application.id} 
              className="bg-background-light rounded-lg p-4 hover:bg-opacity-80 transition-colors duration-200"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-lg">
                    {application.rpName} {application.rpSurname}
                  </h3>
                  <p className="text-text-muted">Discord ID: {application.discordId}</p>
                  <div className="mt-2">{getStatusBadge(application.status)}</div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <a 
                    href={application.backgroundLink} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn btn-secondary py-1 text-sm"
                  >
                    <ExternalLink size={14} className="mr-1" />
                    Background
                  </a>
                  
                  {application.status === ApplicationStatus.PENDING && (
                    <div className="flex gap-2 mt-2">
                      <button
                        className="btn btn-success py-1 text-sm"
                        onClick={() => handleStatusUpdate(application.id!, 'approved')}
                        disabled={actionLoading === application.id}
                      >
                        {actionLoading === application.id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <CheckCircle size={14} className="mr-1" />
                        )}
                        Approve
                      </button>
                      
                      <button
                        className="btn btn-danger py-1 text-sm"
                        onClick={() => handleStatusUpdate(application.id!, 'rejected')}
                        disabled={actionLoading === application.id}
                      >
                        {actionLoading === application.id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <XCircle size={14} className="mr-1" />
                        )}
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicationsList;