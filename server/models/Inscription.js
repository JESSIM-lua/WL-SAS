import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import InscriptionParticipant from './InscriptionParticipant.js';

const Inscription = sequelize.define('Inscription', {
  date: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  heure: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  maxPlayers: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  createdBy: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'Inscriptions',
});



export default Inscription;
