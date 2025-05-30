import QcmAttempt from '../models/QcmAttempt.js';

await QcmAttempt.sync({ alter: true }); // ou { force: true } pour reset complet
console.log('✅ Table QcmAttempt synchronisée');
process.exit(0);
