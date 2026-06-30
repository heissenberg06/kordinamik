const productService = require('../services/product.service');
const { logAudit } = require('../middlewares/audit.middleware');
const logger = require('../config/logger');
const multer = require('multer');
const fs = require('fs');

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only images
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

/**
 * Create a new product
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const createProduct = async (req, res, next) => {
  try {
    const productData = req.body;
    
    // Create product
    const product = await productService.createProduct(productData);
    
    // Log action
    await logAudit(
      req, 
      'CREATE', 
      'PRODUCT', 
      product.id,
      null,
      product
    );
    
    res.status(201).json({
      status: 'success',
      data: product
    });
  } catch (error) {
    logger.error('Create product controller error:', error);
    next(error);
  }
};

/**
 * Get all products
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getAllProducts = async (req, res, next) => {
  try {
    const products = await productService.getAllProducts(req.query);
    
    res.status(200).json({
      status: 'success',
      data: {
        count: products.count,
        rows: products.rows
      }
    });
  } catch (error) {
    logger.error('Get all products controller error:', error);
    next(error);
  }
};

/**
 * Get product by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const product = await productService.getProductById(id);
    
    res.status(200).json({
      status: 'success',
      data: product
    });
  } catch (error) {
    logger.error('Get product by ID controller error:', error);
    next(error);
  }
};

/**
 * Update product
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const productData = req.body;
    
    // Get old product data for audit
    const oldProduct = await productService.getProductById(id);
    
    // Update product
    const updatedProduct = await productService.updateProduct(id, productData);
    
    // Log action
    await logAudit(
      req, 
      'UPDATE', 
      'PRODUCT', 
      id,
      oldProduct,
      updatedProduct
    );
    
    res.status(200).json({
      status: 'success',
      data: updatedProduct
    });
  } catch (error) {
    logger.error('Update product controller error:', error);
    next(error);
  }
};

/**
 * Delete product
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Get old product data for audit
    const oldProduct = await productService.getProductById(id);
    
    // Delete product
    await productService.deleteProduct(id);
    
    // Log action
    await logAudit(
      req, 
      'DELETE', 
      'PRODUCT', 
      id,
      oldProduct,
      null
    );
    
    res.status(200).json({
      status: 'success',
      message: 'Product deleted successfully'
    });
  } catch (error) {
    logger.error('Delete product controller error:', error);
    next(error);
  }
};

/**
 * Upload product image
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const uploadProductImage = async (req, res, next) => {
  // Single file upload middleware
  upload.single('image')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        status: 'error',
        message: err.message
      });
    }
    
    try {
      const { id } = req.params;
      const { is_primary } = req.body;
      
      if (!req.file) {
        return res.status(400).json({
          status: 'error',
          message: 'No image file provided'
        });
      }
      
      // Create image data
      const imageData = {
        image_data: req.file.buffer,
        image_name: req.file.originalname,
        image_type: req.file.mimetype,
        is_primary: is_primary === 'true'
      };
      
      // Add image to product
      const image = await productService.addProductImage(id, imageData);
      
      // Log action
      await logAudit(
        req, 
        'UPLOAD_IMAGE', 
        'PRODUCT', 
        id,
        null,
        { image_id: image.id, is_primary: image.is_primary }
      );
      
      res.status(201).json({
        status: 'success',
        data: {
          id: image.id,
          product_id: image.product_id,
          image_name: image.image_name,
          image_type: image.image_type,
          is_primary: image.is_primary,
          created_at: image.created_at
        }
      });
    } catch (error) {
      logger.error('Upload product image controller error:', error);
      next(error);
    }
  });
};

/**
 * Delete product image
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const deleteProductImage = async (req, res, next) => {
  try {
    const { id, imageId } = req.params;
    
    // Delete image
    await productService.deleteProductImage(id, imageId);
    
    // Log action
    await logAudit(
      req, 
      'DELETE_IMAGE', 
      'PRODUCT', 
      id,
      { image_id: imageId },
      null
    );
    
    res.status(200).json({
      status: 'success',
      message: 'Product image deleted successfully'
    });
  } catch (error) {
    logger.error('Delete product image controller error:', error);
    next(error);
  }
};

/**
 * Upload technical details image for product
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const uploadTechnicalDetailsImage = (req, res, next) => {
  upload.single('technical_details_image')(req, res, async (err) => {
    if (err) {
      logger.error('Technical details image upload error:', err);
      return res.status(400).json({
        status: 'error',
        message: err.message
      });
    }
    
    try {
      const { id } = req.params;
      
      if (!req.file) {
        return res.status(400).json({
          status: 'error',
          message: 'No technical details image file provided'
        });
      }
      
      // Update product with technical details image
      const imageData = {
        technical_details_image: req.file.buffer,
        technical_details_image_type: req.file.mimetype
      };
      
      await productService.updateProduct(id, imageData);
      
      // Log action
      await logAudit(
        req, 
        'UPLOAD_TECHNICAL_IMAGE', 
        'PRODUCT', 
        id,
        null,
        { image_name: req.file.originalname, image_type: req.file.mimetype }
      );
      
      res.status(200).json({
        status: 'success',
        message: 'Technical details image uploaded successfully'
      });
    } catch (error) {
      logger.error('Upload technical details image controller error:', error);
      next(error);
    }
  });
};

/**
 * Upload cover photo for product
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const uploadCoverPhoto = (req, res, next) => {
  upload.single('cover_photo')(req, res, async (err) => {
    if (err) {
      logger.error('Cover photo upload error:', err);
      return res.status(400).json({
        status: 'error',
        message: err.message
      });
    }
    
    try {
      const { id } = req.params;
      
      if (!req.file) {
        return res.status(400).json({
          status: 'error',
          message: 'No cover photo file provided'
        });
      }
      
      // Create or update cover photo as primary image
      const imageData = {
        image_data: req.file.buffer,
        image_name: req.file.originalname,
        image_type: req.file.mimetype,
        is_primary: true
      };
      
      // First, set all existing images as non-primary
      await productService.setAllImagesNonPrimary(id);
      
      // Add new cover photo as primary
      const image = await productService.addProductImage(id, imageData);
      
      // Log action
      await logAudit(
        req, 
        'UPLOAD_COVER_PHOTO', 
        'PRODUCT', 
        id,
        null,
        { image_id: image.id, image_name: req.file.originalname }
      );
      
      res.status(200).json({
        status: 'success',
        message: 'Cover photo uploaded successfully',
        data: {
          id: image.id,
          product_id: image.product_id,
          image_name: image.image_name,
          image_type: image.image_type,
          is_primary: image.is_primary,
          created_at: image.created_at
        }
      });
    } catch (error) {
      logger.error('Upload cover photo controller error:', error);
      next(error);
    }
  });
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  deleteProductImage,
  uploadTechnicalDetailsImage,
  uploadCoverPhoto
};


