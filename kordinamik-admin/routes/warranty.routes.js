const express = require('express');
const warrantyController = require('../controllers/warranty.controller');
const { authenticateAdmin } = require('../middlewares/auth.middleware');

const router = express.Router();

// Public submission
router.post('/', warrantyController.createWarrantyRegistration);

// Admin endpoints
router.get('/', authenticateAdmin, warrantyController.listWarrantyRegistrations);
router.get('/:id', authenticateAdmin, warrantyController.getWarrantyRegistrationById);

module.exports = router;
