const dealerApplicationService = require('../services/dealer-application.service');
const { logAudit } = require('../middlewares/audit.middleware');
const logger = require('../config/logger');

/**
 * Get all dealer applications
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getAllDealerApplications = async (req, res, next) => {
  try {
    const applications = await dealerApplicationService.getAllDealerApplications(req.query);
    
    res.status(200).json({
      status: 'success',
      data: {
        count: applications.count,
        rows: applications.rows
      }
    });
  } catch (error) {
    logger.error('Get all dealer applications controller error:', error);
    next(error);
  }
};

/**
 * Get dealer application by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getDealerApplicationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const application = await dealerApplicationService.getDealerApplicationById(id);
    
    res.status(200).json({
      status: 'success',
      data: application
    });
  } catch (error) {
    logger.error('Get dealer application by ID controller error:', error);
    next(error);
  }
};

/**
 * Create dealer application
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const createDealerApplication = async (req, res, next) => {
  try {
    const applicationData = req.body;
    
    // Validate required fields
    const requiredFields = [
      'company_name', 'company_title', 'tax_office', 'tax_id',
      'contact_name', 'email', 'phone', 'address', 'city', 'business_type'
    ];
    
    const missingFields = requiredFields.filter(field => !applicationData[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        status: 'error',
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(applicationData.email)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid email format'
      });
    }
    
    // Create application
    const application = await dealerApplicationService.createDealerApplication(applicationData);
    
    res.status(201).json({
      status: 'success',
      message: 'Dealer application submitted successfully',
      data: {
        id: application.id,
        company_name: application.company_name,
        email: application.email,
        status: application.status,
        created_at: application.created_at
      }
    });
  } catch (error) {
    logger.error('Create dealer application controller error:', error);
    next(error);
  }
};

/**
 * Approve dealer application
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const approveDealerApplication = async (req, res, next) => {
  try {
    const { id } = req.params;
    const adminId = req.admin.id;
    
    // Get old application data for audit
    const oldApplication = await dealerApplicationService.getDealerApplicationById(id);
    
    // Approve application
    const updatedApplication = await dealerApplicationService.updateDealerApplicationStatus(id, 'approved', adminId);
    
    // Log action
    await logAudit(
      req, 
      'APPROVE', 
      'DEALER_APPLICATION', 
      id,
      oldApplication,
      updatedApplication
    );
    
    res.status(200).json({
      status: 'success',
      data: updatedApplication
    });
  } catch (error) {
    logger.error('Approve dealer application controller error:', error);
    next(error);
  }
};

/**
 * Reject dealer application
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const rejectDealerApplication = async (req, res, next) => {
  try {
    const { id } = req.params;
    const adminId = req.admin.id;
    
    // Get old application data for audit
    const oldApplication = await dealerApplicationService.getDealerApplicationById(id);
    
    // Reject application
    const updatedApplication = await dealerApplicationService.updateDealerApplicationStatus(id, 'rejected', adminId);
    
    // Log action
    await logAudit(
      req, 
      'REJECT', 
      'DEALER_APPLICATION', 
      id,
      oldApplication,
      updatedApplication
    );
    
    res.status(200).json({
      status: 'success',
      data: updatedApplication
    });
  } catch (error) {
    logger.error('Reject dealer application controller error:', error);
    next(error);
  }
};

module.exports = {
  getAllDealerApplications,
  getDealerApplicationById,
  createDealerApplication,
  approveDealerApplication,
  rejectDealerApplication
};
