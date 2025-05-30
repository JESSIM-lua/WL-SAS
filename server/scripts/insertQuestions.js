// server/scripts/insertQuestions.js
import Question from '../models/Question.js';

await Question.sync();

await Question.bulkCreate([
  {
    question: "Quelle est la capitale de la France ?",
    choices: [
      { label: "Paris", isCorrect: true },
      { label: "Lyon", isCorrect: false },
      { label: "Marseille", isCorrect: false },
    ],
    points: 2,
  },
  {
    question: "Combien de continents existe-t-il ?",
    choices: [
      { label: "5", isCorrect: false },
      { label: "6", isCorrect: false },
      { label: "7", isCorrect: true },
    ],
    points: 2,
  },
]);

console.log("✅ Questions insérées.");
