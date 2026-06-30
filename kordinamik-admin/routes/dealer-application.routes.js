const express = require('express');
const dealerApplicationController = require('../controllers/dealer-application.controller');
const { authenticateAdmin } = require('../middlewares/auth.middleware');
const { createAuditMiddleware } = require('../middlewares/audit.middleware');
const { validateIdParam, handleValidationErrors } = require('../utils/validation.utils');

const router = express.Router();

// Apply authentication middleware to all dealer application routes
router.use(authenticateAdmin);

// Apply audit middleware
router.use(createAuditMiddleware('DEALER_APPLICATION'));

/**
 * @route GET /api/dealer-applications
 * @desc Get all dealer applications
 * @access Private (Admin only)
 */
router.get('/', dealerApplicationController.getAllDealerApplications);

/**
 * @route GET /api/dealer-applications/:id
 * @desc Get dealer application by ID
 * @access Private (Admin only)
 */
router.get(
  '/:id', 
  validateIdParam, 
  handleValidationErrors, 
  dealerApplicationController.getDealerApplicationById
);

/**
 * @route POST /api/dealer-applications
 * @desc Create dealer application (public endpoint)
 * @access Public
 */
// This route is defined separately as a public endpoint

/**
 * @route POST /api/dealer-applications/:id/approve
 * @desc Approve dealer application
 * @access Private (Admin only)
 */
router.post(
  '/:id/approve', 
  validateIdParam, 
  handleValidationErrors, 
  dealerApplicationController.approveDealerApplication
);

/**
 * @route POST /api/dealer-applications/:id/reject
 * @desc Reject dealer application
 * @access Private (Admin only)
 */
router.post(
  '/:id/reject', 
  validateIdParam, 
  handleValidationErrors, 
  dealerApplicationController.rejectDealerApplication
);

module.exports = router;
