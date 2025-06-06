import express from 'express';
import Player from '../models/Player.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';
import { updateDiscordRole } from '../services/discordService.js';

const router = express.Router();

// Get all applications (admin only)
router.get('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const players = await Player.findAll({
      order: [['createdAt', 'DESC']],
    });
    res.json({ success: true, data: players });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Get application status by Discord ID (public)
router.get('/status/:discordId', async (req, res) => {
  try {
    const { discordId } = req.params;

    const player = await Player.findOne({ where: { discordId } });

    if (!player) {
      return res.status(404).json({
        success: false,
        error: 'No application found with this Discord ID',
      });
    }

    res.json({ success: true, data: player });
  } catch (error) {
    console.error('Error fetching application status:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Get total number of applications
router.get('/total', authenticateToken, isAdmin, async (req, res) => {
  try {
    const total = await Player.count();
    res.json({ success: true, total });
  } catch (error) {
    console.error('Error fetching total applications:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Submit new application (public)
router.post('/', async (req, res) => {
  try {
    const { rpName, rpSurname, backgroundLink, discordId } = req.body;

    const existingApplication = await Player.findOne({
      where: { discordId },
    });

    if (existingApplication) {
      // Rejeté mais jamais repostulé → autoriser une seconde chance
      if (
        existingApplication.status === 'rejected' &&
        !existingApplication.reapplied
      ) {
        await existingApplication.destroy(); // Supprimer l'ancienne
      } else if (
        existingApplication.status === 'rejected' &&
        existingApplication.reapplied
      ) {
        return res.status(403).json({
          success: false,
          error: 'Tu as déjà utilisé ta seconde chance.',
        });
      } else {
        return res.status(400).json({
          success: false,
          error: 'Une candidature est déjà en cours ou acceptée.',
        });
      }
    }

    const player = await Player.create({
      rpName,
      rpSurname,
      backgroundLink,
      discordId,
      status: 'pending',
      reapplied: existingApplication ? true : false, // true s’il s’agissait d’une seconde chance
    });

    res.status(201).json({ success: true, data: player });
  } catch (error) {
    console.error('Error creating application:', error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        error: error.errors.map((e) => e.message).join(', '),
      });
    }
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Update application status (admin only)
router.patch('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason, adminNote } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status',
      });
    }

    const player = await Player.findByPk(id);

    if (!player) {
      return res.status(404).json({
        success: false,
        error: 'Application not found',
      });
    }

    player.status = status;

    if (status === 'rejected') {
      player.rejectionReason = rejectionReason || 'Aucune raison spécifiée.';
      player.adminNote = adminNote || null;
    } else {
      player.rejectionReason = null;
      player.adminNote = null;
    }

    await player.save();

    // Ajout d’un rôle Discord si approuvé
    if (status === 'approved') {
      try {
        await updateDiscordRole(player.discordId, 'whitelist');
      } catch (err) {
        console.error('Discord role update error:', err);
      }
    }

    res.json({ success: true, data: player });
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const [total, pending, approved, rejected] = await Promise.all([
      Player.count(),
      Player.count({ where: { status: 'pending' } }),
      Player.count({ where: { status: 'approved' } }),
      Player.count({ where: { status: 'rejected' } }),
    ]);

    res.json({
      success: true,
      data: { total, pending, approved, rejected },
    });
  } catch (err) {
    console.error('Erreur stats:', err);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});


export default router;
