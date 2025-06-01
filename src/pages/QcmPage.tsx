import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthUser } from '../components/hooks/useAuth';

interface Choice {
  label: string;
  isCorrect?: boolean;
}

interface Question {
  id: number;
  question: string;
  choices: Choice[];
  points: number;
}

interface Response {
  questionId: number;
  selectedLabel: string;
}

const QcmPage: React.FC = () => {
  const { userAcc } = useAuthUser();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [locked, setLocked] = useState(false);
  const [remaining, setRemaining] = useState<number>(3);

  // Vérifie si connecté
  useEffect(() => {
    const token = localStorage.getItem('discord_id');
    if (!token && window.location.pathname !== '/user-login') {
      window.location.href = '/user-login';
    }
  }, []);

  // Charge les questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/qcm/questions');
        const data = await res.json();
        setQuestions(data);
      } catch {
        setError("❌ Impossible de charger les questions.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

// Vérifie les tentatives
useEffect(() => {
  const checkAttempts = async () => {
    if (!discordId) return;

    try {
      const res = await fetch(`http://localhost:3001/api/qcm/attempts/${discordId}`);
      const data = await res.json();

      if (data.passed) {
        // ✅ Rediriger directement
        navigate('/form');
        return;
      }

      
      if (data.passed) {
        localStorage.setItem('qcm_passed', 'true');
        return;
      }


    

      if (data.attempts >= 3) {
        setLocked(true);
        setError('❌ Tu as atteint le nombre maximal de tentatives.');
      } else {
        setRemaining(3 - data.attempts);
      }
    } catch {
      setError("❌ Erreur lors de la vérification des tentatives.");
    }


    const passedQCM = localStorage.getItem('qcm_passed')
    if (passedQCM != 'true') {
      navigate('/qcm');
      return;
    }
  };

  checkAttempts();
}, [navigate]);

  const discordId = localStorage.getItem('discord_id');
  // Vérifie les tentatives
  useEffect(() => {
    const checkAttempts = async () => {
      if (!discordId) return;

      try {
        const res = await fetch(`http://localhost:3001/api/qcm/attempts/${discordId}`);
        const data = await res.json();

        if (data.passed) {
          navigate('/form');
        } else if (data.attempts >= 3) {
          setLocked(true);
          setError('❌ Tu as atteint le nombre maximal de tentatives.');
        } else {
          setRemaining(3 - data.attempts);
        }
      } catch {
        setError("❌ Erreur lors de la vérification des tentatives.");
      }
    };

    checkAttempts();
  }, [userAcc, navigate]);

  const handleSelect = (questionId: number, label: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: label }));
  };

  const handleSubmit = async () => {
    setError('');
console.log("Discord ID:", discordId);

    if (!discordId) return;
console.log("Discord ID:", discordId);

    const allAnswered = questions.length > 0 && questions.every(q => answers[q.id]);
    if (!allAnswered) {
      setError("⚠️ Tu dois répondre à toutes les questions.");
      return;
    }

    const responses: Response[] = Object.entries(answers).map(([id, selectedLabel]) => ({
      questionId: parseInt(id),
      selectedLabel,
    }));

    try {
      const res = await fetch('http://localhost:3001/api/qcm/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ discordId: discordId, responses }),
      });

      const result = await res.json();

      if (res.status === 403) {
        setError(result.error || "❌ Nombre maximal de tentatives atteint.");
        setLocked(true);
        return;
      }

      if (result.passed) {
        navigate('/form');
      } else {
        const tentativesRestantes = 3 - result.attempts;
        setRemaining(tentativesRestantes);
        setError(`❌ Score insuffisant (${result.score}/20). Il te reste ${tentativesRestantes} essai(s).`);
        if (tentativesRestantes <= 0) setLocked(true);
      }
    } catch {
      setError("❌ Une erreur est survenue lors de la soumission.");
    }
  };

  if (loading) return <p className="text-center">Chargement...</p>;

  return (
    <div className="card max-w-3xl mx-auto p-6 space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-center">QCM de Validation</h2>

      {error && <div className="text-red-500 font-medium">{error}</div>}

      {!locked && (
        <>
          {questions.map(q => (
            <div key={q.id} className="space-y-2">
              <p className="font-semibold">{q.question}</p>
              {q.choices.map(choice => (
                <label key={choice.label} className="block">
                  <input
                    type="radio"
                    name={`question-${q.id}`}
                    value={choice.label}
                    checked={answers[q.id] === choice.label}
                    onChange={() => handleSelect(q.id, choice.label)}
                    className="mr-2"
                  />
                  {choice.label}
                </label>
              ))}
            </div>
          ))}

          <button
            className="btn btn-primary w-full"
            onClick={handleSubmit}
          >
            Soumettre le QCM
          </button>

          <p className="text-sm text-center text-gray-500">
            Tentatives restantes : {remaining}
          </p>
        </>
      )}
    </div>
  );
};

export default QcmPage;
