const { verifyAccessToken } = require('../utils/token.utils');
const db = require('../config/db');
const logger = require('../config/logger');

/**
 * Middleware to authenticate admin using JWT
 */
const authenticateAdmin = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
    }
    
    // Extract token
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = verifyAccessToken(token);
    
    // Get admin from database
    const { Admin } = db.initModels();
    const admin = await Admin.findByPk(decoded.id);
    if (!admin || !admin.is_active) {
      return res.status(401).json({
        status: 'error',
        message: 'Admin not found or inactive'
      });
    }
    
    // Attach admin to request object
    req.admin = admin;
    
    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    return res.status(401).json({
      status: 'error',
      message: 'Invalid or expired token'
    });
  }
};

module.exports = {
  authenticateAdmin
};


