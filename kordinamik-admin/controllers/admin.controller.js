const adminService = require('../services/admin.service');
const { logAudit } = require('../middlewares/audit.middleware');
const logger = require('../config/logger');

/**
 * Create a new admin
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const createAdmin = async (req, res, next) => {
  try {
    const adminData = req.body;
    
    // Create admin
    const admin = await adminService.createAdmin(adminData);
    
    // Log action
    await logAudit(
      req, 
      'CREATE', 
      'ADMIN', 
      admin.id,
      null,
      admin
    );
    
    res.status(201).json({
      status: 'success',
      data: admin
    });
  } catch (error) {
    logger.error('Create admin controller error:', error);
    next(error);
  }
};

/**
 * Get all admins
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getAllAdmins = async (req, res, next) => {
  try {
    const admins = await adminService.getAllAdmins();
    
    res.status(200).json({
      status: 'success',
      data: admins
    });
  } catch (error) {
    logger.error('Get all admins controller error:', error);
    next(error);
  }
};

/**
 * Get admin by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getAdminById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const admin = await adminService.getAdminById(id);
    
    res.status(200).json({
      status: 'success',
      data: admin
    });
  } catch (error) {
    logger.error('Get admin by ID controller error:', error);
    next(error);
  }
};

/**
 * Update admin
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const updateAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const adminData = req.body;
    
    // Get old admin data for audit
    const oldAdmin = await adminService.getAdminById(id);
    
    // Update admin
    const updatedAdmin = await adminService.updateAdmin(id, adminData);
    
    // Log action
    await logAudit(
      req, 
      'UPDATE', 
      'ADMIN', 
      id,
      oldAdmin,
      updatedAdmin
    );
    
    res.status(200).json({
      status: 'success',
      data: updatedAdmin
    });
  } catch (error) {
    logger.error('Update admin controller error:', error);
    next(error);
  }
};

/**
 * Delete admin
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const deleteAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Get old admin data for audit
    const oldAdmin = await adminService.getAdminById(id);
    
    // Delete admin
    await adminService.deleteAdmin(id);
    
    // Log action
    await logAudit(
      req, 
      'DELETE', 
      'ADMIN', 
      id,
      oldAdmin,
      null
    );
    
    res.status(200).json({
      status: 'success',
      message: 'Admin deleted successfully'
    });
  } catch (error) {
    logger.error('Delete admin controller error:', error);
    next(error);
  }
};

/**
 * Change admin password
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Change password
    await adminService.changePassword(req.admin.id, currentPassword, newPassword);
    
    // Log action
    await logAudit(
      req, 
      'CHANGE_PASSWORD', 
      'ADMIN', 
      req.admin.id,
      null,
      null
    );
    
    res.status(200).json({
      status: 'success',
      message: 'Password changed successfully'
    });
  } catch (error) {
    logger.error('Change password controller error:', error);
    next(error);
  }
};

module.exports = {
  createAdmin,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  changePassword
};


