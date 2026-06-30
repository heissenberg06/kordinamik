const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');
const db = require('../config/db');

/**
 * Generate access token for admin
 * @param {Object} admin - Admin user object
 * @returns {String} Access token
 */
const generateAccessToken = (admin) => {
  return jwt.sign(
    { 
      id: admin.id, 
      username: admin.username,
      role: 'admin' 
    },
    authConfig.jwt.accessTokenSecret,
    { expiresIn: authConfig.jwt.accessTokenExpiry }
  );
};

/**
 * Generate refresh token for admin
 * @param {Object} admin - Admin user object
 * @returns {String} Refresh token
 */
const generateRefreshToken = (admin) => {
  return jwt.sign(
    { id: admin.id },
    authConfig.jwt.refreshTokenSecret,
    { expiresIn: authConfig.jwt.refreshTokenExpiry }
  );
};

/**
 * Generate both access and refresh tokens
 * @param {Object} admin - Admin user object
 * @returns {Object} Object containing both tokens
 */
const generateTokens = (admin) => {
  const accessToken = generateAccessToken(admin);
  const refreshToken = generateRefreshToken(admin);
  
  return { accessToken, refreshToken };
};

/**
 * Verify access token
 * @param {String} token - Access token to verify
 * @returns {Object} Decoded token payload
 */
const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, authConfig.jwt.accessTokenSecret);
  } catch (error) {
    throw new Error('Invalid access token');
  }
};

/**
 * Verify refresh token
 * @param {String} token - Refresh token to verify
 * @returns {Object} Decoded token payload
 */
const verifyRefreshToken = async (token) => {
  try {
    // Verify token signature and expiration
    const decoded = jwt.verify(token, authConfig.jwt.refreshTokenSecret);
    
    // Check if token is blacklisted
    const { TokenBlacklist } = db.initModels();
    const blacklistedToken = await TokenBlacklist.findOne({ 
      where: { token } 
    });
    
    if (blacklistedToken) {
      throw new Error('Token has been revoked');
    }
    
    return decoded;
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
};

/**
 * Blacklist a refresh token
 * @param {String} token - Refresh token to blacklist
 * @returns {Promise} Promise resolving to blacklisted token record
 */
const blacklistToken = async (token) => {
  try {
    // Decode token without verification to get expiry
    const decoded = jwt.decode(token);
    const expiresAt = new Date(decoded.exp * 1000);
    
    // Add to blacklist
    const { TokenBlacklist } = db.initModels();
    return await TokenBlacklist.create({
      token,
      expires_at: expiresAt
    });
  } catch (error) {
    throw new Error('Error blacklisting token');
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  generateTokens,
  verifyAccessToken,
  verifyRefreshToken,
  blacklistToken
};


