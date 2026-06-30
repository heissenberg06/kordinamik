const logger = require('../config/logger');

/**
 * Global error handling middleware
 */
const errorMiddleware = (err, req, res, next) => {
  // Log error
  logger.error('Unhandled error:', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });
  
  // Determine status code
  const statusCode = err.statusCode || 500;
  
  // Send error response
  res.status(statusCode).json({
    status: 'error',
    message: process.env.NODE_ENV === 'production' 
      ? 'An unexpected error occurred' 
      : err.message
  });
};

module.exports = errorMiddleware;


