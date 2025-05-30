import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

// Authenticate JWT token
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, error: 'Access token required' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, error: 'Invalid or expired token' });
    }
    
    req.user = user;
    next();
  });
};

// Check if user is admin
export const isAdmin = async (req, res, next) => {
  try {
    const admin = await Admin.findOne({ where: { id: req.user.id } });
    
    if (!admin) {
      return res.status(403).json({ success: false, error: 'Not authorized as admin' });
    }
    
    next();
  } catch (error) {
    console.error('Admin check error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};