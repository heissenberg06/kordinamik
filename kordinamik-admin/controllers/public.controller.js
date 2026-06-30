const productService = require('../services/product.service');
const dealerAuthMiddleware = require('../middlewares/dealer-auth.middleware');
const logger = require('../config/logger');

/**
 * Get public products (with or without prices based on authentication)
 */
const getPublicProducts = async (req, res, next) => {
  try {
    // Add is_active=true to query to only show active products
    const query = { ...req.query, is_active: 'true' };
    
    const products = await productService.getAllProducts(query);
    
    // Check if user is authenticated as dealer
    const isDealer = req.headers.authorization ? await checkDealerAuth(req) : false;
    
    // Transform products for public view
    const transformedProducts = products.rows.map(product => {
      // Process image data if available
      let imageUrl = null;
      if (product.ProductImages && product.ProductImages.length > 0) {
        const productImage = product.ProductImages[0];
        if (productImage.image_data) {
          const imageBuffer = productImage.image_data;
          const base64Image = Buffer.from(imageBuffer).toString('base64');
          imageUrl = `data:${productImage.image_type || 'image/jpeg'};base64,${base64Image}`;
        }
      }
      
      // Process cover photo
      let coverPhoto = null;
      if (product.cover_photo) {
        const base64Image = Buffer.from(product.cover_photo).toString('base64');
        coverPhoto = `data:${product.cover_photo_type || 'image/jpeg'};base64,${base64Image}`;
      }

      // Return product data
      return {
        id: product.id,
        name: product.name,
        model: product.model,
        description: product.description,
        // Only include price if user is authenticated as dealer
        price: isDealer ? product.price : null,
        category_id: product.category_id,
        category_name: product.Category ? product.Category.name : null,
        image: imageUrl,
        cover_photo: coverPhoto
      };
    });
    
    res.status(200).json({
      status: 'success',
      data: {
        count: products.count,
        products: transformedProducts,
        is_dealer: isDealer
      }
    });
  } catch (error) {
    logger.error('Get public products error:', error);
    next(error);
  }
};

/**
 * Get public product by ID (with or without price based on authentication)
 */
const getPublicProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const product = await productService.getProductById(id);
    
    // Check if product is active
    if (!product.is_active) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }
    
    // Check if user is authenticated as dealer
    const isDealer = req.headers.authorization ? await checkDealerAuth(req) : false;
    
    // Process images
    const images = product.ProductImages.map(img => {
      if (img.image_data) {
        const base64Image = Buffer.from(img.image_data).toString('base64');
        return {
          id: img.id,
          is_primary: img.is_primary,
          image_url: `data:${img.image_type || 'image/jpeg'};base64,${base64Image}`
        };
      }
      return null;
    }).filter(img => img !== null);
    
    // Process technical details image
    let technicalDetailsImage = null;
    if (product.technical_details_image) {
      const base64Image = Buffer.from(product.technical_details_image).toString('base64');
      technicalDetailsImage = `data:${product.technical_details_image_type || 'image/jpeg'};base64,${base64Image}`;
    }

    // Process cover photo
    let coverPhoto = null;
    if (product.cover_photo) {
      const base64Image = Buffer.from(product.cover_photo).toString('base64');
      coverPhoto = `data:${product.cover_photo_type || 'image/jpeg'};base64,${base64Image}`;
    }

    // Return product data
    const productData = {
      id: product.id,
      name: product.name,
      model: product.model,
      description: product.description,
      // Only include price if user is authenticated as dealer
      price: isDealer ? product.price : null,
      category_id: product.category_id,
      category_name: product.Category ? product.Category.name : null,
      images: images,
      technical_details_image: technicalDetailsImage,
      cover_photo: coverPhoto,
      is_dealer: isDealer
    };
    
    res.status(200).json({
      status: 'success',
      data: productData
    });
  } catch (error) {
    logger.error('Get public product by ID error:', error);
    next(error);
  }
};

/**
 * Check if the request has valid dealer authentication
 */
const checkDealerAuth = async (req) => {
  try {
    // Create a mock response object to capture authentication result
    const res = {
      status: () => ({
        json: () => {}
      })
    };
    
    // Create a next function that captures the result
    let isAuthenticated = false;
    const next = () => {
      isAuthenticated = true;
    };
    
    // Try to authenticate the dealer
    await dealerAuthMiddleware.authenticateDealer(req, res, next);
    
    return isAuthenticated;
  } catch (error) {
    return false;
  }
};

module.exports = {
  getPublicProducts,
  getPublicProductById
};