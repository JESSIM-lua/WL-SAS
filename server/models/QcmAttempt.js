// server/models/QcmAttempt.js
import { DataTypes } from 'sequelize';
import db from '../config/db.js';

const QcmAttempt = db.define('QcmAttempt', {
  discordId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  responses: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  passed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  timestamps: true,
});

export default QcmAttempt;
