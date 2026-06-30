const express = require('express');
const adminController = require('../controllers/admin.controller');
const { authenticateAdmin } = require('../middlewares/auth.middleware');
const { 
  validateCreateAdmin, 
  validateIdParam,
  handleValidationErrors 
} = require('../utils/validation.utils');

const router = express.Router();

// Apply authentication middleware to all admin routes
router.use(authenticateAdmin);

/**
 * @route POST /api/admin
 * @desc Create a new admin
 * @access Private (Admin only)
 */
router.post(
  '/', 
  validateCreateAdmin, 
  handleValidationErrors, 
  adminController.createAdmin
);

/**
 * @route GET /api/admin
 * @desc Get all admins
 * @access Private (Admin only)
 */
router.get('/', adminController.getAllAdmins);

/**
 * @route GET /api/admin/:id
 * @desc Get admin by ID
 * @access Private (Admin only)
 */
router.get(
  '/:id(\\d+)', 
  validateIdParam, 
  handleValidationErrors, 
  adminController.getAdminById
);

/**
 * @route PUT /api/admin/:id
 * @desc Update admin
 * @access Private (Admin only)
 */
router.put(
  '/:id(\\d+)', 
  validateIdParam, 
  handleValidationErrors, 
  adminController.updateAdmin
);

/**
 * @route DELETE /api/admin/:id
 * @desc Delete admin
 * @access Private (Admin only)
 */
router.delete(
  '/:id(\\d+)', 
  validateIdParam, 
  handleValidationErrors, 
  adminController.deleteAdmin
);

/**
 * @route POST /api/admin/change-password
 * @desc Change admin password
 * @access Private (Admin only)
 */
router.post('/change-password', adminController.changePassword);

module.exports = router;


