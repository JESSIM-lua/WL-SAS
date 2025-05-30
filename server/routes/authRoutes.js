// /server/routes/authRoutes.js
import express from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

const {
  DISCORD_CLIENT_ID,
  DISCORD_CLIENT_SECRET,
  DISCORD_REDIRECT_URI,
  DISCORD_GUILD_ID,
  DISCORD_ADMIN_ROLE_ID,
  JWT_SECRET
} = process.env;

// Redirige vers Discord OAuth2
router.get('/discord', (req, res) => {
  const url = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(DISCORD_REDIRECT_URI)}&response_type=code&scope=identify%20guilds%20guilds.members.read`;
  res.redirect(url);
});


// Callback OAuth
router.get('/discord/callback', async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).send('Code manquant');

  try {
    // 1. Récupère l'access_token
    const tokenRes = await axios.post(
      'https://discord.com/api/oauth2/token',
      new URLSearchParams({
        client_id: DISCORD_CLIENT_ID,
        client_secret: DISCORD_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code,
        redirect_uri: DISCORD_REDIRECT_URI,
        scope: 'identify guilds guilds.members.read'
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const accessToken = tokenRes.data.access_token;

    // 2. Récupère les infos utilisateur
    const userRes = await axios.get('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const user = userRes.data;

    // 3. Vérifie la présence dans la guilde
    const memberRes = await axios.get(
      `https://discord.com/api/users/@me/guilds/${DISCORD_GUILD_ID}/member`,
      {
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    );
    const member = memberRes.data;
    const hasAdminRole = member.roles.includes(DISCORD_ADMIN_ROLE_ID);

    if (!hasAdminRole) {
      return res.status(403).send('Tu n’es pas admin Discord.');
    }

    // 4. Enregistre ou met à jour l’admin
    let admin = await Admin.findOne({ where: { discordId: user.id } });
    if (!admin) {
      admin = await Admin.create({
        discordId: user.id,
        username: user.username,
        avatarUrl: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`,
        discordRoles: member.roles
      });
    }

    // 5. Génère un JWT
    const token = jwt.sign(
      { id: admin.id, discordId: admin.discordId },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    // 6. Redirige vers frontend avec token
    res.redirect(`http://localhost:5173/admin?token=${token}&user=${encodeURIComponent(JSON.stringify(admin))}`);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).send('Erreur d’authentification Discord');
  }
});


// Redirige un USER vers Discord
router.get('/discord-user', (req, res) => {
  const url = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(DISCORD_REDIRECT_URI + '/user')}&response_type=code&scope=identify`;
  res.redirect(url);
});

// Callback USER Discord OAuth
router.get('/discord/callback/user', async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).send('Code manquant');

  try {
    const tokenRes = await axios.post(
      'https://discord.com/api/oauth2/token',
      new URLSearchParams({
        client_id: DISCORD_CLIENT_ID,
        client_secret: DISCORD_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code,
        redirect_uri: DISCORD_REDIRECT_URI + '/user',
        scope: 'identify'
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const accessToken = tokenRes.data.access_token;

    const userRes = await axios.get('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    const user = userRes.data;

    // Tu peux stocker ou logguer si tu veux

    const token = jwt.sign(
      { discordId: user.id },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.redirect(`http://localhost:5173/form?token=${token}&discordId=${user.id}&username=${user.username}`);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).send('Erreur lors de l’authentification Discord utilisateur');
  }
});


export default router;
