import express from 'express';
import Inscription from '../models/Inscription.js';
import InscriptionParticipant from '../models/InscriptionParticipant.js';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

// ✅ Créer une nouvelle session d'inscription
router.post('/', async (req, res) => {
  const { date, heure, maxPlayers, createdBy } = req.body;

  if (!date || !heure || !maxPlayers || !createdBy) {
    return res.status(400).json({ error: 'Champs manquants' });
  }

  try {
    const nouvelleInscription = await Inscription.create({
      date,
      heure,
      maxPlayers,
      createdBy,
    });

    res.status(201).json(nouvelleInscription);
  } catch (err) {
    console.error('❌ Erreur création session:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ✅ Récupérer toutes les inscriptions avec les participants
router.get('/', async (req, res) => {
  try {
    const inscriptions = await Inscription.findAll({
      include: [
        {
          model: InscriptionParticipant,
          as: 'participants',
        },
      ],
    });

    res.json(inscriptions);
  } catch (err) {
    console.error('❌ Erreur récupération des inscriptions:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ✅ Rejoindre une inscription
router.post('/:id/join', async (req, res) => {
  const { discordId } = req.body;
  const inscriptionId = req.params.id;

  if (!discordId) {
    return res.status(400).json({ error: 'Aucun ID fourni' });
  }

  try {
    const inscription = await Inscription.findByPk(inscriptionId, {
      include: [
        {
          model: InscriptionParticipant,
          as: 'participants',
        },
      ],
    });

    if (!inscription) {
      return res.status(404).json({ error: 'Session introuvable' });
    }

    const alreadyRegistered = inscription.participants.find(
      (p) => p.discordId === discordId
    );
    if (alreadyRegistered) {
      return res.status(400).json({ error: 'Tu es déjà inscrit.' });
    }

    if (inscription.participants.length >= inscription.maxPlayers) {
      return res.status(403).json({ error: 'Session complète' });
    }

    await InscriptionParticipant.create({ discordId, inscriptionId });

    // 🎯 Ajout du rôle Discord
    const { DISCORD_BOT_TOKEN, DISCORD_GUILD_ID } = process.env;
    const ROLE_ID = '1355515550427516969';

    if (!DISCORD_BOT_TOKEN || !DISCORD_GUILD_ID) {
      console.warn('⚠️ Variables d’environnement Discord manquantes');
    } else {
      const response = await fetch(
        `https://discord.com/api/guilds/${DISCORD_GUILD_ID}/members/${discordId}/roles/${ROLE_ID}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Erreur rôle Discord:', errorText);
      }
    }

    res.json({ success: true });
  } catch (err) {
    console.error('❌ Erreur serveur:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});


// ✅ Quitter une inscription

router.post('/:id/leave', async (req, res) => {
  const { discordId } = req.body;
  const inscriptionId = req.params.id;

  if (!discordId) {
    return res.status(400).json({ error: 'Aucun ID fourni' });
  }

  try {
    const inscription = await Inscription.findByPk(inscriptionId, {
      include: [
        {
          model: InscriptionParticipant,
          as: 'participants',
        },
      ],
    });

    if (!inscription) {
      return res.status(404).json({ error: 'Session introuvable' });
    }

    const participant = inscription.participants.find(
      (p) => p.discordId === discordId
    );
    if (!participant) {
      return res.status(400).json({ error: 'Tu n’es pas inscrit.' });
    }

    await participant.destroy();

    // 🎯 Suppression du rôle Discord
    const { DISCORD_BOT_TOKEN, DISCORD_GUILD_ID } = process.env;
    const ROLE_ID = '1355515550427516969';

    if (!DISCORD_BOT_TOKEN || !DISCORD_GUILD_ID) {
      console.warn('⚠️ Variables d’environnement Discord manquantes');
    } else {
      const response = await fetch(
        `https://discord.com/api/guilds/${DISCORD_GUILD_ID}/members/${discordId}/roles/${ROLE_ID}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Erreur suppression rôle Discord:', errorText);
      }
    }

    res.json({ success: true });
  } catch (err) {
    console.error('❌ Erreur serveur:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}


);

// ✅ Activer/désactiver une session
router.patch('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { isActive } = req.body;

  try {
    const session = await Inscription.findByPk(id, {
      include: [
        {
          model: InscriptionParticipant,
          as: 'participants',
        },
      ],
    });

    if (!session) {
      return res.status(404).json({ success: false, error: 'Session non trouvée' });
    }

    session.isActive = isActive;
    await session.save();

    // Si on désactive la session, on retire le rôle Discord aux participants
    if (!isActive && session.participants.length > 0) {
      const { DISCORD_BOT_TOKEN, DISCORD_GUILD_ID } = process.env;
      const ROLE_ID = '1355515550427516969';

      if (!DISCORD_BOT_TOKEN || !DISCORD_GUILD_ID) {
        console.warn('⚠️ Token ou ID Discord manquant');
      } else {
        for (const participant of session.participants) {
          try {
            await fetch(
              `https://discord.com/api/guilds/${DISCORD_GUILD_ID}/members/${participant.discordId}/roles/${ROLE_ID}`,
              {
                method: 'DELETE',
                headers: {
                  Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
                  'Content-Type': 'application/json',
                },
              }
            );
          } catch (err) {
            console.error(`Erreur suppression rôle pour ${participant.discordId}:`, err);
          }
        }
      }
    }

    res.json({ success: true, data: session });
  } catch (err) {
    console.error('Erreur changement statut session:', err);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});


export default router;
