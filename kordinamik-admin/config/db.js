const { Sequelize } = require('sequelize');

// Environment-backed configuration (defaults kept for local/dev)
const DB_NAME = process.env.DB_NAME || 'kordinamik_admin';
const DB_USER = process.env.DB_USER || 'postgres';
const DB_PASS = process.env.DB_PASSWORD || '123456528';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432;

// In production, require env vars to be set
if (process.env.NODE_ENV === 'production') {
  ['DB_NAME', 'DB_USER', 'DB_PASSWORD', 'DB_HOST', 'DB_PORT'].forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missing required database env var: ${key}`);
    }
  });
}

// Create Sequelize instance
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Model references
let models = null;

// Initialize models
const initModels = () => {
  if (models) return models;
  
  // Import models
  const Admin = require('../models/admin.model')(sequelize);
  const Category = require('../models/category.model')(sequelize);
  const Product = require('../models/product.model')(sequelize);
  const ProductImage = require('../models/product-image.model')(sequelize);
  const Order = require('../models/order.model')(sequelize);
  const OrderItem = require('../models/order-item.model')(sequelize);
  const TokenBlacklist = require('../models/token-blacklist.model')(sequelize);
  const AuditLog = require('../models/audit-log.model')(sequelize);
  const DealerApplication = require('../models/dealer-application.model')(sequelize);
  const Dealer = require('../models/dealer.model')(sequelize);
  const WarrantyRegistration = require('../models/warranty-registration.model')(sequelize);

  // Define associations
  Category.hasMany(Product, { foreignKey: 'category_id' });
  Product.belongsTo(Category, { foreignKey: 'category_id' });
  
  Product.hasMany(ProductImage, { foreignKey: 'product_id', onDelete: 'CASCADE' });
  ProductImage.belongsTo(Product, { foreignKey: 'product_id' });

  // Order associations
  Dealer.hasMany(Order, { foreignKey: 'dealer_id' });
  Order.belongsTo(Dealer, { foreignKey: 'dealer_id' });

  Order.hasMany(OrderItem, { foreignKey: 'order_id', onDelete: 'CASCADE' });
  OrderItem.belongsTo(Order, { foreignKey: 'order_id' });

  Product.hasMany(OrderItem, { foreignKey: 'product_id' });
  OrderItem.belongsTo(Product, { foreignKey: 'product_id' });
  
  Admin.hasMany(AuditLog, { foreignKey: 'admin_id' });
  AuditLog.belongsTo(Admin, { foreignKey: 'admin_id' });
  
  Admin.hasMany(DealerApplication, { foreignKey: 'approved_by' });
  DealerApplication.belongsTo(Admin, { foreignKey: 'approved_by' });
  
  // Dealer associations
  DealerApplication.hasOne(Dealer, { foreignKey: 'application_id' });
  Dealer.belongsTo(DealerApplication, { foreignKey: 'application_id' });

  // Warranty associations
  Product.hasMany(WarrantyRegistration, { foreignKey: 'product_id' });
  WarrantyRegistration.belongsTo(Product, { foreignKey: 'product_id' });

  models = {
    Admin,
    Category,
    Product,
    ProductImage,
    Order,
    OrderItem,
    TokenBlacklist,
    AuditLog,
    DealerApplication,
    Dealer,
    WarrantyRegistration
  };
  
  return models;
};

// Sync database
const syncDatabase = async (force = false) => {
  try {
    await sequelize.sync({ force });
    console.log('Database synced successfully');
  } catch (error) {
    console.error('Error syncing database:', error);
  }
};

module.exports = {
  sequelize,
  initModels,
  syncDatabase
};

