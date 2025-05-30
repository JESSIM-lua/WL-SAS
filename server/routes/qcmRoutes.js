import express from 'express';
import Question from '../models/Question.js';
import QcmAttempt from '../models/QcmAttempt.js';

const router = express.Router();

// POST: Vérifie les réponses et enregistre la tentative
router.post('/verify', async (req, res) => {
  const { responses, discordId } = req.body;

  if (!discordId || !Array.isArray(responses)) {
    return res.status(400).json({ error: 'Bad request' });
  }

  const questions = await Question.findAll();
  let score = 0;

  for (const question of questions) {
    const userAnswer = responses.find(r => r.questionId === question.id);
    const correct = question.choices.find(c => c.isCorrect)?.label;
    if (userAnswer?.selectedLabel === correct) {
      score += question.points;
    }
  }

  const passed = score >= 10;

  const attempts = await QcmAttempt.count({ where: { discordId } });

  if (attempts >= 3) {
    return res.status(403).json({ error: 'Nombre maximal de tentatives atteint.' });
  }

  // 📝 Enregistre la tentative
  await QcmAttempt.create({ discordId, responses, score, passed });

  // ✅ Renvoyer le nombre total de tentatives après création
  return res.json({ passed, score, attempts: attempts + 1 });
});


// GET: Charge les questions pour l'affichage
router.get('/questions', async (req, res) => {
  const questions = await Question.findAll();
  res.json(questions);
});

// GET: Récupère le nombre de tentatives d’un utilisateur
router.get('/attempts/:discordId', async (req, res) => {
  try {
    const { discordId } = req.params;

    const attempts = await QcmAttempt.count({ where: { discordId } });
    const lastSuccess = await QcmAttempt.findOne({
      where: { discordId, passed: true },
      order: [['createdAt', 'DESC']],
    });

    const passed = !!lastSuccess;

    res.json({ attempts, passed });
  } catch (error) {
    console.error('Erreur QCM attempts:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});




export default router;
