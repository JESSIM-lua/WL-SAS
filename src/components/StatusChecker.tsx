import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2, CheckCircle, XCircle, Clock } from 'lucide-react';
import { checkApplicationStatus } from '../utils/api';
import { ApplicationStatus } from '../types';

type FormData = {
  discordId: string;
};

const StatusChecker: React.FC = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [status, setStatus] = useState<ApplicationStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasChecked, setHasChecked] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setIsChecking(true);
    setError(null);
    
    try {
      const response = await checkApplicationStatus(data.discordId);
      
      if (response.success && response.data) {
        setStatus(response.data.status as ApplicationStatus);
        setHasChecked(true);
      } else {
        setError(response.error || 'No application found with this Discord ID.');
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsChecking(false);
    }
  };

  const renderStatusMessage = () => {
    if (!hasChecked) return null;
    
    switch (status) {
      case ApplicationStatus.PENDING:
        return (
          <div className="bg-warning/10 rounded-md p-4 flex items-center gap-3 animate-fade-in">
            <Clock size={24} className="text-warning" />
            <div>
              <h3 className="font-medium">Application Pending</h3>
              <p className="text-sm text-text-muted">Your application is still under review. Please check back later.</p>
            </div>
          </div>
        );
      case ApplicationStatus.APPROVED:
        return (
          <div className="bg-success/10 rounded-md p-4 flex items-center gap-3 animate-fade-in">
            <CheckCircle size={24} className="text-success" />
            <div>
              <h3 className="font-medium">Application Approved!</h3>
              <p className="text-sm text-text-muted">Congratulations! Your Discord role has been assigned.</p>
            </div>
          </div>
        );
      case ApplicationStatus.REJECTED:
        return (
          <div className="bg-error/10 rounded-md p-4 flex items-center gap-3 animate-fade-in">
            <XCircle size={24} className="text-error" />
            <div>
              <h3 className="font-medium">Application Rejected</h3>
              <p className="text-sm text-text-muted">Unfortunately, your application was not approved. Please contact an admin for more details.</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="card animate-fade-in max-w-lg w-full mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Check Application Status</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mb-4">
        {error && (
          <div className="bg-error/10 text-error p-4 rounded-md animate-fade-in">
            {error}
          </div>
        )}
        
        <div className="form-group">
          <label htmlFor="discordId" className="form-label">Discord ID</label>
          <input
            id="discordId"
            type="text"
            className="input"
            placeholder="123456789012345678"
            {...register('discordId', {
              required: 'Discord ID is required',
              pattern: {
                value: /^\d{17,19}$/,
                message: 'Please provide a valid Discord ID (17-19 digits)',
              },
            })}
          />
          {errors.discordId && <p className="error-text">{errors.discordId.message}</p>}
        </div>
        
        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={isChecking}
        >
          {isChecking ? (
            <>
              <Loader2 size={18} className="animate-spin mr-2" />
              Checking...
            </>
          ) : (
            'Check Status'
          )}
        </button>
      </form>
      
      {renderStatusMessage()}
    </div>
  );
};

export default StatusChecker;