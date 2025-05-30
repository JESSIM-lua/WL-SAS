import express from 'express';
import { Question } from '../models/index.js';

const router = express.Router();

// POST /api/qcm/verify
router.post('/verify', async (req, res) => {
  try {
    const responses = req.body.responses; // tableau { questionId, selectedLabel }

    if (!Array.isArray(responses)) {
      return res.status(400).json({ error: 'Invalid format' });
    }

    let score = 0;

    for (const { questionId, selectedLabel } of responses) {
      const question = await Question.findByPk(questionId);

      if (!question) continue;

      const correctChoice = question.choices.find(c => c.isCorrect);

      if (correctChoice?.label === selectedLabel) {
        score += question.points;
      }
    }

    const passed = score >= 10;

    res.json({ score, passed });
  } catch (error) {
    console.error('Erreur de vérification QCM:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});


router.get('/questions', async (req, res) => {
  const questions = await Question.findAll();
  res.json(questions);
});


export default router;
