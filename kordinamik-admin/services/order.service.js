const db = require('../config/db');
const logger = require('../config/logger');
const { Op } = require('sequelize');

const { sequelize } = db;

const VALID_STATUSES = ['pending', 'approved', 'rejected'];

/**
 * Create order for dealer
 */
const createOrder = async (dealerId, items = [], note = null) => {
  if (!Array.isArray(items) || items.length === 0) {
    throw { statusCode: 400, message: 'En az bir ürün eklenmelidir.' };
  }

  try {
    const { Product, Order, OrderItem } = db.initModels();

    const productIds = items.map((item) => item.product_id);
    const products = await Product.findAll({ where: { id: productIds } });
    const productMap = new Map(products.map((p) => [p.id, p]));

    const missingProducts = productIds.filter((id) => !productMap.has(id));
    if (missingProducts.length > 0) {
      throw { statusCode: 404, message: 'Ürün bulunamadı.' };
    }

    return await sequelize.transaction(async (t) => {
      let totalAmount = 0;

      const orderItemsPayload = items.map((item) => {
        const quantity = parseInt(item.quantity, 10);
        if (!quantity || quantity < 1) {
          throw { statusCode: 400, message: 'Adet 1 veya üzeri olmalıdır.' };
        }

        const product = productMap.get(item.product_id);
        const unitPrice = Number(product.price || 0);
        const lineTotal = Number((unitPrice * quantity).toFixed(2));
        totalAmount += lineTotal;

        return {
          product_id: product.id,
          quantity,
          unit_price: unitPrice,
          total_price: lineTotal
        };
      });

      const order = await Order.create(
        {
          dealer_id: dealerId,
          total_amount: Number(totalAmount.toFixed(2)),
          status: 'pending',
          note: note || null
        },
        { transaction: t }
      );

      await OrderItem.bulkCreate(
        orderItemsPayload.map((item) => ({
          ...item,
          order_id: order.id
        })),
        { transaction: t }
      );

      return await getOrderById(order.id, { transaction: t });
    });
  } catch (error) {
    logger.error('Create order error:', error);
    throw error;
  }
};

/**
 * Get single order with relations
 */
const getOrderById = async (id, options = {}) => {
  const { Order, OrderItem, Dealer, Product } = db.initModels();
  const order = await Order.findByPk(id, {
    include: [
      { model: Dealer, attributes: ['id', 'company_name', 'email', 'phone'] },
      { model: OrderItem, include: [{ model: Product, attributes: ['id', 'name', 'model'] }] }
    ],
    transaction: options.transaction
  });

  if (!order) {
    throw { statusCode: 404, message: 'Sipariş bulunamadı.' };
  }

  return order;
};

/**
 * Get orders belonging to dealer
 */
const getDealerOrders = async (dealerId) => {
  try {
    const { Order, OrderItem, Product } = db.initModels();
    return await Order.findAll({
      where: { dealer_id: dealerId },
      include: [
        {
          model: OrderItem,
          include: [{ model: Product, attributes: ['id', 'name', 'model'] }]
        }
      ],
      order: [['created_at', 'DESC']]
    });
  } catch (error) {
    logger.error('Get dealer orders error:', error);
    throw error;
  }
};

/**
 * Admin list orders
 */
const getAllOrders = async (query = {}) => {
  try {
    const { Order, Dealer, OrderItem, Product } = db.initModels();
    const {
      status,
      limit = 20,
      offset = 0,
      sort_by = 'created_at',
      sort_dir = 'DESC',
      last_days
    } = query;

    const where = {};
    if (status && VALID_STATUSES.includes(status)) {
      where.status = status;
    }
    if (last_days) {
      const days = parseInt(last_days, 10);
      if (!isNaN(days) && days > 0) {
        const fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - days);
        where.created_at = { [Op.gte]: fromDate };
      }
    }

    const orders = await Order.findAndCountAll({
      where,
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
      order: [[sort_by, sort_dir]],
      include: [
        { model: Dealer, attributes: ['id', 'company_name', 'email', 'phone'] },
        {
          model: OrderItem,
          include: [{ model: Product, attributes: ['id', 'name', 'model'] }]
        }
      ]
    });

    return orders;
  } catch (error) {
    logger.error('Get all orders error:', error);
    throw error;
  }
};

/**
 * Update order status (admin)
 */
const updateOrderStatus = async (orderId, status) => {
  if (!VALID_STATUSES.includes(status)) {
    throw { statusCode: 400, message: 'Geçersiz sipariş durumu.' };
  }

  try {
    const { Order } = db.initModels();
    const order = await Order.findByPk(orderId);
    if (!order) {
      throw { statusCode: 404, message: 'Sipariş bulunamadı.' };
    }

    order.status = status;
    await order.save();

    return getOrderById(orderId);
  } catch (error) {
    logger.error('Update order status error:', error);
    throw error;
  }
};

/**
 * Summary totals for orders within time window
 */
const getOrdersSummary = async (query = {}) => {
  try {
    const { Order } = db.initModels();
    const { status, last_days } = query;
    const where = {};

    if (status && VALID_STATUSES.includes(status)) {
      where.status = status;
    }

    if (last_days) {
      const days = parseInt(last_days, 10);
      if (!isNaN(days) && days > 0) {
        const fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - days);
        where.created_at = { [Op.gte]: fromDate };
      }
    }

    const [count, totalAmount] = await Promise.all([
      Order.count({ where }),
      Order.sum('total_amount', { where })
    ]);

    return {
      count,
      total_amount: Number(totalAmount || 0)
    };
  } catch (error) {
    logger.error('Get orders summary error:', error);
    throw error;
  }
};

module.exports = {
  createOrder,
  getDealerOrders,
  getAllOrders,
  updateOrderStatus,
  getOrderById,
  getOrdersSummary
};

