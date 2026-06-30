const { Op } = require('sequelize');
const db = require('../config/db');
const logger = require('../config/logger');

const createRegistration = async ({ product_id, full_name, phone, email }) => {
  try {
    const { Product, WarrantyRegistration } = db.initModels();
    const product = await Product.findByPk(product_id);
    if (!product) throw { statusCode: 400, message: 'Product not found' };

    const registration = await WarrantyRegistration.create({
      product_id,
      full_name,
      phone,
      email
    });
    return registration;
  } catch (error) {
    logger.error('Create warranty registration error:', error);
    throw error;
  }
};

const listRegistrations = async (query = {}) => {
  try {
    const { WarrantyRegistration, Product } = db.initModels();
    const {
      product_id,
      start_date,
      end_date,
      limit = 20,
      offset = 0,
      sort_by = 'created_at',
      sort_dir = 'DESC'
    } = query;

    const where = {};
    if (product_id) where.product_id = product_id;
    if (start_date || end_date) {
      where.created_at = {};
      if (start_date) where.created_at[Op.gte] = new Date(start_date);
      if (end_date) where.created_at[Op.lte] = new Date(end_date);
    }

    return await WarrantyRegistration.findAndCountAll({
      where,
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
      order: [[sort_by, sort_dir]],
      include: [{ model: Product, attributes: ['id', 'name', 'model'] }]
    });
  } catch (error) {
    logger.error('List warranty registrations error:', error);
    throw error;
  }
};

const getRegistrationById = async (id) => {
  try {
    const { WarrantyRegistration, Product } = db.initModels();
    const registration = await WarrantyRegistration.findByPk(id, {
      include: [{ model: Product, attributes: ['id', 'name', 'model'] }]
    });
    if (!registration) throw { statusCode: 404, message: 'Warranty registration not found' };
    return registration;
  } catch (error) {
    logger.error('Get warranty registration error:', error);
    throw error;
  }
};

module.exports = {
  createRegistration,
  listRegistrations,
  getRegistrationById
};
