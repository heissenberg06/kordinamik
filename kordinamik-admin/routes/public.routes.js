const express = require('express');
const publicController = require('../controllers/public.controller');
const dealerApplicationController = require('../controllers/dealer-application.controller');

const router = express.Router();

// Public product routes
router.get('/products', publicController.getPublicProducts);
router.get('/products/:id', publicController.getPublicProductById);

// Dealer application route
router.post('/dealer-applications', dealerApplicationController.createDealerApplication);

module.exports = router;