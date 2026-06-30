const express = require('express');
const dealerController = require('../controllers/dealer.controller');
const dealerAuthMiddleware = require('../middlewares/dealer-auth.middleware');

const router = express.Router();

// Public routes
router.post('/register', dealerController.registerDealer);
router.post('/login', dealerController.loginDealer);
router.post('/refresh-token', dealerController.refreshToken);
router.post('/logout', dealerController.logoutDealer);

// Protected routes (require authentication)
router.use(dealerAuthMiddleware.authenticateDealer);
router.get('/profile', dealerController.getDealerProfile);
router.put('/profile', dealerController.updateDealerProfile);

module.exports = router;
