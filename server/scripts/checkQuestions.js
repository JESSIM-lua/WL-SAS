// server/scripts/checkQuestions.js
import Question from '../models/Question.js';
await Question.sync();
const all = await Question.findAll();
console.log(all.map(q => q.toJSON()));
