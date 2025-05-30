import { DataTypes } from 'sequelize';

import sequelize from '../config/db.js'; // adapte ce chemin à ton projet

const Question = sequelize.define('Question', {
  question: {
    type: DataTypes.STRING,
    allowNull: false
  },
  choices: {
    type: DataTypes.JSON,
    allowNull: false,
    // Exemple de valeur :
    // [
    //   { label: 'Réponse A', isCorrect: false },
    //   { label: 'Réponse B', isCorrect: true },
    //   { label: 'Réponse C', isCorrect: false }
    // ]
  },
  points: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  }
});

export default Question;
