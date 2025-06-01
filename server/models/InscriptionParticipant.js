import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const InscriptionParticipant = sequelize.define('InscriptionParticipant', {
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
      fields: ['discordId', 'inscriptionId'], // empêche un joueur de s’inscrire deux fois à la même session
    },
  ],
});

export default InscriptionParticipant;
