const dealerService = require('../services/dealer.service');
const logger = require('../config/logger');

/**
 * Get all registered dealers with application details
 */
const getAllDealers = async (req, res, next) => {
  try {
    const dealers = await dealerService.listDealersWithApplications();

    res.status(200).json({
      status: 'success',
      data: dealers
    });
  } catch (error) {
    logger.error('Get all dealers (admin) error:', error);
    next(error);
  }
};

/**
 * Delete a dealer (admin)
 */
const deleteDealer = async (req, res, next) => {
  try {
    const { id } = req.params;
    await dealerService.deleteDealerById(id);

    res.status(200).json({
      status: 'success',
      message: 'Dealer deleted successfully'
    });
  } catch (error) {
    logger.error('Delete dealer (admin) error:', error);
    next(error);
  }
};

module.exports = {
  getAllDealers,
  deleteDealer
};

