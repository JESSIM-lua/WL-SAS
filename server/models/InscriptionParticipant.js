import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Inscription from './Inscription.js'; // ✅ CORRECTION ICI

const InscriptionParticipant = sequelize.define('InscriptionParticipant', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  discordId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  inscriptionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'InscriptionParticipants',
  indexes: [
    {
      unique: true,
      fields: ['discordId', 'inscriptionId'],
    },
  ],
});

export default InscriptionParticipant;
