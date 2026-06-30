const orderService = require('../services/order.service');
const logger = require('../config/logger');

const createOrder = async (req, res, next) => {
  try {
    const { items, note } = req.body;
    const order = await orderService.createOrder(req.dealer.id, items, note);

    res.status(201).json({
      status: 'success',
      message: 'Sipariş oluşturuldu.',
      data: order
    });
  } catch (error) {
    logger.error('Create dealer order controller error:', error);
    next(error);
  }
};

const getMyOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getDealerOrders(req.dealer.id);
    res.status(200).json({
      status: 'success',
      data: orders
    });
  } catch (error) {
    logger.error('Get dealer orders controller error:', error);
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders
};

