import sequelize from '../config/db.js'; // chemin vers ta config sequelize
import Question from '../models/Question.js';

await sequelize.sync(); // assure que Sequelize est prêt
await Question.sync({ alter: true }); // ou { force: true } si tu veux tout écraser

// Exemple de question
await Question.create({
  question: "Quelle est la capitale de l'Espagne ?",
  choices: [
    { label: "Madrid", isCorrect: true },
    { label: "Barcelone", isCorrect: false },
    { label: "Séville", isCorrect: false }
  ],
  points: 2
});

console.log('Question table synced and one example inserted.');
process.exit();
