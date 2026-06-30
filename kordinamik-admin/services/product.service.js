const db = require('../config/db');
const logger = require('../config/logger');

/**
 * Create a new product
 * @param {Object} productData - Product data
 * @returns {Object} Created product
 */
const createProduct = async (productData) => {
  try {
    const { Category, Product } = db.initModels();
    // Check if category exists if provided
    if (productData.category_id) {
      const category = await Category.findByPk(productData.category_id);
      if (!category) {
        throw { statusCode: 400, message: 'Category not found' };
      }
    }
    
    // Create product
    const product = await Product.create(productData);
    
    return product;
  } catch (error) {
    logger.error('Create product error:', error);
    throw error;
  }
};

/**
 * Get all products
 * @param {Object} query - Query parameters
 * @returns {Array} Array of products
 */
const getAllProducts = async (query = {}) => {
  try {
    const { Product, Category, ProductImage } = db.initModels();
    const { 
      category_id, 
      is_active, 
      limit = 10, 
      offset = 0,
      sort_by = 'created_at',
      sort_dir = 'DESC'
    } = query;
    
    // Build where clause
    const where = {};
    if (category_id) where.category_id = category_id;
    if (is_active !== undefined) where.is_active = is_active === 'true';
    
    // Get products
    const products = await Product.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sort_by, sort_dir]],
      include: [
        { model: Category },
        { model: ProductImage, where: { is_primary: true }, required: false }
      ]
    });
    
    return products;
  } catch (error) {
    logger.error('Get all products error:', error);
    throw error;
  }
};

/**
 * Get product by ID
 * @param {Number} id - Product ID
 * @returns {Object} Product data
 */
const getProductById = async (id) => {
  try {
    const { Product, Category, ProductImage } = db.initModels();
    const product = await Product.findByPk(id, {
      include: [
        { model: Category },
        { model: ProductImage }
      ]
    });
    
    if (!product) {
      throw { statusCode: 404, message: 'Product not found' };
    }
    
    return product;
  } catch (error) {
    logger.error('Get product by ID error:', error);
    throw error;
  }
};

/**
 * Update product
 * @param {Number} id - Product ID
 * @param {Object} productData - Product data to update
 * @returns {Object} Updated product
 */
const updateProduct = async (id, productData) => {
  try {
    const { Product, Category } = db.initModels();
    const product = await Product.findByPk(id);
    
    if (!product) {
      throw { statusCode: 404, message: 'Product not found' };
    }
    
    // Check if category exists if provided
    if (productData.category_id) {
      const category = await Category.findByPk(productData.category_id);
      if (!category) {
        throw { statusCode: 400, message: 'Category not found' };
      }
    }
    
    // Update product
    await product.update(productData);
    
    // Get updated product with associations
    const updatedProduct = await getProductById(id);
    
    return updatedProduct;
  } catch (error) {
    logger.error('Update product error:', error);
    throw error;
  }
};

/**
 * Delete product
 * @param {Number} id - Product ID
 * @returns {Boolean} Success status
 */
const deleteProduct = async (id) => {
  try {
    const { Product } = db.initModels();
    const product = await Product.findByPk(id);
    
    if (!product) {
      throw { statusCode: 404, message: 'Product not found' };
    }
    
    await product.destroy();
    return true;
  } catch (error) {
    logger.error('Delete product error:', error);
    throw error;
  }
};

/**
 * Add image to product
 * @param {Number} productId - Product ID
 * @param {Object} imageData - Image data
 * @returns {Object} Created image
 */
const addProductImage = async (productId, imageData) => {
  try {
    const { Product, ProductImage } = db.initModels();
    const product = await Product.findByPk(productId);
    
    if (!product) {
      throw { statusCode: 404, message: 'Product not found' };
    }
    
    // If this is set as primary, unset other primary images
    if (imageData.is_primary) {
      await ProductImage.update(
        { is_primary: false },
        { where: { product_id: productId } }
      );
    }
    
    // Create image
    const image = await ProductImage.create({
      ...imageData,
      product_id: productId
    });
    
    return image;
  } catch (error) {
    logger.error('Add product image error:', error);
    throw error;
  }
};

/**
 * Delete product image
 * @param {Number} productId - Product ID
 * @param {Number} imageId - Image ID
 * @returns {Boolean} Success status
 */
const deleteProductImage = async (productId, imageId) => {
  try {
    const { ProductImage } = db.initModels();
    const image = await ProductImage.findOne({
      where: {
        id: imageId,
        product_id: productId
      }
    });
    
    if (!image) {
      throw { statusCode: 404, message: 'Image not found' };
    }
    
    await image.destroy();
    return true;
  } catch (error) {
    logger.error('Delete product image error:', error);
    throw error;
  }
};

/**
 * Set all images as non-primary for a product
 * @param {Number} productId - Product ID
 * @returns {Boolean} Success status
 */
const setAllImagesNonPrimary = async (productId) => {
  try {
    const { ProductImage } = db.initModels();
    await ProductImage.update(
      { is_primary: false },
      { where: { product_id: productId } }
    );
    return true;
  } catch (error) {
    logger.error('Set all images non-primary error:', error);
    throw error;
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  addProductImage,
  deleteProductImage,
  setAllImagesNonPrimary
};


