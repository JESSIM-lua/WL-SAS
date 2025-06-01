import Inscription from '../models/Inscription.js';

// Liste toutes les inscriptions
export const getAllInscriptions = async (req, res) => {
  const inscriptions = await Inscription.findAll();
  res.json(inscriptions);
};

// Crée une nouvelle inscription (admin uniquement)
export const createInscription = async (req, res) => {
  const { date, heure, maxPlayers, createdBy } = req.body;

  if (!date || !heure || !maxPlayers || !createdBy) {
    return res.status(400).json({ error: 'Tous les champs sont requis.' });
  }

  const inscription = await Inscription.create({ date, heure, maxPlayers, createdBy });
  res.status(201).json(inscription);
};
