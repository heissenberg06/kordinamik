const jwt = require('jsonwebtoken');
const db = require('../config/db');
const logger = require('../config/logger');

// Dealer JWT secret with fallback (kept separate from admin secrets)
const JWT_SECRET = process.env.JWT_SECRET || process.env.ACCESS_TOKEN_SECRET || 'dev_dealer_secret';

/**
 * Authenticate dealer using JWT token
 */
const authenticateDealer = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Check if token is for dealer role
    if (decoded.role !== 'dealer') {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied'
      });
    }
    
    // Check if token is blacklisted
    const { TokenBlacklist, Dealer } = db.initModels();
    
    const isBlacklisted = await TokenBlacklist.findOne({
      where: { token }
    });
    
    if (isBlacklisted) {
      return res.status(401).json({
        status: 'error',
        message: 'Token has been revoked'
      });
    }
    
    // Get dealer from database
    const dealer = await Dealer.findByPk(decoded.id, {
      attributes: { exclude: ['password_hash'] }
    });
    
    if (!dealer) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication failed'
      });
    }
    
    // Check if dealer is active
    if (!dealer.is_active) {
      return res.status(403).json({
        status: 'error',
        message: 'Your account has been deactivated'
      });
    }
    
    // Set dealer in request object
    req.dealer = dealer;
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid or expired token'
      });
    }
    
    logger.error('Authenticate dealer middleware error:', error);
    next(error);
  }
};

module.exports = {
  authenticateDealer
};
