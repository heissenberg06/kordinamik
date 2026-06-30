const authService = require('../services/auth.service');
const authConfig = require('../config/auth');
const { logAudit } = require('../middlewares/audit.middleware');
const logger = require('../config/logger');

/**
 * Login controller
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    
    // Login and get tokens
    const result = await authService.login(username, password);
    
    // Set refresh token as HTTP-only cookie
    res.cookie('refreshToken', result.refreshToken, {
      ...authConfig.cookie,
      path: '/api/auth/refresh'
    });
    
    // Log successful login
    await logAudit(
      req, 
      'LOGIN', 
      'ADMIN', 
      result.admin.id,
      null,
      { username: result.admin.username }
    );
    
    // Return access token and admin data
    res.status(200).json({
      status: 'success',
      data: {
        admin: result.admin,
        accessToken: result.accessToken
      }
    });
  } catch (error) {
    logger.error('Login controller error:', error);
    next(error);
  }
};

/**
 * Refresh token controller
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const refresh = async (req, res, next) => {
  try {
    // Get refresh token from cookie
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({
        status: 'error',
        message: 'Refresh token required'
      });
    }
    
    // Refresh tokens
    const tokens = await authService.refreshTokens(refreshToken);
    
    // Set new refresh token as HTTP-only cookie
    res.cookie('refreshToken', tokens.refreshToken, {
      ...authConfig.cookie,
      path: '/api/auth/refresh'
    });
    
    // Return new access token
    res.status(200).json({
      status: 'success',
      data: {
        accessToken: tokens.accessToken
      }
    });
  } catch (error) {
    logger.error('Refresh token controller error:', error);
    next(error);
  }
};

/**
 * Logout controller
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const logout = async (req, res, next) => {
  try {
    // Get refresh token from cookie
    const refreshToken = req.cookies.refreshToken;
    
    // Logout
    await authService.logout(refreshToken);
    
    // Clear refresh token cookie
    res.clearCookie('refreshToken', {
      path: '/api/auth/refresh'
    });
    
    // Log logout
    if (req.admin) {
      await logAudit(
        req, 
        'LOGOUT', 
        'ADMIN', 
        req.admin.id,
        null,
        null
      );
    }
    
    res.status(200).json({
      status: 'success',
      message: 'Logged out successfully'
    });
  } catch (error) {
    logger.error('Logout controller error:', error);
    next(error);
  }
};

module.exports = {
  login,
  refresh,
  logout
};


