import express from 'express';
import Player from '../models/Player.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';
import { updateDiscordRole } from '../services/discordService.js';

const router = express.Router();

// Get all applications (admin only)
router.get('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const players = await Player.findAll({
      order: [['createdAt', 'DESC']]
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
    
    const player = await Player.findOne({
      where: { discordId }
    });
    
    if (!player) {
      return res.status(404).json({ success: false, error: 'No application found with this Discord ID' });
    }
    
    res.json({ success: true, data: player });
  } catch (error) {
    console.error('Error fetching application status:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Get Total Applications
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
    
    // Check if an application with this Discord ID already exists
    const existingApplication = await Player.findOne({
      where: { discordId }
    });
    
    if (existingApplication) {
      return res.status(400).json({ 
        success: false, 
        error: 'An application with this Discord ID already exists' 
      });
    }
    
    // Create new application
    const player = await Player.create({
      rpName,
      rpSurname,
      backgroundLink,
      discordId,
      status: 'pending'
    });
    
    res.status(201).json({ success: true, data: player });
  } catch (error) {
    console.error('Error creating application:', error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        success: false, 
        error: error.errors.map(e => e.message).join(', ') 
      });
    }
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Update application status (admin only)
router.patch('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status' });
    }
    
    const player = await Player.findByPk(id);
    
    if (!player) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }
    
    // Update status
    player.status = status;
    await player.save();
    
    // If approved, update Discord role
    if (status === 'approved') {
      try {
        await updateDiscordRole(player.discordId, 'whitelist');
      } catch (discordError) {
        console.error('Error updating Discord role:', discordError);
        // Continue anyway as the DB update was successful
      }
    }
    
    res.json({ success: true, data: player });
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

export default router;