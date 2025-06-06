import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { checkApplicationStatus, submitApplication } from '../utils/api';
import { Player } from '../types';
import { useNavigate } from 'react-router-dom';

type FormData = Omit<Player, 'status' | 'id' | 'createdAt' | 'updatedAt' | 'rejectionReason' | 'reapplied'>;

const ApplicationForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [error, setError] = useState('');
  const [locked, setLocked] = useState(false);
  const [status, setStatus] = useState<'none' | 'pending' | 'approved' | 'rejected'>('none');
  const [rejectionReason, setRejectionReason] = useState('');
  const [reapplied, setReapplied] = useState(false);

  const discordId = localStorage.getItem('discord_id');
  const navigate = useNavigate();

  useEffect(() => {
    if (!discordId) {
      window.location.href = '/user-login';
    }
  }, [discordId]);

  // Vérifie le QCM
  useEffect(() => {
    const checkAttempts = async () => {
      if (!discordId) return;

      try {
        const res = await fetch(`http://localhost:3001/api/qcm/attempts/${discordId}`);
        const data = await res.json();

        localStorage.setItem('qcm_passed', data.passed ? 'true' : 'false');
      } catch {
        setError("❌ Erreur lors de la vérification des tentatives.");
      }

      const passedQCM = localStorage.getItem('qcm_passed');
      if (passedQCM !== 'true') {
        navigate('/qcm');
      }
    };

    checkAttempts();
  }, [navigate, discordId]);

  // Vérifie le statut de la candidature
  useEffect(() => {
    const checkStatus = async () => {
      if (!discordId) return;

      try {
        const response = await checkApplicationStatus(discordId);

        if (response.success && response.data) {
          const data = response.data;
          setStatus(data.status);
          setReapplied(data.reapplied ?? false);
          setRejectionReason(data.rejectionReason || '');

          if (data.status === 'approved') {
            navigate('/inscription');
          } else if (data.status === 'pending') {
            setLocked(true);
          } else if (data.status === 'rejected') {
            if (data.reapplied) {
              setLocked(true);
            } else {
              setLocked(false); // peut repostuler
            }
          }
        } else {
          setStatus('none'); // pas encore de candidature
        }
      } catch {
        setStatus('none');
      }
    };

    checkStatus();
  }, [discordId, navigate]);

  useEffect(() => {
    if (status === 'approved') {
      navigate('/inscription');
    }
  }, [status, navigate]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await submitApplication(data);

      if (response.success) {
        setSubmitStatus('success');
        reset();
        setLocked(true);
      } else {
        setSubmitStatus('error');
        setErrorMessage(response.error || 'An error occurred while submitting your application.');
      }
    } catch {
      setSubmitStatus('error');
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card animate-fade-in max-w-lg w-full mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Whitelist Application</h2>

      {locked && (
        <div className="bg-error/10 text-error p-4 rounded-md flex items-start gap-3 mb-4 animate-fade-in">
          <AlertCircle size={20} />
          <div>
            {status === 'pending' && <p>⏳ Votre candidature est en attente de validation.</p>}
            {status === 'approved' && <p>✅ Vous avez déjà été accepté. Redirection...</p>}
            {status === 'rejected' && reapplied && (
              <>
                <p>❌ Votre candidature a été rejetée et vous avez déjà utilisé votre seconde chance.</p>
                {rejectionReason && (
                  <p className="italic text-sm mt-1">Motif : {rejectionReason}</p>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {submitStatus === 'success' && (
        <div className="bg-success/10 text-success p-4 rounded-md flex items-center gap-3 animate-fade-in">
          <CheckCircle size={20} />
          <p>Your application has been submitted successfully! We'll review it shortly.</p>
        </div>
      )}

      {!locked && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {submitStatus === 'error' && (
            <div className="bg-error/10 text-error p-4 rounded-md flex items-center gap-3 animate-fade-in">
              <AlertCircle size={20} />
              <p>{errorMessage}</p>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="rpName" className="form-label">RP First Name</label>
            <input
              id="rpName"
              type="text"
              className="input"
              placeholder="John"
              {...register('rpName', {
                required: 'RP first name is required',
                minLength: { value: 2, message: 'Name must be at least 2 characters' },
              })}
            />
            {errors.rpName && <p className="error-text">{errors.rpName.message}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="rpSurname" className="form-label">RP Last Name</label>
            <input
              id="rpSurname"
              type="text"
              className="input"
              placeholder="Doe"
              {...register('rpSurname', {
                required: 'RP last name is required',
                minLength: { value: 2, message: 'Last name must be at least 2 characters' },
              })}
            />
            {errors.rpSurname && <p className="error-text">{errors.rpSurname.message}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="backgroundLink" className="form-label">Background GDoc Link</label>
            <input
              id="backgroundLink"
              type="url"
              className="input"
              placeholder="https://docs.google.com/document/d/..."
              {...register('backgroundLink', {
                required: 'Background link is required',
                pattern: {
                  value: /^https:\/\/docs\.google\.com\/document\/d\/.+/i,
                  message: 'Please provide a valid Google Docs link',
                },
              })}
            />
            {errors.backgroundLink && <p className="error-text">{errors.backgroundLink.message}</p>}
          </div>

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
              value={discordId ?? ''}
              readOnly
            />
            {errors.discordId && <p className="error-text">{errors.discordId.message}</p>}
          </div>

          <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin mr-2" />
                Submitting...
              </>
            ) : (
              'Submit Application'
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default ApplicationForm;
