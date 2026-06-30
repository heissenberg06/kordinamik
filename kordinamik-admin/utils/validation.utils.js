const { body, param, query, validationResult } = require('express-validator');

/**
 * Validate admin login request
 */
const validateLogin = [
  body('username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3, max: 50 }).withMessage('Username must be between 3 and 50 characters'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

/**
 * Validate admin creation request
 */
const validateCreateAdmin = [
  body('username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3, max: 50 }).withMessage('Username must be between 3 and 50 characters'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/).withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Email must be valid'),
  body('full_name')
    .trim()
    .notEmpty().withMessage('Full name is required')
];

/**
 * Validate product creation request
 */
const validateCreateProduct = [
  body('name')
    .trim()
    .notEmpty().withMessage('Product name is required'),
  body('model')
    .trim()
    .notEmpty().withMessage('Model is required'),
  body('price')
    .isNumeric().withMessage('Price must be a number')
    .isFloat({ min: 0 }).withMessage('Price cannot be negative'),
  body('stock')
    .optional()
    .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  body('category_id')
    .optional()
    .isInt().withMessage('Category ID must be an integer'),
  body('features')
    .optional()
    .isObject().withMessage('Features must be an object'),
  body('warranty_months')
    .optional()
    .isInt({ min: 0 }).withMessage('Warranty months must be a non-negative integer')
];

/**
 * Validate ID parameter
 */
const validateIdParam = [
  param('id')
    .isInt().withMessage('ID must be an integer')
];

/**
 * Handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      status: 'error',
      errors: errors.array() 
    });
  }
  next();
};

module.exports = {
  validateLogin,
  validateCreateAdmin,
  validateCreateProduct,
  validateIdParam,
  handleValidationErrors
};


