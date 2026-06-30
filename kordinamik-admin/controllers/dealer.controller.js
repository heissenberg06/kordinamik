const dealerService = require('../services/dealer.service');
const logger = require('../config/logger');

/**
 * Register a new dealer
 */
const registerDealer = async (req, res, next) => {
  try {
    const { email, password, approval_code, application_id, confirm_password } = req.body;
    
    // Validate required fields
    if (!password) {
      return res.status(400).json({
        status: 'error',
        message: 'Password is required'
      });
    }
    
    // Check if password and confirm_password match
    if (confirm_password && password !== confirm_password) {
      return res.status(400).json({
        status: 'error',
        message: 'Passwords do not match'
      });
    }
    
    // Require approval_code and email (user flow). application_id stays optional for admin/internal.
    if (!approval_code || !email) {
      return res.status(400).json({
        status: 'error',
        message: 'Approval code and email are required'
      });
    }
    
    // Register dealer
    const result = await dealerService.registerDealer({
      email,
      password,
      approval_code,
      application_id
    });
    
    res.status(201).json({
      status: 'success',
      message: 'Dealer registered successfully',
      data: result
    });
  } catch (error) {
    logger.error('Register dealer controller error:', error);
    
    // Send appropriate error response
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        status: 'error',
        message: error.message
      });
    }
    
    next(error);
  }
};

/**
 * Login dealer
 */
const loginDealer = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Email and password are required'
      });
    }
    
    // Login dealer
    const result = await dealerService.loginDealer(email, password);
    
    // Set refresh token as HTTP-only cookie
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        dealer: result.dealer,
        accessToken: result.accessToken
      }
    });
  } catch (error) {
    logger.error('Login dealer controller error:', error);
    next(error);
  }
};

/**
 * Get dealer profile
 */
const getDealerProfile = async (req, res, next) => {
  try {
    const dealerId = req.dealer.id;
    
    const dealer = await dealerService.getDealerProfile(dealerId);
    
    res.status(200).json({
      status: 'success',
      data: dealer
    });
  } catch (error) {
    logger.error('Get dealer profile controller error:', error);
    next(error);
  }
};

/**
 * Update dealer profile
 */
const updateDealerProfile = async (req, res, next) => {
  try {
    const dealerId = req.dealer.id;
    const updateData = req.body;
    
    const result = await dealerService.updateDealerProfile(dealerId, updateData);
    
    res.status(200).json({
      status: 'success',
      message: 'Profile updated successfully',
      data: result
    });
  } catch (error) {
    logger.error('Update dealer profile controller error:', error);
    next(error);
  }
};

/**
 * Refresh access token
 */
const refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    
    if (!refreshToken) {
      return res.status(401).json({
        status: 'error',
        message: 'Refresh token is required'
      });
    }
    
    const tokens = await dealerService.refreshToken(refreshToken);
    
    // Set new refresh token as HTTP-only cookie
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
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
 * Logout dealer
 */
const logoutDealer = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    
    if (refreshToken) {
      await dealerService.logoutDealer(refreshToken);
    }
    
    // Clear refresh token cookie
    res.clearCookie('refreshToken');
    
    res.status(200).json({
      status: 'success',
      message: 'Logged out successfully'
    });
  } catch (error) {
    logger.error('Logout dealer controller error:', error);
    next(error);
  }
};

module.exports = {
  registerDealer,
  loginDealer,
  getDealerProfile,
  updateDealerProfile,
  refreshToken,
  logoutDealer
};
