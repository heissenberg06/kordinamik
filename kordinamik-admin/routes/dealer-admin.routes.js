const express = require('express');
const dealerAdminController = require('../controllers/dealer-admin.controller');
const { authenticateAdmin } = require('../middlewares/auth.middleware');

const router = express.Router();

// Admin-only: list all dealers
router.use(authenticateAdmin);
router.get('/', dealerAdminController.getAllDealers);
router.delete('/:id', dealerAdminController.deleteDealer);

module.exports = router;

