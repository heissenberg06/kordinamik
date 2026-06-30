const express = require('express');
const dealerOrderController = require('../controllers/dealer-order.controller');
const { authenticateDealer } = require('../middlewares/dealer-auth.middleware');

const router = express.Router();

router.use(authenticateDealer);

router.post('/', dealerOrderController.createOrder);
router.get('/', dealerOrderController.getMyOrders);

module.exports = router;

