import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

import playerRoutes from './routes/playerRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { connectToDatabase } from './config/db.js';

import qcmRoutes from './routes/qcmRoutes.js';
// Load environment variables
dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3001;



// Middleware
app.use(cors());
app.use(express.json());

app.use('/api/qcm', qcmRoutes);

import inscriptionRoutes from './routes/inscriptionRoutes.js';
app.use('/api/inscriptions', inscriptionRoutes);

// Static files
app.use(express.static(join(__dirname, '../dist')));

// API routes
app.use('/api/players', playerRoutes);
app.use('/api/auth', authRoutes);

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../dist/index.html'));
});

// Start server
const startServer = async () => {
  try {
    // Connect to database
    await connectToDatabase();
    console.log('Connected to MariaDB database');
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();