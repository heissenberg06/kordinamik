const orderService = require('../services/order.service');
const logger = require('../config/logger');

const getOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getAllOrders(req.query);
    res.status(200).json({
      status: 'success',
      data: {
        count: orders.count,
        rows: orders.rows
      }
    });
  } catch (error) {
    logger.error('Get orders controller error:', error);
    next(error);
  }
};

const getOrdersSummary = async (req, res, next) => {
  try {
    const summary = await orderService.getOrdersSummary(req.query);
    res.status(200).json({
      status: 'success',
      data: summary
    });
  } catch (error) {
    logger.error('Get orders summary controller error:', error);
    next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const order = await orderService.getOrderById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: order
    });
  } catch (error) {
    logger.error('Get order by id controller error:', error);
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const updatedOrder = await orderService.updateOrderStatus(req.params.id, status);
    res.status(200).json({
      status: 'success',
      message: 'Sipariş durumu güncellendi.',
      data: updatedOrder
    });
  } catch (error) {
    logger.error('Update order status controller error:', error);
    next(error);
  }
};

module.exports = {
  getOrders,
  getOrderById,
  updateOrderStatus,
  getOrdersSummary
};

