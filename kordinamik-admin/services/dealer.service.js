const db = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { generateApprovalCode } = require('../utils/code.utils');
const logger = require('../config/logger');

// Dealer JWT secrets with sane development fallbacks so login/register works
// even if environment variables are missing (does not touch admin auth).
const JWT_SECRET = process.env.JWT_SECRET || process.env.ACCESS_TOKEN_SECRET || 'dev_dealer_secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || process.env.REFRESH_TOKEN_SECRET || 'dev_dealer_refresh_secret';

/**
 * Register a new dealer from an approved application
 */
const registerDealer = async (registrationData) => {
  const { email, password, approval_code, application_id } = registrationData;
  
  try {
    const { DealerApplication, Dealer } = db.initModels();
    
    // Find the approved application with the provided approval code or application_id
    let whereClause = { status: 'approved' };
    
    if (application_id) {
      whereClause.id = application_id;
    } else if (email && approval_code) {
      whereClause.email = email;
      whereClause.approval_code = approval_code;
    } else {
      throw {
        statusCode: 400,
        message: 'Either application_id or both email and approval_code must be provided.'
      };
    }
    
    const application = await DealerApplication.findOne({ where: whereClause });
    
    if (!application) {
      throw {
        statusCode: 400,
        message: 'Invalid application details. Please check your information and try again.'
      };
    }
    
    // Check if dealer already exists with this application_id
    const existingDealer = await Dealer.findOne({
      where: { application_id: application.id }
    });
    
    if (existingDealer) {
      throw {
        statusCode: 409,
        message: 'A dealer account for this application already exists.'
      };
    }
    
    // Create new dealer
    const dealer = await Dealer.create({
      company_name: application.company_name,
      contact_name: application.contact_name,
      email: application.email,
      phone: application.phone,
      password_hash: password, // Will be hashed by the model hook
      address: application.address,
      tax_id: application.tax_id,
      business_type: application.business_type, // Changed from business_area
      approval_code: application.approval_code,
      application_id: application.id
    });
    
    return {
      id: dealer.id,
      company_name: dealer.company_name,
      email: dealer.email
    };
  } catch (error) {
    logger.error('Register dealer error:', error);
    throw error;
  }
};

/**
 * Authenticate a dealer and generate tokens
 */
const loginDealer = async (email, password) => {
  try {
    const { Dealer } = db.initModels();
    
    // Find dealer by email
    const dealer = await Dealer.findOne({
      where: { email }
    });
    
    if (!dealer) {
      throw {
        statusCode: 401,
        message: 'Invalid email or password'
      };
    }
    
    // Check if dealer is active
    if (!dealer.is_active) {
      throw {
        statusCode: 403,
        message: 'Your account has been deactivated. Please contact support.'
      };
    }
    
    // Verify password
    const isPasswordValid = await dealer.checkPassword(password);
    
    if (!isPasswordValid) {
      throw {
        statusCode: 401,
        message: 'Invalid email or password'
      };
    }
    
    // Update last login
    await dealer.update({
      last_login: new Date()
    });
    
    // Generate tokens
    const accessToken = generateAccessToken(dealer);
    const refreshToken = generateRefreshToken(dealer);
    
    return {
      dealer: {
        id: dealer.id,
        company_name: dealer.company_name,
        email: dealer.email
      },
      accessToken,
      refreshToken
    };
  } catch (error) {
    logger.error('Login dealer error:', error);
    throw error;
  }
};

/**
 * Get dealer profile
 */
const getDealerProfile = async (dealerId) => {
  try {
    const { Dealer } = db.initModels();
    
    const dealer = await Dealer.findByPk(dealerId, {
      attributes: { exclude: ['password_hash'] }
    });
    
    if (!dealer) {
      throw {
        statusCode: 404,
        message: 'Dealer not found'
      };
    }
    
    return dealer;
  } catch (error) {
    logger.error('Get dealer profile error:', error);
    throw error;
  }
};

/**
 * Update dealer profile
 */
const updateDealerProfile = async (dealerId, updateData) => {
  try {
    const { Dealer } = db.initModels();
    
    // Find dealer
    const dealer = await Dealer.findByPk(dealerId);
    
    if (!dealer) {
      throw {
        statusCode: 404,
        message: 'Dealer not found'
      };
    }
    
    // Update fields (only allowed fields)
    const allowedFields = ['contact_name', 'phone', 'address'];
    const updateFields = {};
    
    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        updateFields[field] = updateData[field];
      }
    });
    
    // Update password if provided
    if (updateData.password) {
      updateFields.password = updateData.password;
    }
    
    await dealer.update(updateFields);
    
    return {
      id: dealer.id,
      company_name: dealer.company_name,
      email: dealer.email,
      message: 'Profile updated successfully'
    };
  } catch (error) {
    logger.error('Update dealer profile error:', error);
    throw error;
  }
};

/**
 * Generate JWT access token
 */
const generateAccessToken = (dealer) => {
  return jwt.sign(
    {
      id: dealer.id,
      email: dealer.email,
      role: 'dealer'
    },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
};

/**
 * Generate JWT refresh token
 */
const generateRefreshToken = (dealer) => {
  return jwt.sign(
    {
      id: dealer.id,
      email: dealer.email,
      role: 'dealer',
      tokenType: 'refresh'
    },
    JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
};

/**
 * Refresh access token using refresh token
 */
const refreshToken = async (token) => {
  try {
    // Verify refresh token
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET);
    
    // Check if it's a refresh token
    if (decoded.tokenType !== 'refresh') {
      throw {
        statusCode: 401,
        message: 'Invalid token type'
      };
    }
    
    const { Dealer, TokenBlacklist } = db.initModels();
    
    // Check if token is blacklisted
    const isBlacklisted = await TokenBlacklist.findOne({
      where: { token }
    });
    
    if (isBlacklisted) {
      throw {
        statusCode: 401,
        message: 'Token has been revoked'
      };
    }
    
    // Find dealer
    const dealer = await Dealer.findByPk(decoded.id);
    
    if (!dealer || !dealer.is_active) {
      throw {
        statusCode: 401,
        message: 'Invalid token'
      };
    }
    
    // Generate new tokens
    const accessToken = generateAccessToken(dealer);
    const newRefreshToken = generateRefreshToken(dealer);
    
    return {
      accessToken,
      refreshToken: newRefreshToken
    };
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      throw {
        statusCode: 401,
        message: 'Invalid or expired token'
      };
    }
    
    logger.error('Refresh token error:', error);
    throw error;
  }
};

/**
 * Logout dealer (blacklist token)
 */
const logoutDealer = async (token) => {
  try {
    const { TokenBlacklist } = db.initModels();
    
    await TokenBlacklist.create({
      token,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    });
    
    return { message: 'Logged out successfully' };
  } catch (error) {
    logger.error('Logout dealer error:', error);
    throw error;
  }
};

/**
 * List all dealers with their application info (admin view)
 */
const listDealersWithApplications = async () => {
  try {
    const { Dealer, DealerApplication } = db.initModels();

    const dealers = await Dealer.findAll({
      attributes: {
        exclude: ['password_hash']
      },
      include: [
        {
          model: DealerApplication,
          attributes: { exclude: [] }
        }
      ],
      order: [['created_at', 'DESC']]
    });

    return dealers;
  } catch (error) {
    logger.error('List dealers error:', error);
    throw error;
  }
};

/**
 * Delete a dealer by id (admin)
 */
const deleteDealerById = async (dealerId) => {
  try {
    const { Dealer } = db.initModels();

    const dealer = await Dealer.findByPk(dealerId);

    if (!dealer) {
      const err = new Error('Dealer not found');
      err.statusCode = 404;
      throw err;
    }

    await dealer.destroy();

    return { message: 'Dealer deleted successfully' };
  } catch (error) {
    logger.error('Delete dealer error:', error);
    throw error;
  }
};

module.exports = {
  registerDealer,
  loginDealer,
  getDealerProfile,
  updateDealerProfile,
  refreshToken,
  logoutDealer,
  listDealersWithApplications,
  deleteDealerById
};
