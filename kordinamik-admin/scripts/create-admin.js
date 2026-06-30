require('dotenv').config();
const { sequelize, initModels, syncDatabase } = require('../config/db');
const logger = require('../config/logger');

// Default admin credentials (override via env vars; no hardcoded secrets)
const DEFAULT_ADMIN = {
  username: process.env.INITIAL_ADMIN_USERNAME || 'admin',
  password: process.env.INITIAL_ADMIN_PASSWORD,
  email: process.env.INITIAL_ADMIN_EMAIL || 'admin@kordinamik.com',
  full_name: process.env.INITIAL_ADMIN_FULL_NAME || 'Admin User'
};

if (!DEFAULT_ADMIN.password) {
  console.error('INITIAL_ADMIN_PASSWORD env var is required to create the initial admin.');
  process.exit(1);
}

async function createInitialAdmin() {
  try {
    // Initialize database connection
    await sequelize.authenticate();
    console.log('Database connection established.');
    
    // Initialize models
    const { Admin } = initModels();
    
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({
      where: { username: DEFAULT_ADMIN.username }
    });
    
    if (existingAdmin) {
      console.log('Admin user already exists. Skipping creation.');
      return;
    }
    
    // Create admin
    const admin = await Admin.create({
      username: DEFAULT_ADMIN.username,
      password_hash: DEFAULT_ADMIN.password, // Will be hashed by model hook
      email: DEFAULT_ADMIN.email,
      full_name: DEFAULT_ADMIN.full_name,
      is_active: true
    });
    
    console.log('Initial admin user created successfully:');
    console.log(`Username: ${DEFAULT_ADMIN.username}`);
    console.log(`Password: ${DEFAULT_ADMIN.password}`);
    console.log('\nIMPORTANT: Change this password immediately after first login.');
    
  } catch (error) {
    console.error('Error creating initial admin:', error);
  } finally {
    // Close database connection
    await sequelize.close();
  }
}

// Run the function
createInitialAdmin();


