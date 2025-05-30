import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Choice {
  label: string;
  isCorrect?: boolean; // pas utilisé ici, juste pour le typage
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
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [attempts, setAttempts] = useState<number>(0);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadQuestions = async () => {
    const res = await fetch('http://localhost:3001/api/qcm/questions');
      const data = await res.json();
      setQuestions(data);
    };

    loadQuestions();

    const attemptCount = parseInt(localStorage.getItem('qcm_attempts') || '0');
    if (attemptCount >= 3) setError("Tu as atteint le nombre maximum d'essais.");
    setAttempts(attemptCount);
  }, []);

  const handleSelect = (questionId: number, label: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: label }));
  };

  const handleSubmit = async () => {
    if (attempts >= 3) return;

    const responses: Response[] = Object.entries(answers).map(([id, selectedLabel]) => ({
      questionId: parseInt(id),
      selectedLabel,
    }));

    const res = await fetch('/api/qcm/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ responses }),
    });

    const result = await res.json();
    const newAttempts = attempts + 1;

    localStorage.setItem('qcm_attempts', newAttempts.toString());

    if (result.passed) {
      localStorage.setItem('qcm_passed', 'true');
      navigate('/form');
    } else {
      setError(`Score insuffisant (${result.score}/20). Il te reste ${3 - newAttempts} essai(s).`);
      setAttempts(newAttempts);
    }
  };

  useEffect(() => {
  const loadQuestions = async () => {
    const res = await fetch('/api/qcm/questions');
    const data = await res.json();
    console.log("📦 Questions chargées :", data);
    setQuestions(data);
  };

  loadQuestions();
}, []);

  return (
    <div className="card max-w-3xl mx-auto p-6 space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-center">QCM de Validation</h2>

      {error && <div className="text-red-500 font-medium">{error}</div>}

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
        disabled={attempts >= 3}
      >
        Soumettre le QCM
      </button>
    </div>
  );
};

export default QcmPage;
