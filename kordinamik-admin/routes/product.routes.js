const express = require('express');
const productController = require('../controllers/product.controller');
const { authenticateAdmin } = require('../middlewares/auth.middleware');
const { createAuditMiddleware } = require('../middlewares/audit.middleware');
const { 
  validateCreateProduct, 
  validateIdParam,
  handleValidationErrors 
} = require('../utils/validation.utils');

const router = express.Router();

// Apply authentication middleware to all product routes
router.use(authenticateAdmin);

// Apply audit middleware
router.use(createAuditMiddleware('PRODUCT'));

/**
 * @route POST /api/products
 * @desc Create a new product
 * @access Private (Admin only)
 */
router.post(
  '/', 
  validateCreateProduct, 
  handleValidationErrors, 
  productController.createProduct
);

/**
 * @route GET /api/products
 * @desc Get all products
 * @access Private (Admin only)
 */
router.get('/', productController.getAllProducts);

/**
 * @route GET /api/products/:id
 * @desc Get product by ID
 * @access Private (Admin only)
 */
router.get(
  '/:id', 
  validateIdParam, 
  handleValidationErrors, 
  productController.getProductById
);

/**
 * @route PUT /api/products/:id
 * @desc Update product
 * @access Private (Admin only)
 */
router.put(
  '/:id', 
  validateIdParam, 
  handleValidationErrors, 
  productController.updateProduct
);

/**
 * @route DELETE /api/products/:id
 * @desc Delete product
 * @access Private (Admin only)
 */
router.delete(
  '/:id', 
  validateIdParam, 
  handleValidationErrors, 
  productController.deleteProduct
);

/**
 * @route POST /api/products/:id/images
 * @desc Upload product image
 * @access Private (Admin only)
 */
router.post(
  '/:id/images', 
  validateIdParam, 
  handleValidationErrors, 
  productController.uploadProductImage
);

/**
 * @route DELETE /api/products/:id/images/:imageId
 * @desc Delete product image
 * @access Private (Admin only)
 */
router.delete(
  '/:id/images/:imageId', 
  validateIdParam, 
  handleValidationErrors, 
  productController.deleteProductImage
);

/**
 * @route POST /api/products/:id/technical-details-image
 * @desc Upload technical details image for product
 * @access Private (Admin only)
 */
router.post(
  '/:id/technical-details-image', 
  validateIdParam, 
  handleValidationErrors, 
  productController.uploadTechnicalDetailsImage
);

/**
 * @route POST /api/products/:id/cover-photo
 * @desc Upload cover photo for product
 * @access Private (Admin only)
 */
router.post(
  '/:id/cover-photo', 
  validateIdParam, 
  handleValidationErrors, 
  productController.uploadCoverPhoto
);

module.exports = router;


