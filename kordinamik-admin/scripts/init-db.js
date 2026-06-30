require('dotenv').config();
const { sequelize, initModels, syncDatabase } = require('../config/db');
const logger = require('../config/logger');

async function initializeDatabase() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    console.log('Initializing models...');
    initModels();
    
    console.log('Creating database tables...');
    // Force: true will drop tables if they exist
    await syncDatabase(true);
    console.log('Database tables created successfully.');
    
    console.log('Database initialization completed successfully!');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    await sequelize.close();
    process.exit();
  }
}

// Run the function
initializeDatabase();
