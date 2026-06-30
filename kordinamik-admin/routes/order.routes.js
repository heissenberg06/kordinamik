const express = require('express');
const orderController = require('../controllers/order.controller');
const { authenticateAdmin } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(authenticateAdmin);

router.get('/', orderController.getOrders);
router.get('/summary', orderController.getOrdersSummary);
// Constrain id to numeric to avoid conflicts with named routes (e.g., /summary)
router.get('/:id(\\d+)', orderController.getOrderById);
router.post('/:id(\\d+)/status', orderController.updateOrderStatus);

module.exports = router;

