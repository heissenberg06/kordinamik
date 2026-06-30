const warrantyService = require('../services/warranty.service');
const logger = require('../config/logger');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const createWarrantyRegistration = async (req, res, next) => {
  try {
    const { product_id, full_name, phone, email } = req.body || {};
    if (!product_id || !full_name || !phone || !email) {
      return res.status(400).json({ status: 'error', message: 'product_id, full_name, phone, email zorunlu' });
    }
    if (!emailRegex.test(email)) {
      return res.status(400).json({ status: 'error', message: 'Geçersiz email' });
    }
    const registration = await warrantyService.createRegistration({ product_id, full_name, phone, email });
    return res.status(201).json({
      status: 'success',
      data: {
        id: registration.id,
        product_id: registration.product_id,
        full_name: registration.full_name,
        phone: registration.phone,
        email: registration.email,
        created_at: registration.created_at
      }
    });
  } catch (error) {
    logger.error('Create warranty registration controller error:', error);
    if (error.statusCode) {
      return res.status(error.statusCode).json({ status: 'error', message: error.message });
    }
    next(error);
  }
};

const listWarrantyRegistrations = async (req, res, next) => {
  try {
    const registrations = await warrantyService.listRegistrations(req.query);
    return res.status(200).json({
      status: 'success',
      data: {
        count: registrations.count,
        rows: registrations.rows
      }
    });
  } catch (error) {
    logger.error('List warranty registrations controller error:', error);
    if (error.statusCode) {
      return res.status(error.statusCode).json({ status: 'error', message: error.message });
    }
    next(error);
  }
};

const getWarrantyRegistrationById = async (req, res, next) => {
  try {
    const registration = await warrantyService.getRegistrationById(req.params.id);
    return res.status(200).json({
      status: 'success',
      data: registration
    });
  } catch (error) {
    logger.error('Get warranty registration controller error:', error);
    if (error.statusCode) {
      return res.status(error.statusCode).json({ status: 'error', message: error.message });
    }
    next(error);
  }
};

module.exports = {
  createWarrantyRegistration,
  listWarrantyRegistrations,
  getWarrantyRegistrationById
};
