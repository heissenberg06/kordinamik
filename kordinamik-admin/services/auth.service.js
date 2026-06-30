const db = require('../config/db');
const { generateTokens, blacklistToken, verifyRefreshToken } = require('../utils/token.utils');
const logger = require('../config/logger');

/**
 * Login admin and generate tokens
 * @param {String} username - Admin username
 * @param {String} password - Admin password
 * @returns {Object} Object containing admin data and tokens
 */
const login = async (username, password) => {
  try {
    const { Admin } = db.initModels();
    // Find admin by username
    const admin = await Admin.findOne({ where: { username } });
    if (!admin) {
      throw { statusCode: 401, message: 'Invalid credentials' };
    }
    
    // Check if admin is active
    if (!admin.is_active) {
      throw { statusCode: 403, message: 'Account is inactive' };
    }
    
    // Validate password
    const isValid = await admin.validatePassword(password);
    if (!isValid) {
      throw { statusCode: 401, message: 'Invalid credentials' };
    }
    
    // Generate tokens
    const tokens = generateTokens(admin);
    
    // Update last login timestamp
    await admin.update({ last_login: new Date() });
    
    // Return admin data and tokens
    return {
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        full_name: admin.full_name
      },
      ...tokens
    };
  } catch (error) {
    logger.error('Login error:', error);
    throw error;
  }
};

/**
 * Refresh tokens using refresh token
 * @param {String} refreshToken - Refresh token
 * @returns {Object} Object containing new tokens
 */
const refreshTokens = async (refreshToken) => {
  try {
    // Verify refresh token
    const decoded = await verifyRefreshToken(refreshToken);
    
    // Get admin
    const { Admin } = db.initModels();
    const admin = await Admin.findByPk(decoded.id);
    if (!admin || !admin.is_active) {
      throw { statusCode: 401, message: 'Admin not found or inactive' };
    }
    
    // Generate new tokens
    const tokens = generateTokens(admin);
    
    // Blacklist used refresh token
    await blacklistToken(refreshToken);
    
    return tokens;
  } catch (error) {
    logger.error('Token refresh error:', error);
    throw { statusCode: 401, message: 'Invalid refresh token' };
  }
};

/**
 * Logout admin by blacklisting refresh token
 * @param {String} refreshToken - Refresh token to blacklist
 * @returns {Boolean} Success status
 */
const logout = async (refreshToken) => {
  try {
    if (refreshToken) {
      await blacklistToken(refreshToken);
    }
    return true;
  } catch (error) {
    logger.error('Logout error:', error);
    throw error;
  }
};

module.exports = {
  login,
  refreshTokens,
  logout
};


