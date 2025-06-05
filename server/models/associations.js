import Inscription from './Inscription.js';
import InscriptionParticipant from './InscriptionParticipant.js';

Inscription.hasMany(InscriptionParticipant, {
  foreignKey: 'inscriptionId',
  as: 'participants',
});

InscriptionParticipant.belongsTo(Inscription, {
  foreignKey: 'inscriptionId',
  as: 'inscription',
});
