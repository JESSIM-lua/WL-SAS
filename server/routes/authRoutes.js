import express from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import { authenticateDiscord, getDiscordUserInfo } from '../services/discordService.js';

const router = express.Router();

// Discord login/callback
router.get('/discord', async (req, res) => {
  try {
    // In a real application, this would use the Discord OAuth flow
    // For this demo, we're simulating a successful login
    
    // Simulate getting a code from Discord
    const mockCode = 'mock_discord_code';
    
    // Exchange code for Discord token
    const tokenData = await authenticateDiscord(mockCode);
    
    // Get user info from Discord
    const discordUser = await getDiscordUserInfo(tokenData.access_token);
    
    // Check if user has admin role in our Discord server
    const isAdmin = discordUser.roles.includes('admin_role_id');
    
    if (!isAdmin) {
      return res.status(403).json({ 
        success: false, 
        error: 'You do not have admin privileges on the Discord server' 
      });
    }
    
    // Find or create admin in database
    let admin = await Admin.findOne({ where: { discordId: discordUser.id } });
    
    if (!admin) {
      admin = await Admin.create({
        discordId: discordUser.id,
        username: discordUser.username,
        avatarUrl: discordUser.avatar,
        discordRoles: discordUser.roles
      });
    } else {
      // Update admin info
      admin.username = discordUser.username;
      admin.avatarUrl = discordUser.avatar;
      admin.discordRoles = discordUser.roles;
      await admin.save();
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: admin.id, discordId: admin.discordId }, 
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1d' }
    );
    
    res.json({ 
      success: true, 
      data: { 
        token,
        user: {
          id: admin.id,
          discordId: admin.discordId,
          username: admin.username,
          avatarUrl: admin.avatarUrl
        }
      }
    });
  } catch (error) {
    console.error('Discord auth error:', error);
    res.status(500).json({ success: false, error: 'Authentication failed' });
  }
});

export default router;