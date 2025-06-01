import Question from './Question.js';

export { Question };
import QcmAttempt from './QcmAttempt.js';
export { QcmAttempt };


import InscriptionParticipant from './InscriptionParticipant.js';

Inscription.hasMany(InscriptionParticipant, { foreignKey: 'inscriptionId' });
InscriptionParticipant.belongsTo(Inscription, { foreignKey: 'inscriptionId' });
