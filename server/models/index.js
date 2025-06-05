// server/models/index.js
import Question from './Question.js';
import QcmAttempt from './QcmAttempt.js';
import Inscription from './Inscription.js';
import InscriptionParticipant from './InscriptionParticipant.js';

// Associer les modèles ici
Inscription.hasMany(InscriptionParticipant, {
  foreignKey: 'inscriptionId',
  as: 'participants',
});
InscriptionParticipant.belongsTo(Inscription, {
  foreignKey: 'inscriptionId',
  as: 'inscription',
});

// Export centralisé
export {
  Question,
  QcmAttempt,
  Inscription,
  InscriptionParticipant,
};
