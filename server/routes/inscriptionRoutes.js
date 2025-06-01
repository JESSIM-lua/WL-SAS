import express from 'express';
import { getAllInscriptions, createInscription } from '../controllers/inscriptionController.js';

const router = express.Router();

router.get('/', getAllInscriptions);
router.post('/', createInscription); // 🔐 À sécuriser (admin seulement)

export default router;
