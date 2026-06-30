require('dotenv').config();
const app = require('./app');
const { sequelize, initModels, syncDatabase } = require('./config/db');

const PORT = process.env.PORT || 3001;

// Test database connection and sync database
async function initializeDatabase() {
  try {
    // Test connection
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    // Initialize models
    initModels();
    
    // Sync database - create tables if they don't exist
    await syncDatabase(false);
    console.log('Database synchronized successfully.');
  } catch (error) {
    console.error('Unable to initialize database:', error);
  }
}

// Start server
app.listen(PORT, async () => {
  await initializeDatabase();
  console.log(`Server is running on port ${PORT}`);
});

