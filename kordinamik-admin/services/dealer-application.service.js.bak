const db = require('../config/db');
const logger = require('../config/logger');
const { generateApprovalCode } = require('../utils/code.utils');

/**
 * Get all dealer applications
 * @param {Object} query - Query parameters
 * @returns {Promise<Array>} Array of dealer applications
 */
const getAllDealerApplications = async (query = {}) => {
  try {
    const { DealerApplication, Admin } = db.initModels();
    
    const { 
      status, 
      limit = 10, 
      offset = 0,
      sort_by = 'created_at',
      sort_dir = 'DESC'
    } = query;
    
    // Build where clause
    const where = {};
    if (status) {
      where.status = status;
    }
    
    // Get applications
    const applications = await DealerApplication.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sort_by, sort_dir]],
      include: [
        { 
          model: Admin, 
          as: 'Admin',
          attributes: ['id', 'username', 'full_name'] 
        }
      ]
    });
    
    return applications;
  } catch (error) {
    logger.error('Get all dealer applications error:', error);
    throw error;
  }
};

/**
 * Get dealer application by ID
 * @param {Number} id - Dealer application ID
 * @returns {Promise<Object>} Dealer application
 */
const getDealerApplicationById = async (id) => {
  try {
    const { DealerApplication, Admin } = db.initModels();
    
    const application = await DealerApplication.findByPk(id, {
      include: [
        { 
          model: Admin, 
          as: 'Admin',
          attributes: ['id', 'username', 'full_name'] 
        }
      ]
    });
    
    if (!application) {
      throw { statusCode: 404, message: 'Dealer application not found' };
    }
    
    return application;
  } catch (error) {
    logger.error('Get dealer application by ID error:', error);
    throw error;
  }
};

/**
 * Create dealer application
 * @param {Object} applicationData - Dealer application data
 * @returns {Promise<Object>} Created dealer application
 */
const createDealerApplication = async (applicationData) => {
  try {
    const { DealerApplication } = db.initModels();
    
    // Check if email already exists
    const existingApplication = await DealerApplication.findOne({
      where: { email: applicationData.email }
    });
    
    if (existingApplication) {
      throw { statusCode: 400, message: 'An application with this email already exists' };
    }
    
    // Create application
    const application = await DealerApplication.create(applicationData);
    
    return application;
  } catch (error) {
    logger.error('Create dealer application error:', error);
    throw error;
  }
};

/**
 * Update dealer application status
 * @param {Number} id - Dealer application ID
 * @param {String} status - New status ('approved' or 'rejected')
 * @param {Number} adminId - Admin ID who approved/rejected
 * @returns {Promise<Object>} Updated dealer application
 */
const updateDealerApplicationStatus = async (id, status, adminId) => {
  try {
    const { DealerApplication } = db.initModels();
    
    const application = await DealerApplication.findByPk(id);
    
    if (!application) {
      throw { statusCode: 404, message: 'Dealer application not found' };
    }
    
    // Update status
    const updateData = {
      status,
      approved_by: adminId,
      approved_at: new Date()
    };
    
    // Generate approval code if approved
    if (status === 'approved') {
      updateData.approval_code = generateApprovalCode();
    }
    
    await application.update(updateData);
    
    return await getDealerApplicationById(id);
  } catch (error) {
    logger.error('Update dealer application status error:', error);
    throw error;
  }
};

module.exports = {
  getAllDealerApplications,
  getDealerApplicationById,
  createDealerApplication,
  updateDealerApplicationStatus
};
